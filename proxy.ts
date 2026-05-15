import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { getSiteDataForProxy } from '@/lib/supabase/get-site-data'

/**
 * Multi-tenant proxy for Next.js 16.
 *
 * Resolution order for every incoming request:
 * 1. Refresh the Supabase auth session cookie.
 * 2. Call get_site_data(host) RPC to identify the tenant.
 * 3a. If hotel has a custom_domain and the visitor came via the subdomain → 301 to custom_domain (SEO).
 * 3b. If /admin is accessed and is_admin_accessible is false → 404.
 * 3c. Rewrite all URLs internally to /[hotelId]/[path].
 * 4. If no hotel is found and the path is already a known platform path → pass through.
 *    Otherwise return 404.
 *
 * NOTE: The exported function name MUST match the filename ("proxy") for Next.js 16.
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname } = url

  // ── Always skip internal Next.js paths ──────────────────────────────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next({ request })
  }

  // ── Skip paths that are already platform-level (no tenant) ──────────────
  // /login is a global SaaS page, not a tenant page.
  const PLATFORM_PATHS = ['/login']
  const isPlatformPath = PLATFORM_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  // ── Determine host ───────────────────────────────────────────────────────
  const host = request.headers.get('host') ?? ''

  // Skip resolution for localhost without a subdomain — useful for local dev
  // when hitting the root: return the session refresh and let Next handle it.
  const isLocalhostRoot =
    (host === 'localhost:3000' || host === 'localhost') && !pathname.startsWith('/[')

  // ── Session refresh (runs for every request) ─────────────────────────────
  const sessionResponse = await updateSession(request)

  if (isPlatformPath || isLocalhostRoot) {
    return sessionResponse
  }

  // ── Tenant resolution ────────────────────────────────────────────────────
  const siteData = await getSiteDataForProxy(host)

  if (!siteData) {
    // No hotel matched this host. Return 404 for unknown tenant hosts.
    return new NextResponse('Hotel not found', { status: 404 })
  }

  const hotelId = siteData.id

  // ── 301 Redirect: subdomain → custom domain (SEO canonical) ─────────────
  // Only redirect if the hotel has a custom_domain AND the visitor is NOT
  // already on it (i.e. they came via the *.saas subdomain).
  if (siteData.custom_domain && host !== siteData.custom_domain) {
    const redirectUrl = new URL(request.url)
    redirectUrl.host = siteData.custom_domain
    return NextResponse.redirect(redirectUrl, { status: 301 })
  }

  // ── Admin guard ───────────────────────────────────────────────────────────
  // If the hotel owner has disabled admin access AND someone hits /admin,
  // return 404 immediately (do NOT leak that admin exists).
  if (!siteData.is_admin_accessible && pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 })
  }

  // ── Internal rewrite: /path → /[hotelId]/path ───────────────────────────
  // We do NOT change what the browser sees — the URL stays clean.
  // Next.js routing picks up /[hotelId]/* dynamically.
  url.pathname = `/${hotelId}${pathname === '/' ? '' : pathname}`

  const rewriteResponse = NextResponse.rewrite(url)

  // Forward cookies from the session refresh onto the rewrite response
  sessionResponse.cookies.getAll().forEach(({ name, value, ...opts }) => {
    rewriteResponse.cookies.set(name, value, opts)
  })

  return rewriteResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - common image extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
