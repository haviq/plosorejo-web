import fs from 'fs'
import path from 'path'

const roots = ['app', 'components', 'lib']
const files = []

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            if (entry.name === 'studio' || entry.name === 'node_modules') continue
            walk(full)
        } else if (/\.(tsx|ts|css)$/.test(entry.name)) {
            files.push(full)
        }
    }
}

for (const r of roots) walk(r)

const replacements = [
    // multi-color accents -> gold
    [/var\(--green\)/g, 'var(--gold)'],
    [/'#22c55e'/g, "'var(--gold)'"],
    [/"#22c55e"/g, "'var(--gold)'"],
    [/'#34d399'/g, "'var(--gold)'"],
    [/"#34d399"/g, "'var(--gold)'"],
    [/'#60a5fa'/g, "'var(--gold)'"],
    [/"#60a5fa"/g, "'var(--gold)'"],
    [/'#818cf8'/g, "'var(--gold)'"],
    [/"#818cf8"/g, "'var(--gold)'"],
    [/'#a78bfa'/g, "'var(--gold)'"],
    [/"#a78bfa"/g, "'var(--gold)'"],
    [/'#f97316'/g, "'var(--gold)'"],
    [/"#f97316"/g, "'var(--gold)'"],
    [/'#ef4444'/g, "'var(--gold)'"],
    [/"#ef4444"/g, "'var(--gold)'"],
    [/'#3b82f6'/g, "'var(--gold)'"],
    [/"#3b82f6"/g, "'var(--gold)'"],
    [/'#f59e0b'/g, "'var(--gold)'"],
    [/"#f59e0b"/g, "'var(--gold)'"],
    // rgba greens used for open/status
    [/rgba\(34,\s*197,\s*94,\s*0\.1\)/g, 'rgba(212,175,55,0.1)'],
    [/rgba\(34,\s*197,\s*94,\s*0\.12\)/g, 'rgba(212,175,55,0.12)'],
    [/rgba\(34,\s*197,\s*94,\s*0\.08\)/g, 'rgba(212,175,55,0.08)'],
    [/rgba\(34,\s*197,\s*94,\s*0\.35\)/g, 'rgba(212,175,55,0.35)'],
    [/rgba\(34,\s*197,\s*94,\s*0\.05\)/g, 'rgba(212,175,55,0.05)'],
]

let changed = 0
for (const file of files) {
    // keep merapi danger colors? user asked single color - unify all
    let s = fs.readFileSync(file, 'utf8')
    const before = s
    for (const [re, to] of replacements) s = s.replace(re, to)

    // homepage accent props
    s = s.replace(/accent: 'green' as const/g, "accent: 'amber' as const")
    s = s.replace(/accent: 'indigo' as const/g, "accent: 'amber' as const")
    s = s.replace(/accent=\{i % 2 === 0 \? 'green' : 'amber'\}/g, "accent=\"amber\"")
    s = s.replace(/accent=\{i % 2 === 0 \? 'amber' : 'green'\}/g, "accent=\"amber\"")
    s = s.replace(/accent="green"/g, 'accent="amber"')

    if (s !== before) {
        fs.writeFileSync(file, s)
        changed++
        console.log('updated', file)
    }
}
console.log('files changed:', changed)
