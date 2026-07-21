#!/usr/bin/env node
// docs-guard — Stop-хук Claude Code для механизма Obsidian-документации.
//
// Без AI и почти без стоимости: детерминированно проверяет, есть ли среди
// незакоммиченных изменений исходники, чья страница в `knowledge/` отсутствует
// или устарела. Если есть — блокирует остановку и точечным сообщением просит
// AI обновить только затронутые страницы (скилл /update-docs). Иначе молча выходит.
//
// Раздача в панели: команда хука ссылается на этот файл внутри пакета —
//   node node_modules/cardona-core-service/scripts/docs-guard.mjs
// cwd хука = корень проекта (панели), поэтому git и knowledge/ берутся из панели,
// а сам скрипт и docs-map.mjs едут вместе внутри node_modules.
//
// Выключение: переменная окружения CARDONA_DOCS_GUARD=0.
// Контракт Stop-хука: читаем JSON из stdin (stop_hook_active), при блокировке
// печатаем {"decision":"block","reason":...} в stdout и выходим с кодом 0.

import { readFileSync } from 'node:fs'
import { pendingDocs } from './docs-map.mjs'

function allow() {
  process.exit(0)
}

// Полное выключение через окружение.
if (process.env.CARDONA_DOCS_GUARD === '0')
  allow()

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
  allow()

const cwd = input.cwd || process.cwd()

let pending = []
try {
  pending = pendingDocs(cwd)
}
catch {
  // Любая ошибка (не git-репо, нет knowledge/ и т.п.) — не мешаем остановке.
  allow()
}

if (!pending.length)
  allow()

const MAX = 12
const shown = pending.slice(0, MAX)
const lines = shown.map(p => `  - ${p.source} → ${p.doc} (${p.reason === 'missing' ? 'нет страницы' : 'устарела'})`)
if (pending.length > MAX)
  lines.push(`  …и ещё ${pending.length - MAX}`)

const reason = [
  'Документация Obsidian отстала от кода. Затронуты страницы `knowledge/`:',
  ...lines,
  '',
  'Обнови/создай только эти страницы: вызови скилл /update-docs.',
  'Если документировать не нужно — ответь пользователю и остановись снова',
  '(повторно этот хук в текущем цикле не сработает).',
].join('\n')

process.stdout.write(JSON.stringify({
  decision: 'block',
  reason,
  hookSpecificOutput: {
    hookEventName: 'Stop',
    additionalContext: 'Правило сопоставления код→страница и хелперы: scripts/docs-map.mjs. '
      + 'После правок: node scripts/docs-map.mjs --build-index, затем --lint '
      + '(битые ссылки/orphans/stale), и запиши операцию: --log "INGEST <страницы>".',
  },
}))
process.exit(0)
