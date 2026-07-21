#!/usr/bin/env node
// docs-inject — SessionStart-хук Claude Code для механизма Obsidian-документации.
//
// Реализует «query»-часть LLM Wiki на автомате: при старте сессии инжектит в контекст
// компактный индекс vault (`knowledge/index.md`) + короткую инструкцию «сначала читай
// страницу knowledge/, потом исходник». Так AI сразу знает карту документации и экономит
// контекст, не сканируя код ради понимания сущностей.
//
// Раздача в панели: команда хука ссылается на этот файл внутри пакета —
//   node node_modules/cardona-core-service/scripts/docs-inject.mjs
// cwd хука = корень проекта (панели), поэтому knowledge/ берётся из панели.
//
// Контракт SessionStart-хука: печатаем {"hookSpecificOutput":{"hookEventName":"SessionStart",
// "additionalContext":"..."}} в stdout и выходим с кодом 0. Если vault/index.md нет —
// тихо выходим без вывода. Любая ошибка не должна ломать старт сессии.
//
// Выключение: переменная окружения CARDONA_DOCS_GUARD=0 (общая с docs-guard).

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function done() {
  process.exit(0)
}

// Общий с docs-guard рубильник.
if (process.env.CARDONA_DOCS_GUARD === '0')
  done()

// cwd берём из stdin SessionStart-хука, иначе — текущий.
let cwd = process.cwd()
try {
  const raw = readFileSync(0, 'utf8').trim()
  if (raw) {
    const input = JSON.parse(raw)
    if (input.cwd)
      cwd = input.cwd
  }
}
catch {
  // stdin недоступен (ручной запуск) — остаёмся на process.cwd().
}

const indexPath = join(cwd, 'knowledge', 'index.md')
if (!existsSync(indexPath))
  done()

let index = ''
try {
  index = readFileSync(indexPath, 'utf8').trim()
}
catch {
  done()
}

if (!index)
  done()

// Правильный путь к docs-map зависит от окружения: в панели скрипт едет в node_modules,
// в самом core-service — в scripts/. Подставляем в инструкцию актуальный.
const pkgScript = 'node_modules/cardona-core-service/scripts/docs-map.mjs'
const docsMap = existsSync(join(cwd, pkgScript)) ? pkgScript : 'scripts/docs-map.mjs'

const additionalContext = [
  '# База знаний Obsidian (knowledge/) — читай ПЕРВОЙ',
  '',
  'В проекте поддерживается LLM Wiki в `knowledge/`: маленькие страницы, одна сущность на',
  'страницу (model / store / composable / component / config / service). ПРЕЖДЕ чем читать',
  'исходник сущности — прочитай её страницу `knowledge/`, это дешевле и экономит контекст.',
  '',
  `- Найти страницу: \`node ${docsMap} --find <Имя|src/путь>\` (или скилл /query-docs).`,
  '  Открывай исходник, только если страницы нет или она устарела.',
  '- Держи актуальной: изменил код — вызови /update-docs (Stop-хук docs-guard напомнит).',
  '',
  '## Индекс (карта содержимого)',
  '',
  index,
].join('\n')

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext,
  },
}))

process.exit(0)
