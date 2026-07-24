#!/usr/bin/env node
// root-cause-guard — Stop-хук Claude Code для авто-простановки поля «Root cause» в Jira.
//
// Без AI и почти без стоимости: детерминированно проверяет, что мы на ветке задачи
// (`BAC-XXXX`), в ней есть хотя бы один коммит поверх точки ветвления от дефолтной
// ветки (master/main) и HEAD сместился с прошлого раза. Если да — блокирует остановку
// и просит AI проставить поле Root cause (скилл /root-cause). Иначе молча выходит.
//
// Триггер именно по КОММИТУ, а не по любой правке: сигнатура привязана к HEAD (SHA
// коммита), поэтому незакоммиченные изменения рабочего дерева хук не будят — только
// новый/переписанный коммит (commit/amend/rebase) сдвигает HEAD и запускает напоминание.
//
// Хук НЕ ходит в Jira (в shell нет MCP): проверить тип задачи (Bug/Sub-bug) и наличие
// поля — работа самого скилла. Хук лишь напоминает по факту «на ветке бага новый коммит».
//
// Дедуп: сигнатура HEAD (hash(branch + git rev-parse HEAD)) хранится в
// `.git/cardona-root-cause.state`. Скилл в конце работы вызывает этот скрипт с `--mark`,
// чтобы записать текущую сигнатуру и погасить повторные напоминания до следующего коммита.
//
// Раздача в панели: команда хука ссылается на этот файл внутри пакета —
//   node node_modules/cardona-core-service/scripts/root-cause-guard.mjs
// cwd хука = корень проекта (панели), поэтому git берётся из панели, а сам скрипт
// едет внутри node_modules.
//
// Выключение: переменная окружения CARDONA_ROOT_CAUSE=0.
// Контракт Stop-хука: читаем JSON из stdin (stop_hook_active), при блокировке
// печатаем {"decision":"block","reason":...} в stdout и выходим с кодом 0.

import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function done() {
  process.exit(0)
}

// Полное выключение через окружение.
if (process.env.CARDONA_ROOT_CAUSE === '0')
  done()

const cwd = process.cwd()

const sh = (cmd) => {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024 }).trim()
  }
  catch {
    return ''
  }
}

// Ветка + её HEAD относительно дефолтной ветки → ключ задачи и сигнатура коммита.
function computeState() {
  const branch = sh('git rev-parse --abbrev-ref HEAD')
  const ticket = (branch.match(/^(BAC-\d+)/i) || [])[1]?.toUpperCase() || null
  const head = sh('git rev-parse HEAD')

  let baseBranch = null
  let base = null
  for (const b of ['master', 'main']) {
    const mb = sh(`git merge-base ${b} HEAD`)
    if (mb) {
      baseBranch = b
      base = mb
      break
    }
  }

  // Триггер по коммиту: должен быть хотя бы один коммит поверх точки ветвления
  // (head !== base). Незакоммиченные правки HEAD не меняют → не будят хук.
  const hasCommits = Boolean(base && head && head !== base && branch !== baseBranch)

  // Сигнатура привязана к закоммиченному HEAD → меняется только при новом коммите
  // (или amend/rebase), а не при простой правке рабочего дерева.
  const signature = createHash('sha1').update(`${branch}\n${head}`).digest('hex')

  return { branch, ticket, baseBranch, base, head, hasCommits, signature }
}

const gitDir = sh('git rev-parse --git-dir')
const stateFile = gitDir ? join(cwd, gitDir, 'cardona-root-cause.state') : null

function readMarked() {
  if (!stateFile)
    return ''
  try {
    return readFileSync(stateFile, 'utf8').trim()
  }
  catch {
    return ''
  }
}

function writeMarked(signature) {
  if (!stateFile)
    return
  try {
    mkdirSync(join(cwd, gitDir), { recursive: true })
    writeFileSync(stateFile, signature, 'utf8')
  }
  catch {
    // Не мешаем работе, если .git недоступен для записи.
  }
}

// --mark: записать текущую сигнатуру и выйти (вызывается скиллом в конце работы).
if (process.argv.includes('--mark')) {
  try {
    writeMarked(computeState().signature)
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
if (input.stop_hook_active)
  done()

let state
try {
  state = computeState()
}
catch {
  done()
}

// Не BAC-ветка или нет ни одного коммита поверх базы — не мешаем остановке.
if (!state.ticket || !state.hasCommits)
  done()

// HEAD (коммит) не менялся с прошлого раза — не напоминаем повторно.
if (state.signature === readMarked())
  done()

const reason = [
  `На ветке задачи ${state.ticket} новый коммит (относительно ${state.baseBranch}).`,
  'Проставь поле **Root cause** в Jira: вызови скилл /root-cause.',
  'Скилл сам проверит тип задачи и наличие поля — если это не Bug/Sub-bug или поля нет,',
  'он ничего не сделает (и пометит дифф как обработанный, чтобы не напоминать снова).',
].join('\n')

process.stdout.write(JSON.stringify({
  decision: 'block',
  reason,
  hookSpecificOutput: {
    hookEventName: 'Stop',
    additionalContext: 'Root cause — select-поле Jira. Скилл /root-cause получает его options '
      + 'динамически (getJiraIssueTypeMetaWithFields), анализирует дифф ветки и выставляет категорию. '
      + 'Выключение авто-напоминаний: env CARDONA_ROOT_CAUSE=0.',
  },
}))
done()
