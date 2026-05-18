/**
 * Dynamic multi-tenant sitemap generator.
 *
 * Strategy:
 * 1. Read the `host` header at request time to identify the current tenant.
 * 2. Call the `get_site_data` Supabase RPC to resolve hotel details.
 * 3. Fetch the hotel's rooms from `hotel_rooms` for dynamic room paths.
 * 4. Return a fully-formed sitemap scoped to this tenant's canonical origin.
 *
 * Runs server-side at request time because it reads `next/headers`,
 * so Next.js will NOT statically cache this file — correct behaviour for
 * a multi-tenant platform where each domain must get its own sitemap.
 */

import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

// ─── Types ───────────────────────────────────────────────────────────────────

type SiteData = {
  id: string
  subdomain: string | null
  custom_domain: string | null
  status: string
  site_config: {
    siteLayout?: 'single-page' | 'multi-page'
    pages?: Record<string, boolean>
    rooms?: { name: string }[]
  }
}

type RoomRow = {
  id: string
  name: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolve the tenant via the `get_site_data` RPC using a plain fetch call
 * (no edge/cookie dependency), safe to use from a Route Handler.
 */
async function resolveTenant(host: string): Promise<SiteData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) return null

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_site_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ header_host: host }),
      // No caching — sitemap must always reflect current DB state
      cache: 'no-store',
    })

    if (!res.ok) return null
    const rows: SiteData[] = await res.json()
    return rows && rows.length > 0 ? rows[0] : null
  } catch {
    return null
  }
}

/**
 * Fetch rooms for this hotel from the `hotel_rooms` table.
 * Returns an empty array on any failure so the sitemap still generates.
 */
async function fetchRooms(hotelId: string): Promise<RoomRow[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) return []

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/hotel_rooms?hotel_id=eq.${hotelId}&select=id,name`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

/**
 * Determine the canonical origin for this tenant.
 * Prefers custom_domain → subdomain.SAAS_DOMAIN → falls back to the raw host.
 */
function canonicalOrigin(tenant: SiteData, host: string): string {
  if (tenant.custom_domain) {
    return `https://${tenant.custom_domain}`
  }

  const saasDomain = process.env.NEXT_PUBLIC_SAAS_DOMAIN
  if (saasDomain && tenant.subdomain) {
    return `https://${tenant.subdomain}.${saasDomain}`
  }

  // Fallback: just use the incoming host
  return host.startsWith('http') ? host : `https://${host}`
}

// ─── Sub-page detection ───────────────────────────────────────────────────────

const SUB_PAGES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/about',      changeFrequency: 'monthly', priority: 0.7 },
  { path: '/rooms',      changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/menu',       changeFrequency: 'weekly',  priority: 0.6 },
  { path: '/gallery',    changeFrequency: 'monthly', priority: 0.5 },
  { path: '/amenities',  changeFrequency: 'monthly', priority: 0.5 },
  { path: '/location',   changeFrequency: 'yearly',  priority: 0.4 },
]

// ─── Sitemap export ───────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Read the incoming host so we can identify the correct tenant
  const headerStore = await headers()
  const host = headerStore.get('host') ?? ''

  const now = new Date()

  // ── Platform root (SaaS marketing site) ──────────────────────────────────
  // If the request is for the root SaaS domain (no hotel sub-path), return a
  // minimal platform sitemap so Google can still crawl the landing page.
  const saasDomain = process.env.NEXT_PUBLIC_SAAS_DOMAIN ?? ''
  if (!host || host === saasDomain || host === `www.${saasDomain}`) {
    return [
      {
        url: `https://${saasDomain}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 1,
      },
    ]
  }

  // ── Tenant resolution ──────────────────────────────────────────────────────
  const tenant = await resolveTenant(host)

  if (!tenant) {
    // Unknown host — return a placeholder so the route handler doesn't 500
    return []
  }

  const origin = canonicalOrigin(tenant, host)
  const isMultiPage = tenant.site_config?.siteLayout === 'multi-page'
  const enabledPages: Record<string, boolean> = tenant.site_config?.pages ?? {}

  // ── Root / home ────────────────────────────────────────────────────────────
  const urls: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // ── Static sub-pages (multi-page layout only) ──────────────────────────────
  if (isMultiPage) {
    for (const page of SUB_PAGES) {
      // Strip leading slash to check pages config key (e.g. 'about', 'rooms')
      const key = page.path.replace(/^\//, '')

      // Only include the page if it's explicitly enabled (or not configured,
      // i.e. undefined — we default to including it for safety).
      const isEnabled = enabledPages[key] !== false

      if (isEnabled) {
        urls.push({
          url: `${origin}${page.path}`,
          lastModified: now,
          changeFrequency: page.changeFrequency,
          priority: page.priority,
        })
      }
    }

    // ── Dynamic room pages ─────────────────────────────────────────────────
    const rooms = await fetchRooms(tenant.id)

    for (const room of rooms) {
      if (!room.id) continue
      urls.push({
        url: `${origin}/rooms/${room.id}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    }
  }

  return urls
}
