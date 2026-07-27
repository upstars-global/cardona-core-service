#!/usr/bin/env node
// root-cause-guard — Stop-хук Claude Code для авто-простановки поля «Root cause» в Jira.
//
// Без AI и почти без стоимости: детерминированно проверяет, что мы на ветке задачи
// (`BAC-XXXX`), она запушена (есть вершина удалённой ветки) с хотя бы одним коммитом
// поверх точки ветвления от дефолтной ветки (master/main), и эта вершина сместилась с
// прошлого раза. Если да — блокирует остановку и просит AI проставить поле Root cause
// (скилл /root-cause). Иначе молча выходит.
//
// Триггер именно по ПУШУ, а не по коммиту/правке: сигнатура привязана к вершине
// удалённой ветки (`@{upstream}` → `origin/<branch>`). `git push` обновляет локальный
// remote-tracking ref, поэтому пуш сдвигает эту вершину, а локальные незапушенные
// коммиты и незакоммиченные правки хук НЕ будят.
//
// Хук НЕ ходит в Jira (в shell нет MCP) и НЕ ходит в сеть (читает локальный
// remote-tracking ref): проверить тип задачи (Bug/Sub-bug) и наличие поля — работа
// самого скилла. Хук лишь напоминает по факту «ветка бага запушена».
//
// Дедуп: сигнатура вершины удалённой ветки (hash(branch + remoteHead)) хранится в
// `.git/cardona-root-cause.state`. Скилл в конце работы вызывает этот скрипт с `--mark`,
// чтобы записать текущую сигнатуру и погасить повторные напоминания до следующего пуша.
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

// Ветка + вершина её удалённого аналога → ключ задачи и сигнатура пуша.
function computeState() {
  const branch = sh('git rev-parse --abbrev-ref HEAD')
  const ticket = (branch.match(/^(BAC-\d+)/i) || [])[1]?.toUpperCase() || null

  // Вершина удалённой ветки — двигается только при пуше (git обновляет remote-tracking
  // ref). Сначала настроенный upstream (@{upstream}), затем origin/<branch>.
  let remoteHead = sh('git rev-parse --verify --quiet @{upstream}')
  if (!remoteHead && branch && branch !== 'HEAD')
    remoteHead = sh(`git rev-parse --verify --quiet origin/${branch}`)

  let baseBranch = null
  let base = null
  if (remoteHead) {
    for (const b of ['master', 'main']) {
      const mb = sh(`git merge-base ${b} ${remoteHead}`)
      if (mb) {
        baseBranch = b
        base = mb
        break
      }
    }
  }

  // Триггер по пушу: ветка должна быть запушена (remoteHead есть) с хотя бы одним
  // коммитом поверх точки ветвления. Локальные незапушенные коммиты не будят хук.
  const hasPushedCommits = Boolean(remoteHead && base && remoteHead !== base && branch !== baseBranch)

  // Сигнатура привязана к вершине удалённой ветки → меняется только при пуше.
  const signature = createHash('sha1').update(`${branch}\n${remoteHead}`).digest('hex')

  return { branch, ticket, baseBranch, base, remoteHead, hasPushedCommits, signature }
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

// Не BAC-ветка или ветка не запушена (нет коммитов на удалённой поверх базы) — не мешаем.
if (!state.ticket || !state.hasPushedCommits)
  done()

// Вершина удалённой ветки не менялась с прошлого раза (не было нового пуша) — не напоминаем.
if (state.signature === readMarked())
  done()

const reason = [
  `Ветка задачи ${state.ticket} запушена (новый пуш относительно ${state.baseBranch}).`,
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
