#!/usr/bin/env node
// claude-budget — счётчик стоимости обвязки Claude Code (скиллы, агенты, команды, правила,
// CLAUDE.md, SessionStart-инжекты) в токенах.
//
// Зачем: оптимизировать расход имеет смысл только с цифрами до/после. Скрипт разделяет
// стоимость на два принципиально разных класса:
//
//   always-on  — платится в КАЖДОЙ сессии, даже если ни один скилл не сработал:
//                frontmatter-описания всех скиллов и агентов (Claude Code кладёт их в
//                системный промпт), CLAUDE.md, .claude/rules/*, описания команд и payload
//                SessionStart-хука docs-inject.
//   on-trigger — платится только при вызове конкретного скилла/агента: тело SKILL.md,
//                тело агента и файлы references/, которые они читают.
//
// Оценка токенов — аппроксимация `символы / 4`. Абсолютные значения приблизительные;
// смысл имеет СРАВНЕНИЕ до/после, а оно на этой метрике корректно.
//
// Использование:
//   node scripts/claude-budget.mjs                # таблица текущего состояния
//   node scripts/claude-budget.mjs --baseline     # снять снапшот в .claude/.budget-baseline.json
//   node scripts/claude-budget.mjs --compare      # текущее состояние против снапшота
//   node scripts/claude-budget.mjs --json         # машинный вывод
//
// В панелях скрипт едет внутри зависимости:
//   node node_modules/cardona-core-service/scripts/claude-budget.mjs
// cwd = корень проекта, поэтому считается обвязка панели (включая симлинки в core-service).

