#!/usr/bin/env node
// docs-guard — Stop-хук Claude Code для механизма Obsidian-документации (LLM Wiki).
//
// Без AI и почти без стоимости. Триггер — ПУШ ВЕТКИ, а не правка в редакторе:
//   git commit  → хук post-commit копит долг в очереди (scripts/docs-queue.mjs)
//   git push    → вершина удалённой ветки сдвинулась → этот Stop-хук один раз
//                 блокирует остановку и просит обновить только затронутые страницы
//                 (скилл /update-docs)
//
// Почему так: коммит — единица завершённой работы, а пуш — момент, когда её видят
// остальные. Незакоммиченные правки хук НЕ будят вообще: документировать код,
// который ещё в движении, рано (раньше хук дёргал именно на них).
//
// Источник списка файлов: очередь `.git/cardona-docs-queue.txt`, наполненная
// post-commit-хуком. Если очередь пуста (хук не был установлен, коммиты сделаны
// раньше) — fallback на дифф запушенного диапазона base..remoteHead, чтобы
// механизм не терял изменения.
//
// Дедуп: сигнатура вершины удалённой ветки в `.git/cardona-docs.state`. Скилл
// /update-docs в конце вызывает этот скрипт с `--mark` (записать сигнатуру +
// очистить очередь), чтобы напоминание не повторялось до следующего пуша.
//
// Раздача в панели: команда хука ссылается на этот файл внутри пакета —
//   node node_modules/cardona-core-service/scripts/docs-guard.mjs
// cwd хука = корень проекта (панели), поэтому git и knowledge/ берутся из панели,
// а сам скрипт и его модули едут вместе внутри node_modules.
//
// Выключение: переменная окружения CARDONA_DOCS_GUARD=0.
// Контракт Stop-хука: читаем JSON из stdin (stop_hook_active), при блокировке
// печатаем {"decision":"block","reason":...} в stdout и выходим с кодом 0.

import { readFileSync } from 'node:fs'
import { clearQueue, debtFiles } from './docs-queue.mjs'
import { pendingDocs } from './docs-map.mjs'
import { computePushState, gitDirPath, readMarked, writeMarked } from './push-state.mjs'

function done() {
  process.exit(0)
}

// Полное выключение через окружение.
if (process.env.CARDONA_DOCS_GUARD === '0')
  done()

const cwdArgv = process.cwd()
const stateFileFor = cwd => gitDirPath(cwd, 'cardona-docs.state')

// --mark: погасить напоминание до следующего пуша и обнулить долг.
// Вызывается скиллом /update-docs в конце работы.
if (process.argv.includes('--mark')) {
  try {
    writeMarked(stateFileFor(cwdArgv), computePushState(cwdArgv).signature)
    clearQueue(cwdArgv)
  }
  catch {
    // best-effort
  }
  done()
}

// Вход Stop-хука. Пустой stdin (ручной запуск) → пустой объект.
let input = {}
try {
  const raw = readFileSync(0, 'utf8').trim()
  if (raw)
    input = JSON.parse(raw)
}
catch {
  input = {}
}

// Защита от петли: если это уже продолжение после нашей блокировки — пропускаем.
// Нагоняем ровно один раз за цикл остановки.
if (input.stop_hook_active)
  done()

const cwd = input.cwd || cwdArgv

let state
try {
  state = computePushState(cwd)
}
catch {
  // Не git-репо и прочее — не мешаем остановке.
  done()
}

// Ветка не запушена (или мы на master/main) — молчим.
if (!state.hasPushedCommits)
  done()

// Вершина удалённой ветки не сдвинулась с прошлого раза (нового пуша не было) — молчим.
const stateFile = stateFileFor(cwd)
if (state.signature === readMarked(stateFile))
  done()

// Файлы: долг, накопленный post-commit-хуком; если пусто — дифф запушенного диапазона.
let files = []
try {
  files = debtFiles(cwd, state)
}
catch {
  done()
}

let pending = []
try {
  pending = pendingDocs(cwd, files)
}
catch {
  done()
}

// Документировать нечего — гасим сигнатуру, чтобы не пересчитывать это на каждой
// остановке до следующего пуша.
if (!pending.length) {
  writeMarked(stateFile, state.signature)
  clearQueue(cwd)
  done()
}

const MAX = 12
const shown = pending.slice(0, MAX)
const lines = shown.map(p => `  - ${p.source} → ${p.doc} (${p.reason === 'missing' ? 'no page' : 'stale'})`)
if (pending.length > MAX)
  lines.push(`  …and ${pending.length - MAX} more`)

const reason = [
  `Branch ${state.branch} was pushed (a new push relative to ${state.baseBranch}), `
  + 'and the Obsidian docs lag behind the code. Affected `knowledge/` pages:',
  ...lines,
  '',
  'Update/create only these pages: invoke the /update-docs skill.',
  'If they do not need documenting, tell the user so and stop again',
  '(this hook will not fire twice in the current cycle).',
].join('\n')

process.stdout.write(JSON.stringify({
  decision: 'block',
  reason,
  hookSpecificOutput: {
    hookEventName: 'Stop',
    additionalContext: 'The code→page mapping rule and its helpers live in scripts/docs-map.mjs. '
      + 'The file list came from the `.git/cardona-docs-queue.txt` queue, which is filled by the '
      + 'post-commit git hook (scripts/docs-queue.mjs). knowledge/index.md is rebuilt by that same '
      + 'hook — do not touch it by hand. After editing: --rehash (stamp source_hash onto the '
      + 'updated pages), --lint (links/orphans/stale/name collisions), record the operation with '
      + '--log "INGEST <pages>", and silence the reminder with '
      + 'node node_modules/cardona-core-service/scripts/docs-guard.mjs --mark.',
  },
}))
done()
