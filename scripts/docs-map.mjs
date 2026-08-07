#!/usr/bin/env node
// docs-map — детерминированное ядро механизма Obsidian-документации.
//
// Никакого AI: только сопоставление исходников со страницами `knowledge/`,
// сбор изменённых файлов из git, пересборка индекса и проверка [[wiki]]-ссылок.
// Используется и Stop-хуком (scripts/docs-guard.mjs), и скиллом /update-docs.
//
// CLI:
//   node scripts/docs-map.mjs --build-index     # пересобрать knowledge/index.md
//   node scripts/docs-map.mjs --lint            # битые [[ссылки]] + orphans + stale + коллизии имён
//   node scripts/docs-map.mjs --check-links     # (алиас части --lint) только битые [[ссылки]]
//   node scripts/docs-map.mjs --pending         # долг коммитов + расхождения по всему vault
//   node scripts/docs-map.mjs --pending --working  # то же, но по незакоммиченному рабочему дереву
//   node scripts/docs-map.mjs --rehash [--all]  # проставить source_hash (миграция с mtime)
//   node scripts/docs-map.mjs --find <имя|путь> # найти страницу для сущности (операция query)
//   node scripts/docs-map.mjs --log "PREFIX msg"# дописать строку в knowledge/log.md
//
// Актуальность страницы определяется ХЕШЕМ исходника (`source_hash` во frontmatter),
// а не mtime: mtime сбивался после любого yarn install / checkout и объявлял устаревшим
// полvault'а. Для страниц без хеша сохранено старое поведение — до `--rehash`.
//
// Как модуль:
//   import { mapSourceToDoc, resolveDocPath, changedFiles, pendingDocs, pageFreshness, buildIndex, checkLinks, findDoc, lint, rehash, appendLog } from './docs-map.mjs'

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

export const VAULT = 'knowledge'

