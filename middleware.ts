import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { secretsEqual } from '@/lib/secure-compare'

/**
 * Edge middleware:
 * - Protect /api/cron/* with CRON_SECRET when configured (Bearer preferred)
 * - Block common probe paths early
 * - Never expose stack details
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Cron protection -------------------------------------------------
  if (pathname.startsWith('/api/cron')) {
    const secret = process.env.CRON_SECRET
    // Vercel Cron sends Authorization: Bearer *** when configured.
    if (secret && secret.length >= 16) {
      const auth = request.headers.get('authorization') || ''
      const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
      // Query secret still accepted for manual ops, but prefer Bearer (no log leak)
      const q = request.nextUrl.searchParams.get('secret') || ''
      const ok = secretsEqual(bearer, secret) || secretsEqual(q, secret)
      if (!ok) {
        return NextResponse.json(
          { ok: false, error: 'unauthorized' },
          {
            status: 401,
            headers: {
              'Cache-Control': 'no-store',
              'X-Content-Type-Options': 'nosniff',
            },
          },
        )
      }
    }
  }

  // --- Quiet common scanners ------------------------------------------
  if (
    pathname.startsWith('/.env') ||
    pathname.startsWith('/.git') ||
    pathname === '/wp-admin' ||
    pathname === '/wp-login.php' ||
    pathname === '/xmlrpc.php'
  ) {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/cron/:path*',
    '/.env',
    '/.env/:path*',
    '/.git/:path*',
    '/wp-admin',
    '/wp-login.php',
    '/xmlrpc.php',
  ],
}
