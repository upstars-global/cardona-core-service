#!/usr/bin/env node
// Impact Analysis evidence collector.
//
// Does the deterministic, token-free work so the AI only has to interpret and
// write the Ukrainian report: resolves the change set, classifies every changed
// file by blast radius, and gathers raw evidence (route/menu/i18n matches,
// consumer lists, core-service diff). Prints one JSON bundle to stdout.
//
// Usage:
//   node collect-evidence.mjs                 # auto: whole current branch (committed vs master + uncommitted) -> last commit
//   node collect-evidence.mjs HEAD~1 HEAD     # explicit git range (two args)
//   node collect-evidence.mjs master...HEAD   # explicit range (one arg)
//
// It never throws on missing files/empty greps — evidence is best-effort; the AI
// still applies judgement (this is the "medium" scripting level, not full mapping).

import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO = process.cwd()
const CORE_CLONES = ['../cardona-core-service-github', '../cardona-core-service']

const sh = (cmd, opts = {}) => {
  try {
    return execSync(cmd, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024, ...opts }).trim()
  } catch {
    return ''
  }
}
const lines = (s) => (s ? s.split('\n').filter(Boolean) : [])

// ---------- Step 1: change set ----------
function resolveChangeSet() {
  const argv = process.argv.slice(2)
  if (argv.length) {
    const range = argv.length === 2 ? `${argv[0]} ${argv[1]}` : argv[0]
    return { source: 'explicit', range, files: lines(sh(`git diff --name-only ${range}`)), diffCmd: `git diff ${range}` }
  }
  // Whole current branch: everything it contains that master doesn't — committed diff
  // vs the fork point PLUS uncommitted work (staged, unstaged, untracked). Fallback: last commit.
  const branch = sh('git rev-parse --abbrev-ref HEAD')
  const base = sh('git merge-base master HEAD') || 'master'
  if (branch && branch !== 'master') {
    const tracked = lines(sh(`git diff --name-only ${base}`)) // committed-since-base + staged + unstaged
    const untracked = lines(sh('git ls-files --others --exclude-standard'))
    const files = [...new Set([...tracked, ...untracked])].filter(Boolean)
    if (files.length) return { source: 'branch (incl. uncommitted)', range: `${base}..worktree`, files, diffCmd: `git diff ${base}` }
  }
  return { source: 'last-commit', range: 'HEAD~1 HEAD', files: lines(sh('git diff --name-only HEAD~1 HEAD')), diffCmd: 'git diff HEAD~1 HEAD' }
}

// ---------- Step 2: classification ----------
const GENERATED = ['components.d.ts', 'typed-router.d.ts', 'auto-imports.d.ts']
const isGenerated = (f) => GENERATED.includes(f) || f.startsWith('dist/') || f.startsWith('coverage/')
const PROJECT_WIDE = [
  'src/configs/productConfig.ts',
  'src/configs/permissions.ts',
  'src/plugins/2.router/guards.ts',
  'src/plugins/i18n/locales/en.json',
]

