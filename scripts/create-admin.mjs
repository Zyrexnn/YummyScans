#!/usr/bin/env node
// Create an admin account in Supabase.
// Requires the SERVICE ROLE key (bypasses RLS to insert into admin_users).
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-admin.mjs <email> <password>
//
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (service role key, not the anon key).')
  process.exit(1)
}

const email = process.argv[2]
const password = process.argv[3]
if (!email || !password) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password>')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (error) {
  console.error('Gagal membuat user:', error.message)
  process.exit(1)
}

const userId = data.user.id

const { error: insErr } = await supabase.from('admin_users').insert({ id: userId, role: 'admin' })
if (insErr) {
  console.error('User dibuat tapi gagal insert ke admin_users:', insErr.message)
  process.exit(1)
}

console.log(`Admin berhasil dibuat: ${email} (${userId})`)
