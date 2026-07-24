import type { NextConfig } from 'next'

/**
 * Security headers for the public site.
 * Studio (/studio) gets a looser CSP because Sanity needs eval/inline + websockets.
 *
 * IMPORTANT: Next merges matching header rules; later entries override the same key.
 * Studio rules must come AFTER the public catch-all so studioCsp wins.
 */
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
]

/** Public pages CSP — allows Leaflet tiles, Sanity images, OSM embed, MAGMA links */
const publicCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://wa.me https://api.whatsapp.com",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://*.basemaps.cartocdn.com https://unpkg.com https://cdnjs.cloudflare.com",
  "font-src 'self' data:",
  "connect-src 'self' https://cdn.sanity.io https://*.api.sanity.io https://*.sanity.io https://magma.esdm.go.id https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org",
  "frame-src 'self' https://www.openstreetmap.org https://openstreetmap.org",
  "worker-src 'self' blob:",
  'upgrade-insecure-requests',
].join('; ')

/** Sanity Studio needs eval, styled-components, live websockets */
const studioCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com https://*.sanity.io https://cdn.sanity.io",
  "style-src 'self' 'unsafe-inline' https://core.sanity-cdn.com https://*.sanity.io",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data: https:",
  "connect-src 'self' https: wss: https://*.api.sanity.io https://*.sanity.io https://core.sanity-cdn.com",
  "frame-src 'self' https://*.sanity.io https://core.sanity-cdn.com",
  "worker-src 'self' blob:",
].join('; ')

const studioHeaders = [
  ...securityHeaders,
  { key: 'Content-Security-Policy', value: studioCsp },
  { key: 'Cache-Control', value: 'private, no-store' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Sanity Studio uses styled-components / large client bundle
  transpilePackages: ['next-sanity'],
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      },
      {
        source: '/api/merapi',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=900' },
        ],
      },
      // Public catch-all first
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Content-Security-Policy', value: publicCsp },
        ],
      },
      // Studio LAST so CSP overrides public catch-all
      {
        source: '/studio',
        headers: studioHeaders,
      },
      {
        source: '/studio/:path*',
        headers: studioHeaders,
      },
    ]
  },
}

export default nextConfig