// Правила сопоставления путь-исходника → категория/папка страницы.
// Порядок важен: первое совпадение выигрывает.
const RULES = [
  { test: /^src\/@model\//, dir: 'models', title: 'Models' },
  { test: /^src\/stores\//, dir: 'stores', title: 'Stores' },
  { test: /^src\/(composables|use)\//, dir: 'composables', title: 'Composables' },
  { test: /^src\/components\//, dir: 'components', title: 'Components' },
  { test: /^src\/configs?\//, dir: 'configs', title: 'Configs' },
  { test: /^src\/services\//, dir: 'services', title: 'Services' },
  { test: /^src\/(@core|@layouts)\//, dir: 'core', title: 'Core' },
]

// Разделы vault, которые пишутся людьми/AI и не выводятся из исходников —
// в индексе показываем, но не трогаем при сопоставлении.
export const NARRATIVE_DIRS = ['standards', 'patterns']
export const ALL_DIRS = [...RULES.map(r => r.dir), ...NARRATIVE_DIRS]

const CATEGORY_TITLES = Object.fromEntries([
  ...RULES.map(r => [r.dir, r.title]),
  ['patterns', 'Patterns'],
  ['standards', 'Standards'],
])

// Базовое имя страницы: для `.../Foo/index.ts` берём имя папки, иначе имя файла без расширения.
function docBaseName(relPath) {
  const file = basename(relPath, extname(relPath))

  return file === 'index' ? basename(dirname(relPath)) : file
}

// src-путь → { dir, base, docPath } либо null, если файл недокументируемый.
export function mapSourceToDoc(relPath) {
  const norm = relPath.split('\\').join('/')

  // Документируем только исходники; тесты/декларации/стили пропускаем.
  if (!/\.(ts|vue|js)$/.test(norm))
    return null
  if (/\.(spec|test|d)\.(ts|js)$/.test(norm) || /\.stories\./.test(norm))
    return null

  const rule = RULES.find(r => r.test.test(norm))
  if (!rule)
    return null

  const base = docBaseName(norm)

  return { dir: rule.dir, base, docPath: `${VAULT}/${rule.dir}/${base}.md` }
}

// Obsidian резолвит [[ссылку]] по basename, поэтому при коллизии имён (models/games.md и
// stores/games.md) страницу переименовывают с суффиксом типа: stores/games-store.md.
// Сопоставление код→страница обязано это учитывать, иначе переименованная страница
// навсегда становится «missing».
const TYPE_SUFFIX = {
  models: 'model',
  stores: 'store',
  composables: 'composable',
  components: 'component',
  configs: 'config',
  services: 'service',
  core: 'core',
}

export function resolveDocPath(cwd, mapped) {
  if (!mapped)
    return null
  if (existsSync(join(cwd, mapped.docPath)))
    return mapped.docPath

  const suffix = TYPE_SUFFIX[mapped.dir]
  const alt = suffix ? `${VAULT}/${mapped.dir}/${mapped.base}-${suffix}.md` : null

  return alt && existsSync(join(cwd, alt)) ? alt : mapped.docPath
}

function git(cwd, args) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8' })
  }
  catch {
    return ''
  }
}

// Изменённые (незакоммиченные) файлы рабочего дерева + untracked, repo-relative.
export function changedFiles(cwd = process.cwd()) {
  const out = git(cwd, ['status', '--porcelain', '-z'])
  if (!out)
    return []

  const files = []
  const parts = out.split('\0')
  for (let i = 0; i < parts.length; i++) {
    const entry = parts[i]
    if (!entry)
      continue

    const status = entry.slice(0, 2)
    let path = entry.slice(3)

    // Переименование: реальный (новый) путь идёт следующей записью.
    if (status[0] === 'R' || status[1] === 'R') {
      i++
      path = parts[i] ?? path
    }
    if (path)
      files.push(path)
  }

  return files
}

// ---- Актуальность страницы: по содержимому исходника, а не по mtime ----
//
// mtime врал: любой `yarn install` трогает node_modules, любой checkout переписывает
// файлы — и полвault'а становилось «устаревшим», хотя код не менялся. Признак актуальности —
// хеш исходника, записанный во frontmatter страницы (`source_hash`).
//
// Миграция: у страниц без `source_hash` сравниваем по-старому (mtime), а `--lint`
// показывает их отдельно; `--rehash` проставляет хеши разом.

export const sourceHash = (abs) => {
  try {
    return createHash('sha1').update(readFileSync(abs)).digest('hex').slice(0, 12)
  }
  catch {
    return null
  }
}

// Исходники вне src/ (например node_modules/<пакет>) не версионируются вместе с проектом
// и по хешу не проверяются — такие страницы считаем нарративными.
const isTrackedSource = source => Boolean(source) && !source.startsWith('node_modules/') && !source.startsWith('..')

// 'ok' | 'stale' | 'missing' | 'unhashed-ok' | 'unhashed-stale' | 'untracked'
export function pageFreshness(cwd, source, docPath) {
  const docAbs = join(cwd, docPath)
  if (!existsSync(docAbs))
    return 'missing'
  if (!isTrackedSource(source))
    return 'untracked'

  const srcAbs = join(cwd, source)
  if (!existsSync(srcAbs))
    return 'orphan'

  // Некоторые обзорные страницы указывают в source директорию (`src/`, `src/@model/`).
  // Хешировать нечего, а mtime директории меняется от любого файла внутри — такие страницы
  // нарративные, актуальность у них не проверяется.
  if (statSync(srcAbs).isDirectory())
    return 'untracked'

  const recorded = frontmatterField(docAbs, 'source_hash')
  if (recorded)
    return recorded === sourceHash(srcAbs) ? 'ok' : 'stale'

  return statSync(srcAbs).mtimeMs > statSync(docAbs).mtimeMs ? 'unhashed-stale' : 'unhashed-ok'
}

// Список исходников, у которых страница отсутствует или разошлась с кодом.
export function pendingDocs(cwd = process.cwd(), files = changedFiles(cwd)) {
  const pending = []
  for (const f of files) {
    const mapped = mapSourceToDoc(f)
    if (!mapped)
      continue

    if (!existsSync(join(cwd, f)))
      continue

    const docPath = resolveDocPath(cwd, mapped)
    const freshness = pageFreshness(cwd, f, docPath)
    if (freshness === 'missing')
      pending.push({ source: f, doc: docPath, reason: 'missing' })
    else if (freshness === 'stale' || freshness === 'unhashed-stale')
      pending.push({ source: f, doc: docPath, reason: 'stale' })
  }

  return pending
}

// Служебные .md на верхнем уровне vault, которые не являются страницами-сущностями.
const VAULT_META_FILES = new Set(['index.md', 'log.md'])

// Все .md страницы vault (без index.md/log.md и служебных папок _templates/.obsidian).
function vaultPages(cwd) {
  const root = join(cwd, VAULT)
  const pages = []
  if (!existsSync(root))
    return pages

  const walk = dir => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      if (name.name.startsWith('_') || name.name.startsWith('.'))
        continue

      const abs = join(dir, name.name)
      if (name.isDirectory())
        walk(abs)
      else if (name.name.endsWith('.md') && !VAULT_META_FILES.has(name.name))
        pages.push(abs)
    }
  }
  walk(root)

  return pages
}

// Значение произвольного поля из YAML-frontmatter страницы (или null).
function frontmatterField(abs, field) {
  const text = readFileSync(abs, 'utf8')
  const m = text.match(/^---\n([\s\S]*?)\n---/)
  if (!m)
    return null

  const f = m[1].match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))
  if (!f)
    return null

  const val = f[1].trim().replace(/^["']|["']$/g, '')

  return val || null
}

function frontmatterTitle(abs) {
  return frontmatterField(abs, 'title') ?? basename(abs, '.md')
}

// Пересобрать knowledge/index.md из фактически существующих страниц.
export function buildIndex(cwd = process.cwd()) {
  const root = join(cwd, VAULT)
  const pages = vaultPages(cwd)

  const byDir = {}
  for (const abs of pages) {
    const rel = relative(root, abs).split('\\').join('/')
    const dir = rel.includes('/') ? rel.split('/')[0] : '(root)'
    ;(byDir[dir] ??= []).push(abs)
  }

  const lines = [
    '# Индекс документации',
    '',
    '> Карта содержимого (MOC). Файл **генерируется** скриптом',
    '> `node scripts/docs-map.mjs --build-index` — не редактируйте вручную.',
    '> Хроника операций — в [[log]] (append-only журнал ingest/query/lint).',
    '',
  ]

  const dirs = Object.keys(byDir).sort()
  if (!dirs.length)
    lines.push('_Пока пусто. Страницы появятся по мере документирования кода._', '')

  for (const dir of dirs) {
    lines.push(`## ${CATEGORY_TITLES[dir] ?? dir}`, '')
    const items = byDir[dir]
      .map(abs => ({ base: basename(abs, '.md'), title: frontmatterTitle(abs) }))
      .sort((a, b) => a.base.localeCompare(b.base))
    for (const it of items)
      lines.push(`- [[${it.base}]] — ${it.title}`)
    lines.push('')
  }

  const indexPath = join(root, 'index.md')
  mkdirSync(root, { recursive: true })
  writeFileSync(indexPath, lines.join('\n'))

  return { pages: pages.length, dirs: dirs.length, indexPath: relative(cwd, indexPath) }
}

// Найти [[ссылки]], указывающие на несуществующие страницы (Obsidian резолвит по basename).
export function checkLinks(cwd = process.cwd()) {
  const pages = vaultPages(cwd)
  const names = new Set(pages.map(p => basename(p, '.md').toLowerCase()))

  const broken = []
  for (const abs of pages) {
    // Вырезаем код-блоки и inline-код, чтобы примеры `[[...]]` не считались ссылками.
    const text = readFileSync(abs, 'utf8')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`\n]*`/g, '')
    const re = /\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g
    let m
    while ((m = re.exec(text)) !== null) {
      const target = m[1].trim()
      // Ссылка по пути или по имени — сверяем по basename.
      const targetBase = basename(target, '.md').toLowerCase()
      if (!names.has(targetBase))
        broken.push({ page: relative(cwd, abs), link: target })
    }
  }

  return broken
}

// Найти страницу vault для сущности (операция `query` из LLM Wiki).
// Вход — либо src-путь (`src/@model/Foo.ts`), либо имя сущности (`Foo`).
// Возвращает { query, matches: [{ doc, exists, stale }] }.
export function findDoc(cwd = process.cwd(), query = '') {
  const q = String(query).trim()
  if (!q)
    return { query: q, matches: [] }

  // Путь-подобный вход → сопоставляем теми же правилами, что и для ingest.
  if (/[\\/]/.test(q) || /\.(ts|vue|js)$/.test(q)) {
    const mapped = mapSourceToDoc(q.replace(/^\.?\//, ''))
    if (!mapped)
      return { query: q, matches: [] }

    const src = q.replace(/^\.?\//, '')
    const docPath = resolveDocPath(cwd, mapped)
    const freshness = pageFreshness(cwd, src, docPath)

    return {
      query: q,
      matches: [{
        doc: docPath,
        exists: freshness !== 'missing',
        stale: freshness === 'stale' || freshness === 'unhashed-stale',
      }],
    }
  }

  // Имя сущности → ищем страницу по basename (сначала точное, потом частичное).
  const target = q.toLowerCase().replace(/\.md$/, '')
  const exact = []
  const partial = []
  for (const abs of vaultPages(cwd)) {
    const base = basename(abs, '.md')
    const lb = base.toLowerCase()
    const doc = relative(cwd, abs).split('\\').join('/')
    if (lb === target)
      exact.push({ doc, exists: true, stale: false })
    else if (lb.includes(target))
      partial.push({ doc, exists: true, stale: false })
  }

  return { query: q, matches: exact.length ? exact : partial }
}

// Проверка здоровья vault (операция `lint` из LLM Wiki): битые [[ссылки]],
// orphan-страницы (их `source:` больше не существует) и stale (исходник новее страницы).
export function lint(cwd = process.cwd()) {
  const broken = checkLinks(cwd)
  const orphans = []
  const stale = []
  const unhashed = []
  const untracked = []

  const pages = vaultPages(cwd)

  for (const abs of pages) {
    const source = frontmatterField(abs, 'source')
    // Narrative-страницы (standards/patterns) без `source:` не выводятся из кода — пропускаем.
    if (!source)
      continue

    const page = relative(cwd, abs).split('\\').join('/')
    switch (pageFreshness(cwd, source, page)) {
      case 'orphan':
        orphans.push({ page, source })
        break
      case 'stale':
        stale.push({ page, source })
        break
      case 'unhashed-stale':
        stale.push({ page, source })
        unhashed.push({ page, source })
        break
      case 'unhashed-ok':
        unhashed.push({ page, source })
        break
      case 'untracked':
        untracked.push({ page, source })
        break
    }
  }

  // Obsidian резолвит [[ссылку]] по basename, поэтому одинаковые имена в разных папках
  // (models/games.md и stores/games.md) делают ссылку неоднозначной.
  const byBase = new Map()
  for (const abs of pages) {
    const base = basename(abs, '.md').toLowerCase()
    if (!byBase.has(base))
      byBase.set(base, [])

    byBase.get(base).push(relative(cwd, abs).split('\\').join('/'))
  }
  const collisions = [...byBase.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([base, list]) => ({ base, pages: list.sort() }))

  return { broken, orphans, stale, unhashed, untracked, collisions }
}

// Проставить/обновить `source_hash` во frontmatter страниц (разовая миграция с mtime
// и способ подтвердить «страница соответствует текущему коду»).
export function rehash(cwd = process.cwd(), { onlyMissing = true } = {}) {
  const updated = []
  for (const abs of vaultPages(cwd)) {
    const source = frontmatterField(abs, 'source')
    if (!isTrackedSource(source) || !existsSync(join(cwd, source)))
      continue

    const existing = frontmatterField(abs, 'source_hash')
    if (existing && onlyMissing)
      continue

    const hash = sourceHash(join(cwd, source))
    if (!hash)
      continue

    const text = readFileSync(abs, 'utf8')
    const next = existing
      ? text.replace(/^source_hash:\s*.+$/m, `source_hash: ${hash}`)
      : text.replace(/^(source:\s*.+)$/m, `$1\nsource_hash: ${hash}`)

    if (next !== text) {
      writeFileSync(abs, next)
      updated.push(relative(cwd, abs).split('\\').join('/'))
    }
  }

  return updated
}

// Дописать строку в append-only журнал knowledge/log.md (операции ingest/query/lint).
// message — например «INGEST models/Foo.md, stores/foo.md». Дату не ставим:
// Date.now() недоступен в среде скилла, порядок обеспечивается самим append-only.
export function appendLog(cwd = process.cwd(), message = '') {
  const msg = String(message).trim()
  if (!msg)
    return null

  const root = join(cwd, VAULT)
  const logPath = join(root, 'log.md')
  mkdirSync(root, { recursive: true })

  const header = existsSync(logPath)
    ? ''
    : '# Журнал документации\n\n'
      + '> Append-only хроника операций LLM Wiki (ingest/query/lint).\n'
      + '> Дописывается скриптом `docs-map.mjs --log` — новые записи снизу.\n\n'

  appendFileSync(logPath, `${header}- ${msg}\n`)

  return relative(cwd, logPath)
}

// «Запущен как скрипт, а не импортирован». Через realpath + pathToFileURL, потому что
// `file://${argv[1]}` ломается, когда путь идёт через симлинк (node_modules в pnpm/
// workspaces) или содержит пробелы: тогда CLI молча не запускается.
function isMainModule(moduleUrl) {
  try {
    return Boolean(process.argv[1]) && moduleUrl === pathToFileURL(realpathSync(process.argv[1])).href
  }
  catch {
    return false
  }
}

// ---- CLI ----
if (isMainModule(import.meta.url)) {
  const cwd = process.cwd()
  const arg = process.argv[2]

  if (arg === '--build-index') {
    const r = buildIndex(cwd)
    console.log(`[docs-map] index built: ${r.pages} pages, ${r.dirs} sections → ${r.indexPath}`)
  }
  else if (arg === '--check-links') {
    const broken = checkLinks(cwd)
    if (!broken.length) {
      console.log('[docs-map] no broken [[links]] found.')
    }
    else {
      console.log(`[docs-map] broken links: ${broken.length}`)
      for (const b of broken)
        console.log(`  ${b.page}: [[${b.link}]]`)
      process.exit(1)
    }
  }
  else if (arg === '--pending') {
    // По умолчанию — тот же источник, что видит Stop-хук: долг, накопленный
    // post-commit-хуком (или дифф запушенного диапазона, если очередь пуста).
    // --working — незакоммиченное рабочее дерево, для ручной проверки на ходу.
    const working = process.argv.includes('--working')
    let files
    if (working) {
      files = changedFiles(cwd)
    }
    else {
      const { debtFiles } = await import('./docs-queue.mjs')
      files = debtFiles(cwd)
    }
    const pending = pendingDocs(cwd, files)

    // Долг коммитов показывает только то, что менялось в этой пачке. Страницы, разошедшиеся
    // с кодом раньше, оставались невидимыми (--pending говорил «1», --lint показывал «9»),
    // и долг копился молча. Показываем оба источника в одном списке.
    const known = new Set(pending.map(p => p.doc))
    const extra = lint(cwd).stale.filter(s => !known.has(s.page)).map(s => ({ source: s.source, doc: s.page, reason: 'stale', origin: 'lint' }))
    const all = [...pending.map(p => ({ ...p, origin: working ? 'working' : 'queue' })), ...extra]

    if (!all.length) {
      console.log(`[docs-map] all docs are up to date (${working ? 'working tree' : 'commit debt'} + the whole vault).`)
    }
    else {
      for (const p of all)
        console.log(`  ${p.reason.padEnd(7)} ${String(p.origin).padEnd(7)} ${p.source} → ${p.doc}`)
      if (extra.length)
        console.log(`\n  origin=lint — divergences outside the current debt (${extra.length}). They pile up until updated.`)
    }
  }
  else if (arg === '--find') {
    const r = findDoc(cwd, process.argv[3] || '')
    if (!r.matches.length) {
      console.log(
        `[docs-map] no page found for "${r.query}" — read the source `
        + 'and create the page via /update-docs.',
      )
      process.exit(1)
    }
    for (const m of r.matches) {
      const status = !m.exists ? 'no page' : m.stale ? 'stale' : 'ok'
      console.log(`  ${m.doc} (${status})`)
    }
  }
  else if (arg === '--lint') {
    const { broken, orphans, stale, unhashed, untracked, collisions } = lint(cwd)
    const total = broken.length + orphans.length + stale.length + collisions.length
    if (!total) {
      console.log('[docs-map] lint: clean (links, orphans, stale, name collisions — no problems).')
      if (unhashed.length)
        console.log(`[docs-map] without source_hash: ${unhashed.length} — freshness falls back to mtime. Stamp them with: --rehash`)
      if (untracked.length)
        console.log(`[docs-map] source outside the project: ${untracked.length} — these pages are narrative, freshness is not checked`)
    }
    else {
      if (broken.length) {
        console.log(`[docs-map] broken [[links]]: ${broken.length}`)
        for (const b of broken)
          console.log(`  ${b.page}: [[${b.link}]]`)
      }
      if (orphans.length) {
        console.log(`[docs-map] orphan pages (source deleted): ${orphans.length}`)
        for (const o of orphans)
          console.log(`  ${o.page} → ${o.source}`)
      }
      if (stale.length) {
        console.log(`[docs-map] stale pages (the source changed): ${stale.length}`)
        for (const s of stale)
          console.log(`  ${s.page} → ${s.source}`)
      }
      if (collisions.length) {
        console.log(`[docs-map] name collisions (Obsidian resolves a [[link]] by basename): ${collisions.length}`)
        for (const c of collisions)
          console.log(`  [[${c.base}]] → ${c.pages.join('  |  ')}`)
      }
      if (unhashed.length)
        console.log(`[docs-map] without source_hash: ${unhashed.length} — freshness falls back to mtime. Stamp them with: --rehash`)
      if (untracked.length)
        console.log(`[docs-map] source outside the project: ${untracked.length} — narrative pages, freshness is not checked`)

      process.exit(1)
    }
  }
  else if (arg === '--rehash') {
    // --all перештампует и уже проставленные хеши: это заявление «страницы соответствуют коду».
    const updated = rehash(cwd, { onlyMissing: !process.argv.includes('--all') })
    console.log(updated.length
      ? `[docs-map] source_hash stamped: ${updated.length}\n${updated.map(p => `  ${p}`).join('\n')}`
      : '[docs-map] nothing to stamp — every page with a source already has a hash.')
  }
  else if (arg === '--log') {
    const p = appendLog(cwd, process.argv.slice(3).join(' '))
    if (p)
      console.log(`[docs-map] written to ${p}`)
    else
      console.log('[docs-map] --log: empty message, nothing written.')
  }
  else {
    console.log('usage: docs-map.mjs [--build-index | --lint | --check-links | --pending [--working] | --rehash [--all] | --find <name|path> | --log "PREFIX msg"]')
  }
}