import { existsSync, readdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'

const CWD = process.cwd()
const CLAUDE_DIR = join(CWD, '.claude')
const BASELINE_FILE = join(CLAUDE_DIR, '.budget-baseline.json')

// ---------- примитивы ----------

const CHARS_PER_TOKEN = 4
const toTokens = chars => Math.round(chars / CHARS_PER_TOKEN)

function read(abs) {
  try {
    return readFileSync(abs, 'utf8')
  }
  catch {
    return ''
  }
}

// Разбор frontmatter: возвращает { raw, body, fields }.
// Значения полей могут быть многострочными (YAML `|`), поэтому склеиваем продолжения.
function splitFrontmatter(text) {
  if (!text.startsWith('---\n'))
    return { raw: '', body: text, fields: {} }

  const end = text.indexOf('\n---', 3)
  if (end === -1)
    return { raw: '', body: text, fields: {} }

  const raw = text.slice(4, end)
  const body = text.slice(end + 4).replace(/^\n/, '')
  const fields = {}

  let current = null
  for (const line of raw.split('\n')) {
    const m = line.match(/^([a-zA-Z_][\w-]*):\s?(.*)$/)
    if (m) {
      current = m[1]
      fields[current] = m[2].replace(/^\|\s*$/, '')
    }
    else if (current && /^\s+/.test(line)) {
      fields[current] += (fields[current] ? '\n' : '') + line.trim()
    }
  }

  return { raw, body, fields }
}

// Что Claude Code реально кладёт в системный промпт на каждую сущность:
// её имя + описание (+ немного служебной разметки). Считаем name + description.
const advertisedCost = fields =>
  (fields.name || '').length + (fields.description || '').length

function listDir(dir, predicate) {
  if (!existsSync(dir))
    return []

  return readdirSync(dir)
    .filter(name => !name.startsWith('.'))
    .map(name => ({ name, abs: join(dir, name) }))
    .filter(predicate)
    .sort((a, b) => a.name.localeCompare(b.name))
}

const isDir = abs => {
  try {
    return statSync(abs).isDirectory()
  }
  catch {
    return false
  }
}

// Откуда сущность: симлинк в core-service = общая (core); вендорённая в .agents/ =
// чужая (external, не наша зона ответственности); всё остальное = своя (local/override).
const originOf = (abs) => {
  let real = abs
  try {
    real = realpathSync(abs)
  }
  catch { /* битый симлинк — считаем по исходному пути */ }

  if (real.includes(join('node_modules', 'cardona-core-service')))
    return 'core'
  if (real.includes(`${'/'}.agents${'/'}`))
    return 'external'

  return 'local'
}

// ---------- сбор ----------

// Файлы references/, на которые ссылается тело скилла.
// ОБЯЗАТЕЛЬНЫЙ — есть хотя бы одно безусловное указание прочитать файл.
// УСЛОВНЫЙ — упоминания только в таблице «когда читать» или с маркером условия
// («only if», «when», «for less common needs», «если»). Он оплачивается не всегда,
// поэтому в стоимость триггера не входит, а показывается отдельно.
const CONDITION_MARKER = /\bonly\b|\bif\b|\bwhen\b|less common|advanced|если|когда|при необходимости|редк/i

function referencesOf(skillDir, body) {
  const refDir = join(skillDir, 'references')
  if (!existsSync(refDir))
    return []

  const lines = body.split('\n')

  return listDir(refDir, e => e.name.endsWith('.md')).map(({ name, abs }) => {
    const mentions = lines.filter(l => l.includes(name))
    const unconditional = mentions
      .filter(l => !l.trim().startsWith('|')) // строки таблицы «когда читать» — всегда условны
      .some(l => !CONDITION_MARKER.test(l))

    return {
      name: `references/${name}`,
      chars: read(abs).length,
      mentioned: mentions.length > 0,
      conditional: !unconditional,
    }
  })
}

// Скрипты скилла — они не стоят токенов (их выполняет node), но полезно видеть,
// что часть работы уже переехала в код.
function scriptsOf(skillDir) {
  const dir = join(skillDir, 'scripts')

  return listDir(dir, e => /\.(mjs|js|sh)$/.test(e.name)).map(e => e.name)
}

function collectSkills() {
  const dir = join(CLAUDE_DIR, 'skills')

  return listDir(dir, e => isDir(e.abs) && existsSync(join(e.abs, 'SKILL.md'))).map(({ name, abs }) => {
    const text = read(join(abs, 'SKILL.md'))
    const { body, fields } = splitFrontmatter(text)

    return {
      kind: 'skill',
      name,
      origin: originOf(abs),
      alwaysOnChars: advertisedCost(fields),
      bodyChars: body.length,
      references: referencesOf(abs, body),
      scripts: scriptsOf(abs),
    }
  })
}

// Плейбуки/скиллы, которые агент читает по инструкции в своём теле.
function playbooksOf(body) {
  const found = new Set()
  const re = /\.claude\/skills\/([\w-]+)\/([\w./-]+\.md)/g
  let m
  while ((m = re.exec(body)) !== null) {
    const abs = join(CLAUDE_DIR, 'skills', m[1], m[2])
    if (existsSync(abs))
      found.add(`${m[1]}/${m[2]}`)
  }

  return [...found].map(rel => ({ name: rel, chars: read(join(CLAUDE_DIR, 'skills', rel)).length }))
}

function collectAgents() {
  const dir = join(CLAUDE_DIR, 'agents')

  return listDir(dir, e => e.name.endsWith('.md')).map(({ name, abs }) => {
    const { body, fields } = splitFrontmatter(read(abs))

    return {
      kind: 'agent',
      name: basename(name, '.md'),
      origin: originOf(abs),
      model: fields.model || '(inherit)',
      alwaysOnChars: advertisedCost(fields),
      bodyChars: body.length,
      playbooks: playbooksOf(body),
    }
  })
}

function collectCommands() {
  const dir = join(CLAUDE_DIR, 'commands')

  return listDir(dir, e => e.name.endsWith('.md')).map(({ name, abs }) => {
    const { body, fields } = splitFrontmatter(read(abs))

    return {
      kind: 'command',
      name: basename(name, '.md'),
      origin: originOf(abs),
      alwaysOnChars: (fields.description || '').length + name.length,
      bodyChars: body.length,
    }
  })
}

// CLAUDE.md + всё, что он подключает через `@путь` (например @.claude/rules/code-conventions.md).
function collectClaudeMd() {
  const entries = []
  const rootAbs = join(CWD, 'CLAUDE.md')
  if (!existsSync(rootAbs))
    return entries

  const text = read(rootAbs)
  entries.push({ kind: 'context', name: 'CLAUDE.md', chars: text.length })

  const re = /^@([\w./-]+\.md)\s*$/gm
  let m
  while ((m = re.exec(text)) !== null) {
    const abs = join(CWD, m[1])
    if (existsSync(abs))
      entries.push({ kind: 'context', name: m[1], chars: read(abs).length })
  }

  return entries
}

// Payload SessionStart-хука docs-inject: врезка-инструкция + knowledge/index.md.
// Врезку считаем по её реальному размеру в docs-inject.mjs, а не «на глаз».
function collectDocsInject() {
  const indexAbs = join(CWD, 'knowledge', 'index.md')
  if (!existsSync(indexAbs))
    return []

  const injectAbs = [
    join(CWD, 'node_modules', 'cardona-core-service', 'scripts', 'docs-inject.mjs'),
    join(CWD, 'scripts', 'docs-inject.mjs'),
  ].find(existsSync)

  // Строки шаблона внутри docs-inject лежат в массиве additionalContext — суммируем их длину.
  let preambleChars = 0
  if (injectAbs) {
    const src = read(injectAbs)
    const block = src.slice(src.indexOf('const additionalContext = ['), src.indexOf('].join('))
    preambleChars = [...block.matchAll(/'((?:[^'\\]|\\.)*)'/g)].reduce((sum, m) => sum + m[1].length + 1, 0)
  }

  return [
    { kind: 'context', name: 'docs-inject: врезка', chars: preambleChars },
    { kind: 'context', name: 'docs-inject: knowledge/index.md', chars: read(indexAbs).length },
  ]
}

