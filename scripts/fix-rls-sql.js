const SUPABASE_URL = "https://apluoxapgpgfdsuofhil.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbHVveGFwZ3BnZmRzdW9maGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM3MTYxMSwiZXhwIjoyMDg1OTQ3NjExfQ.kUNUeD4MW1dyvw86o8PJNGnwlYQeMpl7yMbVylhrmtY";

async function runSQL(sql) {
  // Try the /pg endpoint (Supabase SQL over HTTP)
  const endpoints = [
    "/rest/v1/rpc/exec_sql",
    "/pg/query",
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${SUPABASE_URL}${ep}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SERVICE_KEY,
          "Authorization": `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify(ep.includes("rpc") ? { sql_query: sql } : { query: sql }),
      });
      const text = await res.text();
      if (res.ok) {
        console.log(`[${ep}] Success:`, text.substring(0, 200));
        return { ok: true, data: text };
      } else {
        console.log(`[${ep}] ${res.status}:`, text.substring(0, 200));
      }
    } catch (e) {
      console.log(`[${ep}] Error:`, e.message);
    }
  }
  return { ok: false };
}

async function main() {
  console.log("=== Attempting to fix RLS via SQL ===\n");

  // Step 1: Try to list policies
  console.log("Step 1: List existing policies on profiles...");
  const r1 = await runSQL(
    "SELECT policyname, cmd, permissive, qual, with_check FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'"
  );

  // Step 2: Try to check triggers
  console.log("\nStep 2: Check auth triggers...");
  const r2 = await runSQL(
    "SELECT trigger_name, event_manipulation, action_statement FROM information_schema.triggers WHERE event_object_schema = 'auth' AND event_object_table = 'users'"
  );

  // Step 3: Check the trigger function
  console.log("\nStep 3: Check handle_new_user function...");
  const r3 = await runSQL(
    "SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user'"
  );

  // Step 4: Fix - drop bad policies and recreate
  console.log("\nStep 4: Fix profiles policies...");
  const fixSQL = `
    DO $$
    DECLARE pol RECORD;
    BEGIN
      FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
      END LOOP;
    END $$;
    
    CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  `;
  const r4 = await runSQL(fixSQL);

  if (!r1.ok && !r4.ok) {
    console.log("\n=== Cannot run SQL via API. Trying alternative approach... ===\n");
    
    // Alternative: Try to connect via the database URL
    console.log("Attempting connection via pg protocol...");
    try {
      // Use the Supabase pooler endpoint
      const connStr = `postgresql://postgres.apluoxapgpgfdsuofhil:${SERVICE_KEY}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
      console.log("Connection string format ready (needs pg module)");
    } catch (e) {
      console.log("pg connection error:", e.message);
    }
  }
}

main().catch(console.error);
