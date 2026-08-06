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
  fail('обязательны --key и --group. Подсказка по аргументам — в шапке скрипта.')
if (!/^[a-z][a-z0-9-]*$/.test(args.key))
  fail(`--key "${args.key}" не похож на ключ доступа (ожидается kebab-case, например backoffice-vip-seasons).`)
if (!existsSync(PERMISSIONS_TS))
  fail(`не найден ${PERMISSIONS_TS} — запускать из корня проекта-панели.`)

const formType = args.type || 'Table'
if (!['Table', 'Switch'].includes(formType))
  fail(`--type должен быть Table или Switch, получено "${formType}".`)

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
  fail('в permissions.ts не найден `export enum PermissionType {`.')

const enumEnd = tsLines.findIndex((l, i) => i > enumStart && /^\}/.test(l))
if (enumEnd === -1)
  fail('не найдена закрывающая скобка enum PermissionType.')

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
  fail(`сосед --after "${args.after}" не найден в enum PermissionType (ни как имя члена, ни как значение).`)

// 1. Член enum.
const existingByValue = [...enumMembers].find(([, info]) => info.value === args.key)
if (existingByValue) {
  skipped.push(`enum: ${existingByValue[0]} = '${args.key}' уже есть`)
}
else if (enumMembers.has(enumName)) {
  fail(`имя члена enum ${enumName} уже занято значением '${enumMembers.get(enumName).value}'. Задайте другое через --enum.`)
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
  changes.push(`permissions.ts: enum ${enumName} = '${args.key}'${afterEnum ? ` (после ${afterEnum})` : ' (в конец enum)'}`)
}

// 2. Запись в группе. Границы группы ищем заново — строки могли сдвинуться после вставки в enum.
const groupStart = tsLines.findIndex(l => new RegExp(`^  ${args.group}:\\s*\\[`).test(l))
if (groupStart === -1) {
  const groups = tsLines.filter(l => /^ {2}[A-Za-z]\w*:\s*\[/.test(l)).map(l => l.trim().split(':')[0])
  fail(`группа "${args.group}" не найдена в default-экспорте. Доступные: ${groups.join(', ')}`)
}

const groupEnd = tsLines.findIndex((l, i) => i > groupStart && /^ {2}\] as PermissionUpdatableTable\[\],/.test(l))
if (groupEnd === -1)
  fail(`не найден конец группы "${args.group}" (строка \`] as PermissionUpdatableTable[],\`).`)

const groupBody = tsLines.slice(groupStart + 1, groupEnd)
const alreadyInGroup = groupBody.some(l => l.includes(`PermissionType.${enumName}`) || l.includes(`PermissionType.${existingByValue?.[0]}`))

if (alreadyInGroup) {
  skipped.push(`группа ${args.group}: запись для ${enumName} уже есть`)
}
else {
  // Позиция: сразу после записи соседа (её закрывающая `},`), иначе в конец группы.
  let insertAt = groupEnd
  let placedAfter = null
  if (afterEnum) {
    const targetIdx = groupBody.findIndex(l => new RegExp(`target:\\s*PermissionType\\.${afterEnum}\\b`).test(l))
    if (targetIdx === -1) {
      console.warn(`[permissions-add] предупреждение: соседа ${afterEnum} нет в группе "${args.group}" — запись уйдёт в конец группы.`)
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
  changes.push(`permissions.ts: группа ${args.group} ← ${formType}/${enumName}${placedAfter ? ` (после ${placedAfter})` : ' (в конец группы)'}${notAccessLevel ? ` notAccessLevel [${notAccessLevel.join(', ')}]` : ''}`)
}

// ---------- en.json ----------

const jsonLines = existsSync(EN_JSON) ? readFileSync(EN_JSON, 'utf8').split('\n') : null

if (!jsonLines) {
  skipped.push(`en.json не найден (${EN_JSON}) — подпись не добавлена`)
}
else if (!args.label) {
  skipped.push('en.json: --label не задан — подпись не добавлена')
}
else {
  const nsStart = jsonLines.findIndex(l => /^ {2}"permission":\s*\{/.test(l))
  if (nsStart === -1) {
    skipped.push('en.json: не найден неймспейс "permission" — подпись не добавлена')
  }
  else {
    const nsEnd = jsonLines.findIndex((l, i) => i > nsStart && /^ {2}\},?$/.test(l))
    const body = jsonLines.slice(nsStart + 1, nsEnd)

    if (body.some(l => l.trim().startsWith(`"${args.key}":`))) {
      skipped.push(`en.json: ключ "${args.key}" уже есть`)
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
      changes.push(`en.json: "${args.key}": "${args.label}"${neighborIdx !== -1 ? ` (после "${neighborKey}")` : ' (в конец неймспейса)'}`)
    }
  }
}

// ---------- запись / вывод ----------

if (!changes.length) {
  console.log('[permissions-add] нечего делать — всё уже на месте:')
  skipped.forEach(s => console.log(`  • ${s}`))
  process.exit(0)
}

if (args.dryRun) {
  console.log('[permissions-add] --dry-run, файлы не тронуты. Было бы сделано:')
  changes.forEach(c => console.log(`  + ${c}`))
  skipped.forEach(s => console.log(`  • ${s}`))
  process.exit(0)
}

writeFileSync(PERMISSIONS_TS, tsLines.join('\n'))
if (jsonLines)
  writeFileSync(EN_JSON, jsonLines.join('\n'))

console.log('[permissions-add] готово:')
changes.forEach(c => console.log(`  + ${c}`))
skipped.forEach(s => console.log(`  • ${s}`))
console.log('  Дальше: yarn typecheck && yarn lint')