function collect() {
  const skills = collectSkills()
  const agents = collectAgents()
  const commands = collectCommands()
  const context = [...collectClaudeMd(), ...collectDocsInject()]

  const alwaysOn = [
    ...skills.map(s => ({ name: `skill: ${s.name}`, chars: s.alwaysOnChars })),
    ...agents.map(a => ({ name: `agent: ${a.name}`, chars: a.alwaysOnChars })),
    ...commands.map(c => ({ name: `cmd: ${c.name}`, chars: c.alwaysOnChars })),
    ...context.map(c => ({ name: c.name, chars: c.chars })),
  ]

  const alwaysOnChars = alwaysOn.reduce((s, e) => s + e.chars, 0)

  // on-trigger по скиллу: тело + обязательные references (условные считаем отдельно).
  const perSkill = skills.map((s) => {
    const required = s.references.filter(r => r.mentioned && !r.conditional).reduce((sum, r) => sum + r.chars, 0)
    const conditional = s.references.filter(r => r.conditional).reduce((sum, r) => sum + r.chars, 0)

    return { ...s, requiredChars: s.bodyChars + required, conditionalChars: conditional }
  })

  const perAgent = agents.map(a => ({
    ...a,
    requiredChars: a.bodyChars + a.playbooks.reduce((sum, p) => sum + p.chars, 0),
  }))

  return { repo: basename(CWD), alwaysOn, alwaysOnChars, skills: perSkill, agents: perAgent, commands, context }
}

// ---------- вывод ----------

const pad = (s, n) => String(s).padEnd(n)
const padL = (s, n) => String(s).padStart(n)
const fmt = chars => `${padL(toTokens(chars), 6)} tok  ${padL((chars / 1024).toFixed(1), 6)} КБ`

function printTable(data) {
  console.log(`\n=== claude-budget: ${data.repo} ===`)
  console.log(`(оценка токенов = символы / ${CHARS_PER_TOKEN}; значения приблизительные, сравнение до/после — корректное)\n`)

  console.log('── ALWAYS-ON (в каждой сессии) ───────────────────────────────')
  for (const e of [...data.alwaysOn].sort((a, b) => b.chars - a.chars)) {
    if (e.chars > 0)
      console.log(`  ${pad(e.name, 40)} ${fmt(e.chars)}`)
  }
  console.log(`  ${pad('ИТОГО always-on', 40)} ${fmt(data.alwaysOnChars)}\n`)

  console.log('── ON-TRIGGER: скиллы ────────────────────────────────────────')
  for (const s of [...data.skills].sort((a, b) => b.requiredChars - a.requiredChars)) {
    const tags = [
      s.origin,
      s.scripts.length ? `scripts:${s.scripts.length}` : null,
      s.conditionalChars ? `+${toTokens(s.conditionalChars)} tok условно` : null,
    ].filter(Boolean).join(', ')
    console.log(`  ${pad(s.name, 40)} ${fmt(s.requiredChars)}  [${tags}]`)
  }

  console.log('\n── ON-TRIGGER: агенты ────────────────────────────────────────')
  for (const a of [...data.agents].sort((a, b) => b.requiredChars - a.requiredChars))
    console.log(`  ${pad(`${a.name} (${a.model})`, 40)} ${fmt(a.requiredChars)}`)

  console.log('')
}

