import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.SUPABASE_URL
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY

/**
 * Build a Supabase client authenticated as the current admin, using the
 * session tokens stored in cookies. Needed so RLS policies that check
 * auth.uid() (admin write/upload) pass. Throws if no valid session.
 */
export async function getAdminClient(cookies) {
  const access = cookies.get('sb-access-token')?.value
  const refresh = cookies.get('sb-refresh-token')?.value
  if (!access || !refresh) throw new Error('Sesi admin tidak ditemukan. Silakan login ulang.')

  const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await client.auth.setSession({ access_token: access, refresh_token: refresh })
  if (error || !data.user) throw new Error('Sesi admin tidak valid. Silakan login ulang.')

  return client
}
