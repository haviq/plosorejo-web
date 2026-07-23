/**
 * Backup local content JSON into content/backups/<timestamp>/
 * Run: npm run content:backup
 */

import { mkdirSync, copyFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const contentDir = resolve(root, 'content')
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const outDir = resolve(contentDir, 'backups', stamp)

mkdirSync(outDir, { recursive: true })

const files = readdirSync(contentDir).filter((f) => f.endsWith('.json'))
for (const f of files) {
  copyFileSync(join(contentDir, f), join(outDir, f))
}

const manifest = {
  createdAt: new Date().toISOString(),
  files,
  note: 'Local JSON backup. Export Sanity separately from manage.sanity.io if CMS is primary.',
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`✅ Backup saved to content/backups/${stamp}`)
console.log(`   files: ${files.join(', ')}`)
