#!/usr/bin/env node
// root-cause-guard — Stop-хук Claude Code для авто-простановки поля «Root cause» в Jira.
//
// Без AI и почти без стоимости: детерминированно проверяет, что мы на ветке задачи
// (`BAC-XXXX`), она запушена (есть вершина удалённой ветки) с хотя бы одним коммитом
// поверх точки ветвления от дефолтной ветки (master/main), и эта вершина сместилась с
// прошлого раза. Если да — блокирует остановку и просит AI проставить поле Root cause
// (скилл /root-cause). Иначе молча выходит.
//
// Триггер именно по ПУШУ, а не по коммиту/правке: общая механика вынесена в
// scripts/push-state.mjs (её же использует docs-guard) — сигнатура привязана к вершине
// удалённой ветки, поэтому локальные незапушенные коммиты и незакоммиченные правки
// хук НЕ будят.
//
// Хук НЕ ходит в Jira (в shell нет MCP) и НЕ ходит в сеть (читает локальный
// remote-tracking ref): проверить тип задачи (Bug/Sub-bug) и наличие поля — работа
// самого скилла. Хук лишь напоминает по факту «ветка бага запушена».
//
// Дедуп: сигнатура вершины удалённой ветки хранится в `.git/cardona-root-cause.state`.
// Скилл в конце работы вызывает этот скрипт с `--mark`, чтобы записать текущую
// сигнатуру и погасить повторные напоминания до следующего пуша.
//
// Раздача в панели: команда хука ссылается на этот файл внутри пакета —
//   node node_modules/cardona-core-service/scripts/root-cause-guard.mjs
// cwd хука = корень проекта (панели), поэтому git берётся из панели, а сам скрипт
// едет внутри node_modules.
//
// Выключение: переменная окружения CARDONA_ROOT_CAUSE=0.
// Контракт Stop-хука: читаем JSON из stdin (stop_hook_active), при блокировке
// печатаем {"decision":"block","reason":...} в stdout и выходим с кодом 0.

import { readFileSync } from 'node:fs'
import { computePushState, gitDirPath, readMarked, writeMarked } from './push-state.mjs'

function done() {
  process.exit(0)
}

// Полное выключение через окружение.
if (process.env.CARDONA_ROOT_CAUSE === '0')
  done()

const cwd = process.cwd()
const stateFile = gitDirPath(cwd, 'cardona-root-cause.state')

// Ключ задачи из имени ветки поверх общего push-состояния.
function computeState() {
  const push = computePushState(cwd)
  const ticket = (push.branch.match(/^(BAC-\d+)/i) || [])[1]?.toUpperCase() || null

  return { ...push, ticket }
}

// --mark: записать текущую сигнатуру и выйти (вызывается скиллом в конце работы).
if (process.argv.includes('--mark')) {
  try {
    writeMarked(stateFile, computeState().signature)
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
if (state.signature === readMarked(stateFile))
  done()

const reason = [
  `The branch of ticket ${state.ticket} was pushed (a new push relative to ${state.baseBranch}).`,
  'Set the **Root cause** field in Jira: invoke the /root-cause skill.',
  'The skill checks the issue type and the presence of the field itself — if this is not a',
  'Bug/Sub-bug, or the field is absent, it does nothing (and marks the diff as handled so the',
  'reminder does not come back).',
].join('\n')

process.stdout.write(JSON.stringify({
  decision: 'block',
  reason,
  hookSpecificOutput: {
    hookEventName: 'Stop',
    additionalContext: '"Root cause" is a Jira select field. The /root-cause skill reads its options '
      + 'live (getJiraIssueTypeMetaWithFields), analyses the branch diff and sets the category. '
      + 'Turn the auto-reminders off with env CARDONA_ROOT_CAUSE=0.',
  },
}))
done()
