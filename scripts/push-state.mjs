#!/usr/bin/env node
// push-state — общая механика «сработать один раз на пуш ветки».
//
// Без AI и без сети: вершина удалённой ветки (`@{upstream}` → `origin/<branch>`)
// двигается только при `git push`, потому что push обновляет локальный
// remote-tracking ref. Сигнатура привязана к этой вершине, поэтому локальные
// незапушенные коммиты и незакоммиченные правки НЕ будят потребителей.
//
// Используется Stop-хуками: scripts/root-cause-guard.mjs (Jira Root cause) и
// scripts/docs-guard.mjs (Obsidian-документация). У каждого свой файл состояния
// в `.git/`, поэтому они гасятся независимо друг от друга.
//
// Как модуль:
//   import { computePushState, gitDirPath, readMarked, writeMarked, sh } from './push-state.mjs'

import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

// Тихий git: любая ошибка (не репозиторий, нет ref) → пустая строка.
export function sh(cwd, cmd) {
  try {
    return execSync(cmd, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 32 * 1024 * 1024,
    }).trim()
  }
  catch {
    return ''
  }
}

// Абсолютный путь к файлу внутри .git (`git rev-parse --git-dir` может быть относительным).
export function gitDirPath(cwd, name) {
  const gitDir = sh(cwd, 'git rev-parse --git-dir')
  if (!gitDir)
    return null

  return join(cwd, gitDir, name)
}

// Ветка + вершина её удалённого аналога → сигнатура пуша.
//
// hasPushedCommits: ветка запушена и содержит хотя бы один коммит поверх точки
// ветвления от дефолтной ветки — то есть на удалённой есть что документировать.
export function computePushState(cwd) {
  const branch = sh(cwd, 'git rev-parse --abbrev-ref HEAD')

  let remoteHead = sh(cwd, 'git rev-parse --verify --quiet @{upstream}')
  if (!remoteHead && branch && branch !== 'HEAD')
    remoteHead = sh(cwd, `git rev-parse --verify --quiet origin/${branch}`)

  let baseBranch = null
  let base = null
  if (remoteHead) {
    for (const b of ['master', 'main']) {
      const mb = sh(cwd, `git merge-base ${b} ${remoteHead}`)
      if (mb) {
        baseBranch = b
        base = mb
        break
      }
    }
  }

  const hasPushedCommits = Boolean(remoteHead && base && remoteHead !== base && branch !== baseBranch)

  // Ровно та же формула, что была в root-cause-guard до выделения модуля —
  // менять её нельзя, иначе уже записанные .state-файлы перестанут гаситься.
  const signature = createHash('sha1').update(`${branch}\n${remoteHead}`).digest('hex')

  return { branch, baseBranch, base, remoteHead, hasPushedCommits, signature }
}

export function readMarked(file) {
  if (!file)
    return ''
  try {
    return readFileSync(file, 'utf8').trim()
  }
  catch {
    return ''
  }
}

export function writeMarked(file, signature) {
  if (!file)
    return
  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, signature, 'utf8')
  }
  catch {
    // Не мешаем работе, если .git недоступен для записи.
  }
}
