#!/usr/bin/env node
// docs-map — детерминированное ядро механизма Obsidian-документации.
//
// Никакого AI: только сопоставление исходников со страницами `knowledge/`,
// сбор изменённых файлов из git, пересборка индекса и проверка [[wiki]]-ссылок.
// Используется и Stop-хуком (scripts/docs-guard.mjs), и скиллом /update-docs.
//
// CLI:
//   node scripts/docs-map.mjs --build-index     # пересобрать knowledge/index.md
//   node scripts/docs-map.mjs --lint            # битые [[ссылки]] + orphans + stale
//   node scripts/docs-map.mjs --check-links     # (алиас части --lint) только битые [[ссылки]]
//   node scripts/docs-map.mjs --pending         # показать код без/с устаревшей докой
//   node scripts/docs-map.mjs --find <имя|путь> # найти страницу для сущности (операция query)
//   node scripts/docs-map.mjs --log "PREFIX msg"# дописать строку в knowledge/log.md
//
// Как модуль:
//   import { mapSourceToDoc, changedFiles, pendingDocs, buildIndex, checkLinks, findDoc, lint, appendLog } from './docs-map.mjs'

import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative } from 'node:path'

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

// Список исходников, у которых страница отсутствует или устарела (исходник новее .md).
export function pendingDocs(cwd = process.cwd(), files = changedFiles(cwd)) {
  const pending = []
  for (const f of files) {
    const mapped = mapSourceToDoc(f)
    if (!mapped)
      continue

    const srcAbs = join(cwd, f)
    const docAbs = join(cwd, mapped.docPath)
    if (!existsSync(srcAbs))
      continue

    let reason = null
    if (!existsSync(docAbs))
      reason = 'missing'
    else if (statSync(srcAbs).mtimeMs > statSync(docAbs).mtimeMs)
      reason = 'stale'

    if (reason)
      pending.push({ source: f, doc: mapped.docPath, reason })
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

    const srcAbs = join(cwd, q.replace(/^\.?\//, ''))
    const docAbs = join(cwd, mapped.docPath)
    const exists = existsSync(docAbs)
    const stale = exists && existsSync(srcAbs)
      && statSync(srcAbs).mtimeMs > statSync(docAbs).mtimeMs

    return { query: q, matches: [{ doc: mapped.docPath, exists, stale }] }
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

  for (const abs of vaultPages(cwd)) {
    const source = frontmatterField(abs, 'source')
    // Narrative-страницы (standards/patterns) без `source:` не выводятся из кода — пропускаем.
    if (!source)
      continue

    const srcAbs = join(cwd, source)
    const page = relative(cwd, abs).split('\\').join('/')
    if (!existsSync(srcAbs)) {
      orphans.push({ page, source })
      continue
    }
    if (statSync(srcAbs).mtimeMs > statSync(abs).mtimeMs)
      stale.push({ page, source })
  }

  return { broken, orphans, stale }
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

// ---- CLI ----
if (import.meta.url === `file://${process.argv[1]}`) {
  const cwd = process.cwd()
  const arg = process.argv[2]

  if (arg === '--build-index') {
    const r = buildIndex(cwd)
    console.log(`[docs-map] индекс собран: ${r.pages} страниц, ${r.dirs} разделов → ${r.indexPath}`)
  }
  else if (arg === '--check-links') {
    const broken = checkLinks(cwd)
    if (!broken.length) {
      console.log('[docs-map] битых [[ссылок]] не найдено.')
    }
    else {
      console.log(`[docs-map] битых ссылок: ${broken.length}`)
      for (const b of broken)
        console.log(`  ${b.page}: [[${b.link}]]`)
      process.exit(1)
    }
  }
  else if (arg === '--pending') {
    const pending = pendingDocs(cwd)
    if (!pending.length) {
      console.log('[docs-map] вся затронутая дока актуальна.')
    }
    else {
      for (const p of pending)
        console.log(`  ${p.reason.padEnd(7)} ${p.source} → ${p.doc}`)
    }
  }
  else if (arg === '--find') {
    const r = findDoc(cwd, process.argv[3] || '')
    if (!r.matches.length) {
      console.log(
        `[docs-map] страница для «${r.query}» не найдена — прочитай исходник `
        + 'и заведи страницу через /update-docs.',
      )
      process.exit(1)
    }
    for (const m of r.matches) {
      const status = !m.exists ? 'нет страницы' : m.stale ? 'устарела' : 'ok'
      console.log(`  ${m.doc} (${status})`)
    }
  }
  else if (arg === '--lint') {
    const { broken, orphans, stale } = lint(cwd)
    const total = broken.length + orphans.length + stale.length
    if (!total) {
      console.log('[docs-map] lint: чисто (ссылки, orphans, stale — проблем нет).')
    }
    else {
      if (broken.length) {
        console.log(`[docs-map] битых [[ссылок]]: ${broken.length}`)
        for (const b of broken)
          console.log(`  ${b.page}: [[${b.link}]]`)
      }
      if (orphans.length) {
        console.log(`[docs-map] orphan-страниц (source удалён): ${orphans.length}`)
        for (const o of orphans)
          console.log(`  ${o.page} → ${o.source}`)
      }
      if (stale.length) {
        console.log(`[docs-map] устаревших страниц (исходник новее): ${stale.length}`)
        for (const s of stale)
          console.log(`  ${s.page} → ${s.source}`)
      }
      process.exit(1)
    }
  }
  else if (arg === '--log') {
    const p = appendLog(cwd, process.argv.slice(3).join(' '))
    if (p)
      console.log(`[docs-map] записано в ${p}`)
    else
      console.log('[docs-map] --log: пустое сообщение, ничего не записано.')
  }
  else {
    console.log('usage: docs-map.mjs [--build-index | --lint | --check-links | --pending | --find <имя|путь> | --log "PREFIX msg"]')
  }
}
