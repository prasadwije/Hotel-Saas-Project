import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type SiteData = {
  id: string
  subdomain: string | null
  custom_domain: string | null
  is_admin_accessible: boolean
  status: string
  site_config: Record<string, unknown>
}

/**
 * Resolve hotel site data from a hostname string.
 * Uses the get_site_data(header_host) RPC which runs SECURITY DEFINER.
 * Safe to call from Server Components and from the proxy middleware.
 */
export async function getSiteData(host: string): Promise<SiteData | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignore when called from Server Component
          }
        },
      },
    }
  )

  const { data, error } = await supabase.rpc('get_site_data', { header_host: host })
  if (error || !data || data.length === 0) return null
  return data[0] as SiteData
}

/**
 * Lightweight version for the proxy (edge) — uses the service role key
 * so it can call the RPC without relying on user cookies.
 * NOTE: only import this from proxy.ts, never from client-side code.
 */
export function getSiteDataForProxy(host: string) {
  // We use the Supabase REST API directly from the proxy using fetch
  // to avoid importing the full @supabase/ssr in the edge runtime.
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_site_data`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    },
    body: JSON.stringify({ header_host: host }),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((rows: SiteData[] | null) => (rows && rows.length > 0 ? rows[0] : null))
    .catch(() => null)
}
