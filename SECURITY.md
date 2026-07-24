# Security notes for Padukuhan Plosorejo portal

## Production checklist

1. **Set `CRON_SECRET`** in Vercel → Project → Settings → Environment Variables  
   - Min 16 random characters  
   - Vercel Cron will send `Authorization: Bearer <CRON_SECRET>` when configured  
   - Without it, `/api/cron/*` returns **503** in production (fail closed)

2. **Sanity Studio (`/studio`)**  
   - Access control is managed in [sanity.io/manage](https://www.sanity.io/manage) (login users)  
   - Do **not** put `SANITY_API_WRITE_TOKEN` in `NEXT_PUBLIC_*`  
   - Prefer inviting only trusted editors

3. **Headers** (see `next.config.ts`)  
   - CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy  
   - Studio has a looser CSP (needs eval)

4. **External links from CMS**  
   - Use `lib/safe-url.ts` helpers (`safeMapsHref`, `safeOfficialHref`, `isSafeHref`)  
   - Blocks `javascript:`, `data:`, credentialed URLs

5. **WhatsApp**  
   - `waLink` in `lib/site.ts` validates length / digits only

6. **Git**  
   - Never commit `.env*` secrets (gitignored)  
   - Rotate any PAT that was ever embedded in a remote URL

## Sensitive endpoints

| Path | Public? | Notes |
|------|---------|-------|
| `/api/merapi` | Yes (read) | Cached 5m; no secrets |
| `/api/cron/merapi` | No | Requires `CRON_SECRET` |
| `/studio` | Auth via Sanity | Editors only |
