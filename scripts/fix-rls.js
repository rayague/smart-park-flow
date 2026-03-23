const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://apluoxapgpgfdsuofhil.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbHVveGFwZ3BnZmRzdW9maGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM3MTYxMSwiZXhwIjoyMDg1OTQ3NjExfQ.kUNUeD4MW1dyvw86o8PJNGnwlYQeMpl7yMbVylhrmtY";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const sqlStatements = [
  // List current policies first
  `SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'`,
];

async function run() {
  console.log("=== Diagnosing profiles RLS policies ===\n");

  // 1. Check current policies via pg_policies view
  const { data: policies, error: polErr } = await supabase
    .from("pg_policies")
    .select("*")
    .eq("tablename", "profiles")
    .eq("schemaname", "public");

  if (polErr) {
    console.log("Cannot query pg_policies directly:", polErr.message);
  } else {
    console.log("Current policies on profiles:");
    (policies || []).forEach((p) => {
      console.log(`  - ${p.policyname} (${p.cmd}): USING(${p.qual}) WITH CHECK(${p.with_check})`);
    });
  }

  // 2. Test service role access to profiles
  console.log("\n=== Testing service role access ===");
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("*")
    .limit(5);
  
  if (profErr) {
    console.log("Profiles access with service role:", profErr.message);
  } else {
    console.log("Profiles accessible! Count:", profiles.length);
    profiles.forEach((p) => console.log(`  - ${p.name} (${p.role}) - ${p.email}`));
  }

  // 3. Test parkings
  const { data: parkings, error: parkErr } = await supabase
    .from("parkings")
    .select("id, name, city")
    .limit(5);
  
  if (parkErr) {
    console.log("Parkings:", parkErr.message);
  } else {
    console.log("\nParkings available:", parkings.length);
    parkings.forEach((p) => console.log(`  - ${p.name} (${p.city})`));
  }

  // 4. Check if there's a signup trigger
  console.log("\n=== Checking auth triggers ===");
  const { data: triggers, error: trigErr } = await supabase
    .from("information_schema.triggers")  
    .select("*")
    .limit(5);

  if (trigErr) {
    console.log("Cannot query triggers:", trigErr.message);
  }

  // 5. Test signup with service role
  console.log("\n=== Testing signup with service role ===");
  const testEmail = "testfix_" + Date.now() + "@test.com";
  const { data: signupData, error: signupErr } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: "TestPass123!",
    email_confirm: true,
    user_metadata: { name: "Test Fix User", role: "USER" },
  });

  if (signupErr) {
    console.log("Admin createUser ERROR:", signupErr.message);
  } else {
    console.log("Admin createUser OK! User ID:", signupData.user?.id);
    
    // Try to create profile manually
    if (signupData.user) {
      const { error: profileErr } = await supabase.from("profiles").upsert({
        id: signupData.user.id,
        email: testEmail,
        name: "Test Fix User",
        role: "USER",
      });
      if (profileErr) {
        console.log("Profile insert ERROR:", profileErr.message);
      } else {
        console.log("Profile created successfully!");
      }

      // Clean up test user
      await supabase.auth.admin.deleteUser(signupData.user.id);
      console.log("Test user cleaned up.");
    }
  }

  // 6. Now test normal signup (like the frontend does)
  console.log("\n=== Testing normal signup (like frontend) ===");
  const anonSupabase = createClient(SUPABASE_URL, "sb_publishable_BTJIxPPJBVXg6qCnhvdBYg_XzlivyXi");
  const testEmail2 = "testanon_" + Date.now() + "@test.com";
  const { data: anonSignup, error: anonErr } = await anonSupabase.auth.signUp({
    email: testEmail2,
    password: "TestPass123!",
    options: { data: { name: "Anon Test", role: "USER" } }
  });

  if (anonErr) {
    console.log("Anon signup ERROR:", anonErr.message, anonErr.status);
  } else {
    console.log("Anon signup result:");
    console.log("  User:", anonSignup.user?.id || "none");
    console.log("  Session:", anonSignup.session ? "yes" : "no (email confirm needed)");
  }
}

run().catch((e) => console.error("Fatal:", e));
