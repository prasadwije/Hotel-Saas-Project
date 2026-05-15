import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HotelSaaS — Beautiful websites for boutique hotels',
  description: 'The all-in-one platform to launch, manage and grow your hotel\'s online presence.',
  robots: { index: true, follow: true },
}

/**
 * SaaS Marketing Landing Page.
 *
 * This page is served when a visitor hits the root platform domain
 * (e.g. hotelsaas.com) without a subdomain, so the proxy passes
 * through to here without performing a tenant rewrite.
 *
 * Replace this with your actual marketing site content.
 */
export default function SaaSLandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-400">
          Hotel SaaS Platform
        </p>
        <h1 className="mt-4 text-5xl font-light tracking-tight">
          Beautiful websites <br />
          <span className="text-neutral-400">for boutique hotels</span>
        </h1>
        <p className="mt-6 text-lg text-neutral-400 leading-relaxed">
          Launch your hotel's website in minutes. Full multi-tenancy,
          custom domains, SEO-ready — no code required.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
          >
            Sign in to your account
          </a>
        </div>
        <p className="mt-8 text-xs text-neutral-600">
          Each hotel gets its own subdomain (e.g. <code>yourhotel.hotelsaas.com</code>)
          or bring your own custom domain.
        </p>
      </div>
    </div>
  )
}