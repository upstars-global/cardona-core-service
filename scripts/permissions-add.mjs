#!/usr/bin/env node
// permissions-add — детерминированное добавление одного доступа в бэкофис.
//
// Раньше это делал Sonnet-агент: читал большой src/configs/permissions.ts, искал место
// в enum, искал группу, вставлял запись в нужном порядке и правил en.json. Работа полностью
// выводится из аргументов, поэтому её делает скрипт — без токенов и без риска промахнуться
// мимо соседа.
//
// Что правится:
//   src/configs/permissions.ts          — член enum PermissionType + запись в группе
//   src/plugins/i18n/locales/en.json    — подпись в неймспейсе "permission"
//
// Порядок внутри группы = порядок на экране ролей = порядок в меню, поэтому позиция
// задаётся соседом (--after), а не «в конец».
//
// Использование:
//   node permissions-add.mjs --key backoffice-season-vip-status --label "VIP Seasons" \
//     --group gamification --after backoffice-vip-manager [--type Table|Switch] \
//     [--enum BackofficeSeasonVipStatus] [--not-access-level 2,4] [--dry-run]
//
//   --key    ключ доступа с бэкенда (не угадывать)
//   --label  подпись на экране ролей (en.json)
//   --group  ключ группы в default-экспорте permissions.ts (gamification, players, promo, …)
//   --after  сосед, ПОСЛЕ которого встать: ключ доступа или имя члена enum.
//            Без него — в конец enum / группы / неймспейса.
//   --enum   имя члена enum, если автогенерация из ключа не подходит
//            (в проекте есть нерегулярные пары вида BackofficGroups = 'backoffice-neocore-groups')
//   --type   Table (уровни 0–4, по умолчанию) или Switch (вкл/выкл)
//   --not-access-level  запрещённые уровни, например 2,4
//
// Скрипт идемпотентен: повторный запуск ничего не дублирует, а сообщает, что уже на месте.
// Ничего не пишет при --dry-run и при любой нераспознанной структуре файла — лучше
// отказаться и сказать почему, чем испортить конфиг.

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CWD = process.cwd()
const PERMISSIONS_TS = join(CWD, 'src/configs/permissions.ts')
const EN_JSON = join(CWD, 'src/plugins/i18n/locales/en.json')

// ---------- аргументы ----------

function parseArgs(argv) {
  const args = { dryRun: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dry-run') {
      args.dryRun = true
      continue
    }
    if (!a.startsWith('--'))
      continue

    const camel = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    args[camel] = argv[i + 1]
    i++
  }

  return args
}

function fail(message) {
  console.error(`[permissions-add] ${message}`)
  process.exit(1)
}

const args = parseArgs(process.argv.slice(2))

if (!args.key || !args.group)
  fail('--key and --group are required. See the script header for the argument reference.')
if (!/^[a-z][a-z0-9-]*$/.test(args.key))
  fail(`--key "${args.key}" does not look like an access key (kebab-case expected, e.g. backoffice-vip-seasons).`)
if (!existsSync(PERMISSIONS_TS))
  fail(`${PERMISSIONS_TS} not found — run this from the root of a panel project.`)

const formType = args.type || 'Table'
if (!['Table', 'Switch'].includes(formType))
  fail(`--type must be Table or Switch, got "${formType}".`)

const pascal = key => key.split('-').filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1)).join('')
const enumName = args.enum || pascal(args.key)
const notAccessLevel = args.notAccessLevel
  ? args.notAccessLevel.split(',').map(s => Number(s.trim())).filter(n => Number.isInteger(n))
  : null

const changes = []
const skipped = []

// ---------- permissions.ts ----------

const tsLines = readFileSync(PERMISSIONS_TS, 'utf8').split('\n')

