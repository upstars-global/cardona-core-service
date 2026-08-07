#!/usr/bin/env node
// docs-hooks-install — устанавливает git-хук post-commit для механизма LLM Wiki.
//
// Зачем отдельный установщик: `.git/hooks` не версионируется, поэтому хук нельзя
// просто закоммитить — его надо разворачивать в каждом клоне. Скрипт идемпотентен
// и дёшев, поэтому вешается на SessionStart Claude Code: хук доустанавливается сам
// после `git clone`, смены `core.hooksPath` или обновления версии.
//
// Что делает хук: после каждого коммита (1) вызывает `docs-queue.mjs --record`, то есть
// детерминированно копит «долг по документации», и (2) пересобирает `knowledge/index.md`,
// чтобы карта vault никогда не отставала. Напоминание приходит позже, по пушу ветки
// (scripts/docs-guard.mjs).
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
const VERSION = 'v2'

// Хук работает и в панели (скрипт внутри node_modules), и в самом core-service.
//
// v2: кроме учёта долга ещё и пересобирает knowledge/index.md. Раньше это делала модель
// по инструкции внутри /update-docs — и не делала: индекс отставал от vault на несколько
// страниц, а SessionStart инжектил устаревшую карту. Работа детерминированная, её место в хуке.
const HOOK_BODY = `#!/bin/sh
# ${MARKER} ${VERSION} — фиксирует «долг по документации» и пересобирает индекс (LLM Wiki).
# Ставится скриптом docs-hooks-install.mjs. Никогда не ломает коммит: exit 0 всегда.

HOOK_DIR="$(dirname "$0")"

if [ "$CARDONA_DOCS_GUARD" != "0" ] && command -v node >/dev/null 2>&1; then
  for dir in "node_modules/cardona-core-service/scripts" "scripts"; do
    if [ -f "$dir/docs-queue.mjs" ]; then
      node "$dir/docs-queue.mjs" --record >/dev/null 2>&1 || true
      # Индекс пересобираем только если vault существует — иначе создавали бы его на пустом месте.
      if [ -d "knowledge" ] && [ -f "$dir/docs-map.mjs" ]; then
        node "$dir/docs-map.mjs" --build-index >/dev/null 2>&1 || true
      fi
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
    return report(status, 'not a git repository — skipping hook installation.')

  const hooksDir = join(cwd, hooksRel)
  if (!existsSync(hooksDir))
    return report(status, `no hooks directory ${hooksRel} — skipping hook installation.`)

  const hookPath = join(hooksDir, 'post-commit')
  const existing = existsSync(hookPath) ? safeRead(hookPath) : null
  const isOurs = existing !== null && existing.includes(MARKER)
  const isCurrent = isOurs && existing.includes(`${MARKER} ${VERSION}`)

  if (status) {
    const state = existing === null
      ? 'no hook'
      : isCurrent
        ? `ours, ${VERSION}, installed`
        : isOurs ? 'an older version of ours is installed' : 'a foreign hook is installed'

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
        console.log('[docs-hooks] could not preserve the existing post-commit — leaving it as is.')

        return
      }
    }
  }

  try {
    writeFileSync(hookPath, HOOK_BODY, 'utf8')
    chmodSync(hookPath, 0o755)
    console.log(`[docs-hooks] post-commit installed (${VERSION}): commits now accumulate documentation debt.`)
  }
  catch {
    console.log('[docs-hooks] could not write post-commit — skipping.')
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
