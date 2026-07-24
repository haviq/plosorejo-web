# Security notes for Padukuhan Plosorejo portal

## Production checklist

1. **Set `CRON_SECRET`** in Vercel → Project → Settings → Environment Variables  
   - Min 16 random characters (`openssl rand -hex 24`)  
   - Vercel Cron will send `Authorization: Bearer <CRON_SECRET>` when configured  
   - Without it, `/api/cron/*` returns **503** in production (fail closed)  
   - After setting: Redeploy, then test:  
     `curl -H "Authorization: Bearer $CRON_SECRET" https://plosorejo-web.vercel.app/api/cron/merapi`

2. **Sanity Studio (`/studio`)**  
   - Access control is managed in [sanity.io/manage](https://www.sanity.io/manage) (login users)  
   - Do **not** put `SANITY_API_WRITE_TOKEN` in `NEXT_PUBLIC_*`  
   - Prefer inviting only trusted editors

3. **Headers** (see `next.config.ts`)  
   - CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy  
   - Studio has a looser CSP (needs eval)

4. **Rate limits**  
   - `/api/merapi`: 60 req/min/IP (10/min when `?force=1`)  
   - Headers: `X-RateLimit-*`, `Retry-After` on 429

5. **External links from CMS**  
   - Use `lib/safe-url.ts` helpers (`safeMapsHref`, `safeOfficialHref`, `isSafeHref`)  
   - Blocks `javascript:`, `data:`, credentialed URLs  
   - Mappers in `lib/data/mappers.ts` sanitize CMS text + maps/WA fields

6. **WhatsApp**  
   - `waLink` in `lib/site.ts` validates length / digits only

7. **Git**  
   - Never commit `.env*` secrets (gitignored; `.env.example` allowed)  
   - Rotate any PAT that was ever embedded in a remote URL

## Sensitive endpoints

| Path | Public? | Notes |
|------|---------|-------|
| `/api/merapi` | Yes (read) | Rate limited; no secrets |
| `/api/cron/merapi` | No | Requires `CRON_SECRET` |
| `/studio` | Auth via Sanity | Editors only |

## A11y baseline

- Skip link → `#main-content`
- Focus-visible gold outline
- Mobile menu: Escape + focus restore
- Touch targets ≥ 44px on mobile CTAs
- `prefers-reduced-motion` respected