// Границы блока `export enum PermissionType { … }`.
const enumStart = tsLines.findIndex(l => /^export enum PermissionType\s*\{/.test(l))
if (enumStart === -1)
  fail('`export enum PermissionType {` not found in permissions.ts.')

const enumEnd = tsLines.findIndex((l, i) => i > enumStart && /^\}/.test(l))
if (enumEnd === -1)
  fail('the closing brace of enum PermissionType was not found.')

// Карта member → value по строкам enum.
const enumMembers = new Map()
for (let i = enumStart + 1; i < enumEnd; i++) {
  const m = tsLines[i].match(/^\s*([A-Za-z_]\w*)\s*=\s*'([^']+)'/)
  if (m)
    enumMembers.set(m[1], { value: m[2], line: i })
}

// Сосед: принимаем и ключ доступа, и имя члена enum.
function resolveNeighbor(ref) {
  if (!ref)
    return null
  if (enumMembers.has(ref))
    return ref

  for (const [name, info] of enumMembers) {
    if (info.value === ref)
      return name
  }

  return null
}

const afterEnum = resolveNeighbor(args.after)
if (args.after && !afterEnum)
  fail(`the --after neighbour "${args.after}" was not found in enum PermissionType (neither as a member name nor as a value).`)

// 1. Член enum.
const existingByValue = [...enumMembers].find(([, info]) => info.value === args.key)
if (existingByValue) {
  skipped.push(`enum: ${existingByValue[0]} = '${args.key}' already exists`)
}
else if (enumMembers.has(enumName)) {
  fail(`the enum member name ${enumName} is already taken by the value '${enumMembers.get(enumName).value}'. Pass a different one via --enum.`)
}
else {
  const insertAt = afterEnum ? enumMembers.get(afterEnum).line + 1 : enumEnd
  // Последний член enum в проекте идёт без запятой — добавим её, если встаём после него.
  if (insertAt === enumEnd) {
    const lastIdx = enumEnd - 1
    if (tsLines[lastIdx].trim() && !tsLines[lastIdx].trimEnd().endsWith(','))
      tsLines[lastIdx] = `${tsLines[lastIdx].trimEnd()},`
  }
  tsLines.splice(insertAt, 0, `  ${enumName} = '${args.key}',`)
  changes.push(`permissions.ts: enum ${enumName} = '${args.key}'${afterEnum ? ` (after ${afterEnum})` : ' (at the end of the enum)'}`)
}

// 2. Запись в группе. Границы группы ищем заново — строки могли сдвинуться после вставки в enum.
const groupStart = tsLines.findIndex(l => new RegExp(`^  ${args.group}:\\s*\\[`).test(l))
if (groupStart === -1) {
  const groups = tsLines.filter(l => /^ {2}[A-Za-z]\w*:\s*\[/.test(l)).map(l => l.trim().split(':')[0])
  fail(`group "${args.group}" was not found in the default export. Available: ${groups.join(', ')}`)
}

const groupEnd = tsLines.findIndex((l, i) => i > groupStart && /^ {2}\] as PermissionUpdatableTable\[\],/.test(l))
if (groupEnd === -1)
  fail(`the end of group "${args.group}" was not found (the \`] as PermissionUpdatableTable[],\` line).`)

const groupBody = tsLines.slice(groupStart + 1, groupEnd)
const alreadyInGroup = groupBody.some(l => l.includes(`PermissionType.${enumName}`) || l.includes(`PermissionType.${existingByValue?.[0]}`))

