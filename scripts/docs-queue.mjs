#!/usr/bin/env node
// docs-queue — очередь «долга по документации», которую наполняет git-хук post-commit.
//
// Без AI и почти без стоимости. Роль в механизме LLM Wiki: коммит — единица
// завершённой работы, поэтому именно в момент коммита детерминированно
// фиксируется, какие исходники поехали. Напоминание же приходит позже, по пушу
// ветки (scripts/docs-guard.mjs) — так вика не дёргается на каждом промежуточном
// коммите, но и не теряет ни одного изменённого файла.
//
// Очередь: `.git/cardona-docs-queue.txt`, по одному repo-relative пути в строке,
// без дублей. В неё попадают только файлы, которым соответствует страница
// `knowledge/` (правило mapSourceToDoc), поэтому она остаётся крошечной.
//
// Мерж-коммиты пропускаются: они приносят чужой код, документировать его по
// факту мержа не нужно (авторы своих веток получат своё напоминание сами).
//
// CLI (всё best-effort, всегда exit 0 — хук не должен ломать коммит):
//   node scripts/docs-queue.mjs --record [ref]  # добавить файлы коммита (по умолчанию HEAD)
//   node scripts/docs-queue.mjs --list          # показать очередь
//   node scripts/docs-queue.mjs --clear         # очистить очередь
//
// Как модуль:
//   import { readQueue, recordCommit, clearQueue, queueFile, debtFiles } from './docs-queue.mjs'
//
// Выключение: переменная окружения CARDONA_DOCS_GUARD=0.

import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { computePushState, gitDirPath, sh } from './push-state.mjs'

// Внимание: этот модуль НЕ импортирует docs-map статически. docs-map, наоборот,
// подгружает docs-queue динамически в своём CLI (--pending), и статический импорт
// в обратную сторону дал бы цикл ESM с дедлоком на top-level await. Поэтому
// правило «документируем ли файл» (mapSourceToDoc) приходит снаружи параметром.

// Предохранитель от разрастания: очередь — это долг за пачку коммитов, не история.
const MAX_ENTRIES = 1000

export function queueFile(cwd = process.cwd()) {
  return gitDirPath(cwd, 'cardona-docs-queue.txt')
}

export function readQueue(cwd = process.cwd()) {
  const file = queueFile(cwd)
  if (!file || !existsSync(file))
    return []

  try {
    return readFileSync(file, 'utf8')
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
  }
  catch {
    return []
  }
}

export function clearQueue(cwd = process.cwd()) {
  const file = queueFile(cwd)
  if (!file)
    return

  try {
    writeFileSync(file, '', 'utf8')
  }
  catch {
    // best-effort
  }
}

// Файлы одного коммита (repo-relative). Мерж (2+ родителя) → пусто.
export function commitFiles(cwd = process.cwd(), ref = 'HEAD') {
  const parents = sh(cwd, `git rev-list --parents -n 1 ${ref}`).split(/\s+/).filter(Boolean)
  if (parents.length > 2)
    return []

  // --root, чтобы работал и первый коммит репозитория; ACMR — без удалённых файлов.
  const out = sh(cwd, `git diff-tree --no-commit-id --name-only --diff-filter=ACMR -r --root ${ref}`)

  return out ? out.split('\n').map(l => l.trim()).filter(Boolean) : []
}

// Добавить в очередь документируемые файлы коммита. Возвращает добавленные пути.
// isDocumentable — предикат «этому файлу соответствует страница knowledge/»;
// по умолчанию берутся все файлы коммита (фильтр передаёт CLI, см. шапку модуля).
export function recordCommit(cwd = process.cwd(), ref = 'HEAD', isDocumentable = () => true) {
  const file = queueFile(cwd)
  if (!file)
    return []

  const documentable = commitFiles(cwd, ref).filter(f => isDocumentable(f))
  if (!documentable.length)
    return []

  const existing = readQueue(cwd)
  const seen = new Set(existing)
  const added = documentable.filter(f => !seen.has(f))
  if (!added.length)
    return []

  const next = [...existing, ...added].slice(-MAX_ENTRIES)
  try {
    writeFileSync(file, `${next.join('\n')}\n`, 'utf8')
  }
  catch {
    return []
  }

  return added
}

// Файлы, за которые механизм считает себя должным: накопленный post-commit-хуком
// долг, а если очередь пуста (хук не был установлен, коммиты сделаны раньше) —
// дифф запушенного диапазона base..remoteHead. Один источник истины и для
// Stop-хука (docs-guard), и для `docs-map.mjs --pending`.
export function debtFiles(cwd = process.cwd(), state = null) {
  const queued = readQueue(cwd)
  if (queued.length)
    return queued

  const push = state || computePushState(cwd)
  if (!push.base || !push.remoteHead)
    return []

  const out = sh(cwd, `git diff --name-only --diff-filter=ACMR ${push.base} ${push.remoteHead}`)

  return out ? out.split('\n').map(l => l.trim()).filter(Boolean) : []
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

  // Выключение через окружение — как у остальных частей механизма.
  if (process.env.CARDONA_DOCS_GUARD === '0')
    process.exit(0)

  try {
    if (arg === '--record') {
      // Правило код→страница подгружаем здесь: в обратную сторону статического
      // импорта нет, поэтому цикла не возникает.
      const { mapSourceToDoc } = await import('./docs-map.mjs')
      const added = recordCommit(cwd, process.argv[3] || 'HEAD', f => Boolean(mapSourceToDoc(f)))
      if (added.length)
        console.log(`[docs-queue] в долг добавлено файлов: ${added.length}`)
    }
    else if (arg === '--list') {
      const queue = readQueue(cwd)
      if (!queue.length)
        console.log('[docs-queue] очередь пуста.')
      else
        for (const f of queue) console.log(`  ${f}`)
    }
    else if (arg === '--clear') {
      clearQueue(cwd)
      console.log('[docs-queue] очередь очищена.')
    }
    else {
      console.log('usage: docs-queue.mjs [--record [ref] | --list | --clear]')
    }
  }
  catch {
    // Хук не имеет права ломать коммит — любая ошибка молча игнорируется.
  }

  process.exit(0)
}