function classify(f) {
  if (isGenerated(f)) return 'generated'
  if (f.startsWith('cardona-core-service/')) return 'core-dependency'
  if (PROJECT_WIDE.includes(f) || /^src\/navigation\/.*build(Menu|AdminMenu)\.ts$/.test(f)) return 'project-wide'
  if (f.startsWith('src/pages/')) return 'page'
  if (/^src\/(components|@model|stores|composables)\//.test(f)) return 'shared'
  if (/^(vite\.config\.mts|tsconfig.*\.json|\.eslintrc.*|\.prettierrc|stylelint\.config\.js|vitest\.setup\.ts|jest\.config\.js|themeConfig\.ts)$/.test(f) || f.endsWith('.d.ts')) return 'build'
  if (f === 'Dockerfile' || f.startsWith('nginx/') || f.startsWith('charts/') || f === '.gitlab-ci.yml' || f.startsWith('gitlab-ci/')) return 'infra'
  if (f === '.env' || f === 'passport.yaml' || f.startsWith('public/') || f === 'index.html' || f.startsWith('server/')) return 'runtime'
  if (f === 'package.json' || f === 'yarn.lock') return 'deps'
  if (f.endsWith('.spec.ts') || f.startsWith('tests/') || f.endsWith('.md') || f.startsWith('.claude/') || f === '.gitignore') return 'docs'
  return 'other'
}

// ---------- evidence helpers ----------
const grepFile = (pattern, file) => (existsSync(resolve(REPO, file)) ? lines(sh(`grep -nE ${JSON.stringify(pattern)} ${JSON.stringify(file)}`)).slice(0, 40) : [])
const grepConsumers = (pattern) => lines(sh(`grep -rlE ${JSON.stringify(pattern)} src`)).slice(0, 60)
const pascal = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const ADDITIONAL_ROUTES = 'src/plugins/2.router/additional-routes.ts'
const BUILD_MENU = 'src/navigation/vertical/apps-and-pages/buildMenu.ts'
const EN_JSON = 'src/plugins/i18n/locales/en.json'

function pageEvidence(f) {
  const parts = f.split('/') // src pages <group> <section> ...
  const group = parts[2] || ''
  const section = parts[3] || parts[2] || ''
  const routeNames = ['List', 'Create', 'Update', 'Card', ''].map((s) => pascal(section) + s)
  // buildMenu: lines referencing any candidate route name, plus all group headings for nearest-parent lookup.
  const menuMatches = grepFile(`to:\\s*'(${routeNames.filter(Boolean).join('|')})'`, BUILD_MENU)
  const groupHeadings = grepFile(`title:\\s*'title\\.`, BUILD_MENU)
  return {
    file: f,
    group,
    section,
    routeNameCandidates: routeNames.filter(Boolean),
    additionalRoutesMatches: grepFile(`name:\\s*'${section}'`, ADDITIONAL_ROUTES),
    routerModulesHint: lines(sh(`grep -rlE ${JSON.stringify(section)} src/plugins/2.router/modules 2>/dev/null`)).slice(0, 10),
    buildMenuMatches: menuMatches,
    buildMenuGroupHeadings: groupHeadings,
    i18nMatches: grepFile(`"${section}"`, EN_JSON),
  }
}

function sharedEvidence(f) {
  if (f.startsWith('src/components/')) {
    const rel = f.replace(/^src\/components\//, '').replace(/\.vue$/, '')
    const segs = rel.split('/').filter((s) => s !== 'index')
    const pascalName = segs.map(pascal).join('')
    const kebab = pascalName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    return { file: f, kind: 'component', tagName: pascalName, consumers: grepConsumers(`<${pascalName}[\\s/>]|<${kebab}[\\s/>]|components/${rel}`) }
  }
  if (f.startsWith('src/@model/')) {
    const rel = f.replace(/^src\/@model\//, '').replace(/\.ts$/, '')
    return { file: f, kind: 'model', consumers: grepConsumers(`@model/${rel}|@/@model/${rel}`) }
  }
  if (f.startsWith('src/stores/')) {
    const rel = f.replace(/^src\/stores\//, '').replace(/\.ts$/, '')
    const src = existsSync(resolve(REPO, f)) ? readFileSync(resolve(REPO, f), 'utf8') : ''
    const useName = (src.match(/export const (use\w+Store)/) || [])[1] || ''
    return { file: f, kind: 'store', useName, consumers: grepConsumers([`stores/${rel}`, useName].filter(Boolean).join('|')) }
  }
  const rel = f.replace(/^src\/composables\//, '').replace(/\.ts$/, '')
  const src = existsSync(resolve(REPO, f)) ? readFileSync(resolve(REPO, f), 'utf8') : ''
  const useName = (src.match(/export (?:const|function) (use\w+)/) || [])[1] || ''
  return { file: f, kind: 'composable', useName, consumers: grepConsumers([rel, useName].filter(Boolean).join('|')) }
}

function coreDependencyEvidence(files, diff) {
  const versionLine = lines(sh('grep -n "cardona-core-service" package.json'))[0] || ''
  const versionChanged = /cardona-core-service/.test(diff) && /package\.json/.test(files.join('\n')) === false ? false : /["']cardona-core-service["']/.test(diff)
  // Extract old/new tags from the package.json diff if present.
  const pkgDiff = sh('git diff -- package.json') || sh('git diff HEAD~1 HEAD -- package.json')
  const tags = [...pkgDiff.matchAll(/cardona-core-service#(v[\d.]+)/g)].map((m) => m[1])
  const oldTag = tags.length > 1 ? tags[0] : null
  const newTag = tags.length > 1 ? tags[tags.length - 1] : null
  const clone = CORE_CLONES.find((c) => existsSync(resolve(REPO, c, '.git')))
  let changedCoreFiles = []
  let localEdits = []
  if (clone) {
    if (oldTag && newTag) {
      sh(`git -C ${clone} fetch --tags --quiet`)
      changedCoreFiles = lines(sh(`git -C ${clone} diff --name-only ${oldTag} ${newTag}`)).slice(0, 100)
    }
    localEdits = lines(sh(`git -C ${clone} status --porcelain`)).slice(0, 100)
  }
  return { currentVersionLine: versionLine, versionChanged: Boolean(oldTag && newTag), oldTag, newTag, clone: clone || null, changedCoreFiles, localEdits }
}

// ---------- assemble ----------
const cs = resolveChangeSet()
const appFiles = cs.files.filter((f) => classify(f) !== 'generated')
const buckets = {}
for (const f of cs.files) (buckets[classify(f)] ||= []).push(f)

const bundle = {
  changeSet: cs,
  branch: sh('git rev-parse --abbrev-ref HEAD'),
  ticketKey: (sh('git rev-parse --abbrev-ref HEAD').match(/^(BAC-\d+)/i) || [])[1]?.toUpperCase() || null,
  buckets,
  pages: (buckets.page || []).map(pageEvidence),
  shared: (buckets.shared || []).map(sharedEvidence),
  coreDependency: buckets['core-dependency'] || buckets.deps ? coreDependencyEvidence(cs.files, sh(cs.diffCmd + ' -- package.json') || '') : null,
  diff: sh(`${cs.diffCmd} -U1 -- ${appFiles.map((f) => JSON.stringify(f)).join(' ')}`).slice(0, 60000),
  notes: [
    'Evidence is best-effort. Verify anything ambiguous. Hand-written routes (payouts/transactions/adminSection/logging/...) live in src/plugins/2.router/modules — routerModulesHint points there.',
    'For menu path: find the nearest buildMenuGroupHeading with a line number BELOW-or-equal to the matched to: line, and above the next heading.',
    'consumer lists are capped; if a list looks truncated, widen the grep yourself.',
  ],
}

process.stdout.write(JSON.stringify(bundle, null, 2))
