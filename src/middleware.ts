import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.SUPABASE_URL
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export async function onRequest(context: any, next: any) {
  const { request, cookies, redirect } = context
  const url = new URL(request.url)

  if (!url.pathname.startsWith('/admin')) return next()
  if (url.pathname === '/admin/login') return next()

  if (!SUPABASE_URL || !SUPABASE_KEY) return redirect('/admin/login')

  const access = cookies.get('sb-access-token')?.value
  const refresh = cookies.get('sb-refresh-token')?.value
  if (!access || !refresh) return redirect('/admin/login')

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data } = await supabase.auth.setSession({ access_token: access, refresh_token: refresh })
    if (!data.user) return redirect('/admin/login')

    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', data.user.id)
      .single()

    if (!admin) return redirect('/admin/login')
  } catch {
    return redirect('/admin/login')
  }

  return next()
}

export { SESSION_MAX_AGE }