if (alreadyInGroup) {
  skipped.push(`group ${args.group}: an entry for ${enumName} already exists`)
}
else {
  // Позиция: сразу после записи соседа (её закрывающая `},`), иначе в конец группы.
  let insertAt = groupEnd
  let placedAfter = null
  if (afterEnum) {
    const targetIdx = groupBody.findIndex(l => new RegExp(`target:\\s*PermissionType\\.${afterEnum}\\b`).test(l))
    if (targetIdx === -1) {
      console.warn(`[permissions-add] warning: the neighbour ${afterEnum} is not in group "${args.group}" — the entry will go to the end of the group.`)
    }
    else {
      const closeIdx = groupBody.findIndex((l, i) => i > targetIdx && /^ {4}\},/.test(l))
      if (closeIdx !== -1) {
        insertAt = groupStart + 1 + closeIdx + 1
        placedAfter = afterEnum
      }
    }
  }

  const entry = [
    '    {',
    `      type: PermissionFormType.${formType},`,
    `      target: PermissionType.${enumName},`,
    ...(notAccessLevel ? [`      notAccessLevel: [${notAccessLevel.join(', ')}],`] : []),
    '    },',
  ]
  tsLines.splice(insertAt, 0, ...entry)
  changes.push(`permissions.ts: group ${args.group} ← ${formType}/${enumName}${placedAfter ? ` (after ${placedAfter})` : ' (at the end of the group)'}${notAccessLevel ? ` notAccessLevel [${notAccessLevel.join(', ')}]` : ''}`)
}

// ---------- en.json ----------

const jsonLines = existsSync(EN_JSON) ? readFileSync(EN_JSON, 'utf8').split('\n') : null

if (!jsonLines) {
  skipped.push(`en.json not found (${EN_JSON}) — the label was not added`)
}
else if (!args.label) {
  skipped.push('en.json: --label was not given — the label was not added')
}
else {
  const nsStart = jsonLines.findIndex(l => /^ {2}"permission":\s*\{/.test(l))
  if (nsStart === -1) {
    skipped.push('en.json: the "permission" namespace was not found — the label was not added')
  }
  else {
    const nsEnd = jsonLines.findIndex((l, i) => i > nsStart && /^ {2}\},?$/.test(l))
    const body = jsonLines.slice(nsStart + 1, nsEnd)

    if (body.some(l => l.trim().startsWith(`"${args.key}":`))) {
      skipped.push(`en.json: the key "${args.key}" already exists`)
    }
    else {
      const neighborKey = afterEnum ? enumMembers.get(afterEnum)?.value : null
      const neighborIdx = neighborKey ? body.findIndex(l => l.trim().startsWith(`"${neighborKey}":`)) : -1
      const insertAt = neighborIdx !== -1 ? nsStart + 1 + neighborIdx + 1 : nsEnd

      // Встаём в конец объекта: предыдущему ключу нужна запятая, своей строке — наоборот,
      // без неё (иначе висячая запятая ломает JSON). После соседа — обычная строка с запятой.
      const atEnd = insertAt === nsEnd
      if (atEnd) {
        const lastIdx = nsEnd - 1
        if (jsonLines[lastIdx].trim() && !jsonLines[lastIdx].trimEnd().endsWith(','))
          jsonLines[lastIdx] = `${jsonLines[lastIdx].trimEnd()},`
      }

      jsonLines.splice(insertAt, 0, `    "${args.key}": ${JSON.stringify(args.label)}${atEnd ? '' : ','}`)
      changes.push(`en.json: "${args.key}": "${args.label}"${neighborIdx !== -1 ? ` (after "${neighborKey}")` : ' (at the end of the namespace)'}`)
    }
  }
}

// ---------- запись / вывод ----------

if (!changes.length) {
  console.log('[permissions-add] nothing to do — everything is already in place:')
  skipped.forEach(s => console.log(`  • ${s}`))
  process.exit(0)
}

if (args.dryRun) {
  console.log('[permissions-add] --dry-run, files untouched. What would have been done:')
  changes.forEach(c => console.log(`  + ${c}`))
  skipped.forEach(s => console.log(`  • ${s}`))
  process.exit(0)
}

writeFileSync(PERMISSIONS_TS, tsLines.join('\n'))
if (jsonLines)
  writeFileSync(EN_JSON, jsonLines.join('\n'))

console.log('[permissions-add] done:')
changes.forEach(c => console.log(`  + ${c}`))
skipped.forEach(s => console.log(`  • ${s}`))
console.log('  Next: yarn typecheck && yarn lint')
