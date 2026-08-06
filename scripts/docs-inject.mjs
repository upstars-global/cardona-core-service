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

let rawIndex = ''
try {
  rawIndex = readFileSync(indexPath, 'utf8').trim()
}
catch {
  done()
}

if (!rawIndex)
  done()

// Инжект платится в КАЖДОЙ сессии, поэтому шлём не весь index.md, а сжатую форму:
// строка на раздел, только имена страниц — без хвостов «— описание» и без шапки
// «не редактируйте вручную» (она нужна человеку в Obsidian, не модели).
const MAX_INDEX_CHARS = 2000

function compactIndex(md) {
  const sections = []
  let current = null

  for (const line of md.split('\n')) {
    const heading = line.match(/^##\s+(.+)$/)
    if (heading) {
      current = { title: heading[1].trim(), names: [] }
      sections.push(current)
      continue
    }

    const item = line.match(/^-\s*\[\[([^\]|#]+)/)
    if (item && current)
      current.names.push(item[1].trim())
  }

  const filled = sections.filter(s => s.names.length)
  if (!filled.length)
    return md.slice(0, MAX_INDEX_CHARS)

  const full = filled.map(s => `- **${s.title}:** ${s.names.join(', ')}`).join('\n')
  if (full.length <= MAX_INDEX_CHARS)
    return full

  // Vault перерос бюджет инжекта: отдаём только разделы с количеством,
  // конкретную страницу модель найдёт через --find.
  return `${filled.map(s => `- **${s.title}:** ${s.names.length} стр.`).join('\n')}\n`
    + '(полный список не влезает в бюджет инжекта — искать через `--find`)'
}

const index = compactIndex(rawIndex)

// Правильный путь к docs-map зависит от окружения: в панели скрипт едет в node_modules,
// в самом core-service — в scripts/. Подставляем в инструкцию актуальный.
const pkgScript = 'node_modules/cardona-core-service/scripts/docs-map.mjs'
const docsMap = existsSync(join(cwd, pkgScript)) ? pkgScript : 'scripts/docs-map.mjs'

const additionalContext = [
  '# LLM Wiki проекта (knowledge/)',
  '',
  'Страницы описывают НЕОЧЕВИДНОЕ про сущности: инварианты, ловушки, «почему так»,',
  'порядок вызовов. Не пересказ исходника. Прежде чем читать код «чтобы понять,',
  'как работает X» — проверь страницу X.',
  '',
  `- Найти: \`node ${docsMap} --find <Имя|src/путь>\` (или /query-docs). Нет страницы или устарела — читай исходник.`,
  '- Изменил код — /update-docs (Stop-хук напомнит после пуша).',
  '',
  '## Что есть в vault',
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
