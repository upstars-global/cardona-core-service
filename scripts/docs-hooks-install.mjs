#!/usr/bin/env node
// docs-hooks-install — устанавливает git-хук post-commit для механизма LLM Wiki.
//
// Зачем отдельный установщик: `.git/hooks` не версионируется, поэтому хук нельзя
// просто закоммитить — его надо разворачивать в каждом клоне. Скрипт идемпотентен
// и дёшев, поэтому вешается на SessionStart Claude Code: хук доустанавливается сам
// после `git clone`, смены `core.hooksPath` или обновления версии.
//
// Что делает хук: после каждого коммита вызывает `docs-queue.mjs --record`, то есть
// детерминированно копит «долг по документации». Напоминание приходит позже, по
// пушу ветки (scripts/docs-guard.mjs).
//
// Бережно к чужим хукам: если post-commit уже есть и он не наш, он один раз
// сохраняется рядом как `post-commit.pre-cardona`, а наш хук вызывает его в конце.
//
// CLI:
//   node scripts/docs-hooks-install.mjs           # доустановить при необходимости (тихо)
//   node scripts/docs-hooks-install.mjs --force   # перезаписать наш хук
//   node scripts/docs-hooks-install.mjs --status  # показать, что установлено
//
// Выключение: переменная окружения CARDONA_DOCS_GUARD=0.

import { chmodSync, existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sh } from './push-state.mjs'

const MARKER = 'cardona-docs-hook'
const VERSION = 'v1'

// Хук работает и в панели (скрипт внутри node_modules), и в самом core-service.
const HOOK_BODY = `#!/bin/sh
# ${MARKER} ${VERSION} — фиксирует «долг по документации» после коммита (LLM Wiki).
# Ставится скриптом docs-hooks-install.mjs. Никогда не ломает коммит: exit 0 всегда.

HOOK_DIR="$(dirname "$0")"

if [ "$CARDONA_DOCS_GUARD" != "0" ] && command -v node >/dev/null 2>&1; then
  for q in "node_modules/cardona-core-service/scripts/docs-queue.mjs" "scripts/docs-queue.mjs"; do
    if [ -f "$q" ]; then
      node "$q" --record >/dev/null 2>&1 || true
      break
    fi
  done
fi

# Цепочка: ранее существовавший чужой хук сохранён рядом и вызывается после нашего.
if [ -x "$HOOK_DIR/post-commit.pre-cardona" ]; then
  "$HOOK_DIR/post-commit.pre-cardona" "$@" || true
fi

exit 0
`

function main() {
  const cwd = process.cwd()
  const force = process.argv.includes('--force')
  const status = process.argv.includes('--status')

  // `--git-path hooks` учитывает core.hooksPath, в отличие от join(gitDir, 'hooks').
  const hooksRel = sh(cwd, 'git rev-parse --git-path hooks')
  if (!hooksRel)
    return report(status, 'не git-репозиторий — хук не ставлю.')

  const hooksDir = join(cwd, hooksRel)
  if (!existsSync(hooksDir))
    return report(status, `нет каталога хуков ${hooksRel} — хук не ставлю.`)

  const hookPath = join(hooksDir, 'post-commit')
  const existing = existsSync(hookPath) ? safeRead(hookPath) : null
  const isOurs = existing !== null && existing.includes(MARKER)
  const isCurrent = isOurs && existing.includes(`${MARKER} ${VERSION}`)

  if (status) {
    const state = existing === null
      ? 'хука нет'
      : isCurrent
        ? `установлен наш ${VERSION}`
        : isOurs ? 'установлена наша старая версия' : 'установлен чужой хук'

    console.log(`[docs-hooks] ${hooksRel}/post-commit: ${state}`)

    return
  }

  if (isCurrent && !force)
    return

  // Чужой хук — сохраняем один раз, чтобы наш мог вызвать его в конце.
  if (existing !== null && !isOurs) {
    const backup = join(hooksDir, 'post-commit.pre-cardona')
    if (!existsSync(backup)) {
      try {
        renameSync(hookPath, backup)
        chmodSync(backup, 0o755)
      }
      catch {
        // Не смогли отодвинуть чужой хук — не перезаписываем его вслепую.
        console.log('[docs-hooks] не удалось сохранить существующий post-commit — оставляю как есть.')

        return
      }
    }
  }

  try {
    writeFileSync(hookPath, HOOK_BODY, 'utf8')
    chmodSync(hookPath, 0o755)
    console.log(`[docs-hooks] post-commit установлен (${VERSION}): коммит копит долг по документации.`)
  }
  catch {
    console.log('[docs-hooks] не удалось записать post-commit — пропускаю.')
  }
}

function safeRead(file) {
  try {
    return readFileSync(file, 'utf8')
  }
  catch {
    return ''
  }
}

function report(status, msg) {
  if (status)
    console.log(`[docs-hooks] ${msg}`)
}

if (process.env.CARDONA_DOCS_GUARD === '0')
  process.exit(0)

try {
  main()
}
catch {
  // Установка хука не должна мешать ни сессии, ни работе.
}
process.exit(0)
