#!/usr/bin/env node
// Root-cause diff collector.
//
// Does the deterministic, token-free work so the AI (the read-only `root-cause`
// subagent) only has to categorise: resolves the whole-branch change set vs the
// default branch, and prints one JSON bundle to stdout — branch, ticketKey,
// baseBranch, changed files and a trimmed diff body.
//
// Usage:
//   node collect-diff.mjs                 # auto: whole current branch vs master/main (+ uncommitted)
//   node collect-diff.mjs HEAD~1 HEAD     # explicit git range (two args)
//   node collect-diff.mjs master...HEAD   # explicit range (one arg)
//
// It never throws on missing files/empty greps and always exits 0 — the diff is
// best-effort; the AI still applies judgement.

import { execSync } from 'node:child_process'

const REPO = process.cwd()
const DIFF_CAP = 60000

const sh = (cmd, opts = {}) => {
  try {
    return execSync(cmd, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024, ...opts }).trim()
  } catch {
    return ''
  }
}
const lines = (s) => (s ? s.split('\n').filter(Boolean) : [])

// Default branch: prefer master, fall back to main, then the literal 'master'.
function resolveBase() {
  for (const b of ['master', 'main']) {
    const mb = sh(`git merge-base ${b} HEAD`)
    if (mb) return { baseBranch: b, base: mb }
  }
  return { baseBranch: 'master', base: 'master' }
}

// Whole current branch: everything it contains that the default branch doesn't —
// committed diff vs the fork point PLUS uncommitted work (staged, unstaged, untracked).
// Fallback: last commit (when on the default branch or no branch diff).
function resolveChangeSet() {
  const argv = process.argv.slice(2)
  if (argv.length) {
    const range = argv.length === 2 ? `${argv[0]} ${argv[1]}` : argv[0]
    return { source: 'explicit', baseBranch: null, range, files: lines(sh(`git diff --name-only ${range}`)), diffCmd: `git diff ${range}` }
  }
  const branch = sh('git rev-parse --abbrev-ref HEAD')
  const { baseBranch, base } = resolveBase()
  if (branch && branch !== baseBranch) {
    const tracked = lines(sh(`git diff --name-only ${base}`)) // committed-since-base + staged + unstaged
    const untracked = lines(sh('git ls-files --others --exclude-standard'))
    const files = [...new Set([...tracked, ...untracked])].filter(Boolean)
    if (files.length) return { source: 'branch (incl. uncommitted)', baseBranch, range: `${base}..worktree`, files, diffCmd: `git diff ${base}` }
  }
  return { source: 'last-commit', baseBranch, range: 'HEAD~1 HEAD', files: lines(sh('git diff --name-only HEAD~1 HEAD')), diffCmd: 'git diff HEAD~1 HEAD' }
}

const cs = resolveChangeSet()
const branch = sh('git rev-parse --abbrev-ref HEAD')

const bundle = {
  branch,
  ticketKey: (branch.match(/^(BAC-\d+)/i) || [])[1]?.toUpperCase() || null,
  baseBranch: cs.baseBranch,
  source: cs.source,
  range: cs.range,
  changedFiles: cs.files,
  diff: cs.files.length
    ? sh(`${cs.diffCmd} -U1 -- ${cs.files.map((f) => JSON.stringify(f)).join(' ')}`).slice(0, DIFF_CAP)
    : '',
  notes: [
    'Diff is best-effort and capped at 60KB. If it looks truncated, run the git commands yourself.',
    'ticketKey is the BAC-XXXX prefix of the branch name (uppercased), or null if the branch is not a BAC branch.',
  ],
}

process.stdout.write(JSON.stringify(bundle, null, 2))
