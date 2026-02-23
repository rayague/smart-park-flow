import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const USERS = [
  {
    email: 'user@smartpark.com',
    password: 'Smartpark!2026User',
    profile: { name: 'Regular User', role: 'USER' },
  },
  {
    email: 'manager@smartpark.com',
    password: 'Smartpark!2026Manager',
    profile: { name: 'Manager User', role: 'MANAGER' },
  },
  {
    email: 'admin@smartpark.com',
    password: 'Smartpark!2026Admin',
    profile: { name: 'Admin User', role: 'ADMIN' },
  },
];

async function ensureUser({ email, password, profile }) {
  const { data: listed, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listErr) throw listErr;

  const existing = listed.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());

  let user;
  if (existing) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      email,
      password,
      user_metadata: {
        name: profile.name,
        role: profile.role,
      },
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: profile.name,
        role: profile.role,
      },
    });
    if (error) throw error;
    user = data.user;
  }

  const now = new Date().toISOString();
  const { error: upsertErr } = await supabaseAdmin
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email,
        name: profile.name,
        role: profile.role,
        updated_at: now,
      },
      { onConflict: 'id' }
    );

  if (upsertErr) throw upsertErr;

  return { id: user.id, email };
}

async function main() {
  console.log('Seeding Supabase Auth users + profiles...');

  for (const entry of USERS) {
    const result = await ensureUser(entry);
    console.log(`OK: ${result.email} (${result.id})`);
  }

  console.log('\nCredentials created/updated:');
  for (const entry of USERS) {
    console.log(`- ${entry.email} / ${entry.password}`);
  }
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
