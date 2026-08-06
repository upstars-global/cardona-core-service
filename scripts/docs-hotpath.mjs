#!/usr/bin/env node
// docs-hotpath — что документировать в первую очередь.
//
// Наполнять wiki «по вкусу» дорого и бесполезно: страница окупается только там, куда
// код и AI возвращаются регулярно. Объективный признак такого места — частота изменений
// в git. Скрипт ранжирует документируемые сущности по числу коммитов за период,
// сопоставляет с текущим покрытием `knowledge/` и печатает приоритизированный список.
//
// Ранг = коммиты за период. Уже покрытые актуальные страницы из списка исключаются
// (их незачем переписывать), устаревшие — остаются, но помечены.
//
// Использование:
//   node scripts/docs-hotpath.mjs                # топ-20 за 12 месяцев
//   node scripts/docs-hotpath.mjs --top 40 --months 6
//   node scripts/docs-hotpath.mjs --all          # включая уже покрытые
//   node scripts/docs-hotpath.mjs --json
//
// В панелях: node node_modules/cardona-core-service/scripts/docs-hotpath.mjs

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { mapSourceToDoc, VAULT } from './docs-map.mjs'

const CWD = process.cwd()

const argv = process.argv.slice(2)
const argOf = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)

  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
}
const TOP = Number(argOf('top', 20))
const MONTHS = Number(argOf('months', 12))
const SHOW_ALL = argv.includes('--all')
const AS_JSON = argv.includes('--json')

const sh = (cmd) => {
  try {
    return execSync(cmd, { cwd: CWD, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }).trim()
  }
  catch {
    return ''
  }
}

// Частота изменений: сколько раз файл попадал в коммит за период.
const log = sh(`git log --since='${MONTHS} months ago' --name-only --pretty=format: -- src`)
const commits = new Map()
for (const line of log.split('\n')) {
  const f = line.trim()
  if (!f)
    continue

  commits.set(f, (commits.get(f) || 0) + 1)
}

// Страница считается покрытой, если она есть; устаревшей — если исходник новее.
function coverage(docPath) {
  const abs = join(CWD, docPath)
  if (!existsSync(abs))
    return 'missing'

  const src = readFileSync(abs, 'utf8').match(/^source:\s*(.+)$/m)?.[1]?.trim()
  if (!src || !existsSync(join(CWD, src)))
    return 'ok'

  try {
    return statSync(join(CWD, src)).mtimeMs > statSync(abs).mtimeMs ? 'stale' : 'ok'
  }
  catch {
    return 'ok'
  }
}

const rows = []
for (const [file, count] of commits) {
  if (!existsSync(join(CWD, file)))
    continue // файл удалён — документировать нечего

  const mapped = mapSourceToDoc(file)
  if (!mapped)
    continue

  rows.push({ file, commits: count, doc: mapped.docPath, coverage: coverage(mapped.docPath) })
}

rows.sort((a, b) => b.commits - a.commits || a.file.localeCompare(b.file))

const candidates = SHOW_ALL ? rows : rows.filter(r => r.coverage !== 'ok')
const shown = candidates.slice(0, TOP)

if (AS_JSON) {
  process.stdout.write(JSON.stringify({ months: MONTHS, totalDocumentable: rows.length, covered: rows.filter(r => r.coverage === 'ok').length, rows: shown }, null, 2))
  process.exit(0)
}

const covered = rows.filter(r => r.coverage === 'ok').length
const pct = rows.length ? Math.round((covered / rows.length) * 100) : 0

console.log(`\n[docs-hotpath] изменённых документируемых сущностей за ${MONTHS} мес: ${rows.length}`)
console.log(`               из них покрыто актуальными страницами: ${covered} (${pct}%)\n`)

if (!shown.length) {
  console.log('  Всё горячее покрыто. Нечего добавлять.\n')
  process.exit(0)
}

const label = { missing: 'нет страницы', stale: 'устарела', ok: 'ок' }
console.log(`  Приоритет (${SHOW_ALL ? 'все' : 'непокрытые'}, топ-${shown.length}):\n`)
for (const r of shown)
  console.log(`  ${String(r.commits).padStart(3)} коммитов  ${label[r.coverage].padEnd(12)} ${r.file}\n${' '.repeat(21)}→ ${r.doc}`)

console.log(`
  Документировать по доктрине /update-docs: не пересказ файла, а неочевидное —
  инварианты, ловушки, «почему так», порядок вызовов. Пересказ исходника не нужен.
`)
