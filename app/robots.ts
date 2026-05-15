import type { MetadataRoute } from 'next'

/**
 * Dynamic robots.txt for the multi-tenant Hotel SaaS.
 *
 * - Admin, login, and bookings paths are blocked for all crawlers on every domain.
 * - All other hotel content is allowed.
 *
 * This file runs at request time (it's a Route Handler), so it can
 * theoretically be extended to per-tenant rules via Supabase if needed.
 */
export default function robots(): MetadataRoute.Robots {
  const saasDomain = process.env.NEXT_PUBLIC_SAAS_DOMAIN ?? 'hotelsaas.com'

  return {
    rules: [
      {
        // Block sensitive paths on ALL domains (tenant + SaaS)
        userAgent: '*',
        disallow: ['/admin', '/admin/', '/login', '/login/', '/bookingsmanagement', '/bookingsmanagement/'],
        allow: '/',
      },
    ],
    // Point the sitemap to the SaaS root (individual tenants can override
    // once per-tenant sitemap generation is wired up)
    sitemap: `https://${saasDomain}/sitemap.xml`,
  }
}