function printCompare(now, base) {
  console.log(`\n=== claude-budget --compare: ${now.repo} ===`)
  console.log(`(baseline снят: ${base.takenAt})\n`)

  const delta = (a, b) => {
    const d = a - b
    const sign = d > 0 ? '+' : ''

    return `${padL(`${sign}${toTokens(d)}`, 7)} tok  ${padL(`${sign}${(d / 1024).toFixed(1)}`, 7)} КБ`
  }

  console.log('── ALWAYS-ON ─────────────────────────────────────────────────')
  console.log(`  было:  ${fmt(base.alwaysOnChars)}`)
  console.log(`  стало: ${fmt(now.alwaysOnChars)}`)
  console.log(`  дельта:${delta(now.alwaysOnChars, base.alwaysOnChars)}\n`)

  const rows = (list, key) => new Map(list.map(e => [e.name, e[key]]))

  for (const [label, nowList, baseList] of [
    ['ON-TRIGGER: скиллы', now.skills, base.skills],
    ['ON-TRIGGER: агенты', now.agents, base.agents],
  ]) {
    console.log(`── ${label} ──────────────────────────────────────`)
    const a = rows(nowList, 'requiredChars')
    const b = rows(baseList, 'requiredChars')
    for (const name of new Set([...b.keys(), ...a.keys()])) {
      const was = b.get(name) ?? 0
      const is = a.get(name) ?? 0
      if (was === is)
        continue

      const mark = is === 0 ? ' (удалён)' : was === 0 ? ' (новый)' : ''
      console.log(`  ${pad(name + mark, 40)} ${padL(toTokens(was), 6)} → ${padL(toTokens(is), 6)} tok  ${delta(is, was)}`)
    }
    console.log('')
  }

  // Чужие (external) скиллы не в нашей зоне ответственности — из итога исключаем.
  const ours = list => list.filter(e => e.origin !== 'external')
  const sum = (list, key) => ours(list).reduce((s, e) => s + e[key], 0)
  const wasTotal = base.alwaysOnChars + sum(base.skills, 'requiredChars') + sum(base.agents, 'requiredChars')
  const isTotal = now.alwaysOnChars + sum(now.skills, 'requiredChars') + sum(now.agents, 'requiredChars')
  console.log('── ИТОГО (always-on + наши скиллы + агенты, без external) ────')
  console.log(`  было:  ${fmt(wasTotal)}`)
  console.log(`  стало: ${fmt(isTotal)}`)
  console.log(`  дельта:${delta(isTotal, wasTotal)}\n`)
}

// ---------- CLI ----------

if (!existsSync(CLAUDE_DIR)) {
  console.log(`[claude-budget] ${relative(CWD, CLAUDE_DIR) || '.claude'} не найден — нечего считать.`)
  process.exit(0)
}

const argv = process.argv.slice(2)
const data = collect()

if (argv.includes('--json')) {
  process.stdout.write(JSON.stringify(data, null, 2))
}
else if (argv.includes('--baseline')) {
  writeFileSync(BASELINE_FILE, JSON.stringify({ takenAt: new Date().toISOString().slice(0, 19), ...data }, null, 2))
  printTable(data)
  console.log(`[claude-budget] baseline записан: ${relative(CWD, BASELINE_FILE)}`)
}
else if (argv.includes('--compare')) {
  if (!existsSync(BASELINE_FILE)) {
    console.log('[claude-budget] baseline не найден — сначала `--baseline`.')
    process.exit(0)
  }
  printCompare(data, JSON.parse(read(BASELINE_FILE)))
}
else {
  printTable(data)
}
