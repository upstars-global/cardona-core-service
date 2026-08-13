#!/usr/bin/env node
// section-scaffold — детерминированный скелет list-only секции (стадия C.1 скилла section-list).
//
// Раньше этот проход делал Sonnet-агент: писал route-модуль, вносил его в additional-routes.ts,
// добавлял пункт меню, ключи i18n, стаб модели, useSection.ts и list/index.vue. Всё это
// полностью выводится из pre-flight-инпутов, поэтому делает скрипт. Агент остаётся только
// на стадию C.2 (реальный JSON ответа → колонки, фильтры, sidebar) — там нужно суждение.
//
// Что создаётся/правится:
//   src/plugins/2.router/modules/<section>.ts        (новый: единственный list-роут)
//   src/plugins/2.router/additional-routes.ts        (import + спред)
//   src/navigation/vertical/apps-and-pages/buildMenu.ts (пункт меню)
//   src/plugins/i18n/locales/en.json                 (title.<prefix>.list, emptyState.<prefix>)
//   src/@model/<...>.ts                              (новый: I<Name>ListItemData + <Name>ListItem)
//   src/pages/<folder>/<section>/useSection.ts       (новый: useList)
//   src/pages/<folder>/<section>/list/index.vue      (новый: BaseList)
//
// Использование:
//   node section-scaffold.mjs --section vipSeasons --folder gamification \
//     --permission BackofficeVipSeasons --entity-name 'Vip-ServiceSeasons' \
//     --menu-group gamification --label 'VIP Seasons' \
//     [--menu-after VipManagerList] [--i18n-prefix vipSeasons] [--page-name VipSeasons] \
//     [--prefix Malaga] [--model src/@model/gamification/vipSeasons.ts] \
//     [--url /:project/gamification/vip-seasons] [--no-project] [--empty-text '...'] [--dry-run]
//
// Обязательные: --section --folder --permission --entity-name --menu-group --label
//
// Правило именования держится идентичным тому, что выдал бы sectionRouterGenerator, — чтобы
// section-form мог позже безболезненно заменить модуль на одну запись генератора.
//
// Скрипт идемпотентен: существующие файлы не перезаписываются, повторные вставки не дублируются.
// При непонятной структуре целевого файла он отказывается писать и объясняет почему.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const CWD = process.cwd()

const P = {
  additionalRoutes: join(CWD, 'src/plugins/2.router/additional-routes.ts'),
  buildMenu: join(CWD, 'src/navigation/vertical/apps-and-pages/buildMenu.ts'),
  enJson: join(CWD, 'src/plugins/i18n/locales/en.json'),
}

// ---------- аргументы ----------

function parseArgs(argv) {
  const args = { dryRun: false, noProject: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dry-run') {
      args.dryRun = true
      continue
    }
    if (a === '--no-project') {
      args.noProject = true
      continue
    }
    if (!a.startsWith('--'))
      continue

    args[a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = argv[i + 1]
    i++
  }

  return args
}

function fail(message) {
  console.error(`[section-scaffold] ${message}`)
  process.exit(1)
}

const args = parseArgs(process.argv.slice(2))

for (const required of ['section', 'folder', 'permission', 'entityName', 'menuGroup', 'label']) {
  if (!args[required])
    fail(`--${required.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)} is required. See the script header for the argument reference.`)
}
if (!/^[a-z][A-Za-z0-9]*$/.test(args.section))
  fail(`--section "${args.section}" must be camelCase, e.g. vipSeasons.`)
if (!existsSync(P.additionalRoutes))
  fail(`${P.additionalRoutes} not found — run this from the root of a panel project.`)

// ---------- производные имена ----------

const upper1 = s => s.charAt(0).toUpperCase() + s.slice(1)
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const Section = upper1(args.section)
const routePrefix = args.prefix ? upper1(args.prefix) : ''
const routeName = `${routePrefix}${Section}List`
const pageName = args.pageName || `${routePrefix}${Section}`
const i18nPrefix = args.i18nPrefix || (routePrefix ? `${args.prefix}${Section}` : args.section)
const modelName = `${routePrefix}${Section}`
const modelPath = args.model || `src/@model/${args.section}.ts`
const modelAlias = modelPath.replace(/^src\/@model\//, '@model/').replace(/\.ts$/, '')
const pagesDir = `src/pages/${args.folder}/${args.section}`
const url = args.url || `${args.noProject ? '' : '/:project'}/${kebab(args.folder)}/${kebab(args.section)}`
const emptyText = args.emptyText || `There are no ${args.label.toLowerCase()}`

const created = []
const changes = []
const skipped = []
const notes = []

const writeFile = (rel, content) => {
  const abs = join(CWD, rel)
  if (existsSync(abs)) {
    skipped.push(`${rel} already exists — not overwritten`)

    return
  }
  if (!args.dryRun) {
    mkdirSync(dirname(abs), { recursive: true })
    writeFileSync(abs, content)
  }
  created.push(rel)
}

// ---------- 1. route-модуль ----------

writeFile(`src/plugins/2.router/modules/${args.section}.ts`, `import { PermissionType } from '@permissions'

const permission = PermissionType.${args.permission}
const listPageName = '${routeName}'
const path = '${url}'

const ${args.section} = [
  {
    path,
    name: listPageName,
    component: () => import('@/pages/${args.folder}/${args.section}/list/index.vue'),
    meta: {
      title: '${i18nPrefix}.list',
      permission,
      breadcrumb: [
        {
          title: '${i18nPrefix}.list',
          active: true,
        },
      ],
    },
  },
]

export default ${args.section}
`)

// ---------- 2. additional-routes.ts: import + спред ----------

{
  const lines = readFileSync(P.additionalRoutes, 'utf8').split('\n')
  const importLine = `import ${args.section} from './modules/${args.section}'`
  const spreadLine = `  ...${args.section},`

  const hasImport = lines.some(l => l.includes(`/modules/${args.section}'`))
  const hasSpread = lines.some(l => new RegExp(`^\\s*\\.\\.\\.${args.section}\\s*,?\\s*$`).test(l))

  if (hasImport && hasSpread) {
    skipped.push('additional-routes.ts: the module is already wired in')
  }
  else {
    if (!hasImport) {
      // Ставим рядом с остальными импортами модулей, чтобы не ломать порядок блока.
      const lastImport = lines.reduce((acc, l, i) => (/^import .* from '.*modules\//.test(l) ? i : acc), -1)
      const anyImport = lines.reduce((acc, l, i) => (/^import /.test(l) ? i : acc), -1)
      const at = (lastImport !== -1 ? lastImport : anyImport) + 1
      if (at === 0)
        fail('additional-routes.ts: no import found — the file structure is unexpected.')

      lines.splice(at, 0, importLine)
      changes.push(`additional-routes.ts: + ${importLine}`)
    }

    if (!hasSpread) {
      // Спред — в конец массива routes, после последнего существующего `...module,`.
      const lastSpread = lines.reduce((acc, l, i) => (/^\s*\.\.\.[A-Za-z_]\w*\s*,?\s*$/.test(l) ? i : acc), -1)
      if (lastSpread === -1)
        fail('additional-routes.ts: the module spread block was not found — the file structure is unexpected.')

      // У последнего элемента массива может не быть запятой — дописываем.
      if (!lines[lastSpread].trimEnd().endsWith(','))
        lines[lastSpread] = `${lines[lastSpread].trimEnd()},`

      lines.splice(lastSpread + 1, 0, spreadLine)
      changes.push(`additional-routes.ts: + ...${args.section} in routes`)
    }

    if (!args.dryRun)
      writeFileSync(P.additionalRoutes, lines.join('\n'))
  }
}

// ---------- 3. buildMenu.ts: пункт меню ----------

if (!existsSync(P.buildMenu)) {
  skipped.push('buildMenu.ts not found — the menu entry was not added')
}
else {
  const lines = readFileSync(P.buildMenu, 'utf8').split('\n')

  if (lines.some(l => l.includes(`to: '${routeName}'`))) {
    skipped.push(`buildMenu.ts: the entry ${routeName} already exists`)
  }
  else {
    const groupKey = args.menuGroup.startsWith('title.') ? args.menuGroup : `title.${args.menuGroup}`
    // Заголовок группы: точное совпадение или с суффиксом (в проекте встречается 'title.payouts._').
    const groupIdx = lines.findIndex(l => new RegExp(`title:\\s*'${groupKey}(\\._\\w*)?'`).test(l))

    if (groupIdx === -1) {
      const groups = lines.filter(l => /title:\s*'title\.[\w.]+',?\s*$/.test(l)).map(l => l.trim())
      skipped.push(`buildMenu.ts: group "${groupKey}" was not found — the menu entry was NOT added`)
      notes.push(`available titles in buildMenu.ts: ${[...new Set(groups)].slice(0, 30).join(' | ')}`)
    }
    else {
      const childrenIdx = lines.findIndex((l, i) => i > groupIdx && /children:\s*\[/.test(l))
      const childIndent = childrenIdx !== -1 ? lines[childrenIdx].match(/^\s*/)[0] : ''
      const closeIdx = lines.findIndex((l, i) => i > childrenIdx && l === `${childIndent}],`)

      if (childrenIdx === -1 || closeIdx === -1) {
        skipped.push(`buildMenu.ts: could not parse the children block of group "${groupKey}" — the menu entry was NOT added`)
      }
      else {
        let insertAt = closeIdx
        let placedAfter = null
        if (args.menuAfter) {
          const neighbourIdx = lines.findIndex((l, i) => i > childrenIdx && i < closeIdx && l.includes(`to: '${args.menuAfter}'`))
          if (neighbourIdx === -1) {
            notes.push(`the menu neighbour ${args.menuAfter} was not found in the group — the entry went to the end of the group`)
          }
          else {
            const entryClose = lines.findIndex((l, i) => i > neighbourIdx && /^\s*\},$/.test(l))
            if (entryClose !== -1 && entryClose < closeIdx) {
              insertAt = entryClose + 1
              placedAfter = args.menuAfter
            }
          }
        }

        const ind = `${childIndent}  `
        lines.splice(insertAt, 0, ...[
          `${ind}{`,
          `${ind}  title: 'title.${i18nPrefix}.list',`,
          `${ind}  to: '${routeName}',`,
          `${ind}  permission: PermissionType.${args.permission},`,
          `${ind}},`,
        ])
        changes.push(`buildMenu.ts: entry ${routeName} in group ${groupKey}${placedAfter ? ` (after ${placedAfter})` : ' (at the end of the group)'}`)

        if (!args.dryRun)
          writeFileSync(P.buildMenu, lines.join('\n'))
      }
    }
  }
}

// ---------- 4. en.json: title.<prefix>.list и emptyState.<prefix> ----------

if (!existsSync(P.enJson)) {
  skipped.push('en.json not found — the i18n keys were not added')
}
else {
  const lines = readFileSync(P.enJson, 'utf8').split('\n')

  // Вставка в конец неймспейса верхнего уровня, с аккуратной запятой у предыдущей строки.
  const insertIntoNamespace = (ns, block) => {
    const start = lines.findIndex(l => new RegExp(`^ {2}"${ns}":\\s*\\{`).test(l))
    if (start === -1)
      return `en.json: namespace "${ns}" not found`

    const end = lines.findIndex((l, i) => i > start && /^ {2}\},?$/.test(l))
    if (end === -1)
      return `en.json: the end of namespace "${ns}" was not found`

    const body = lines.slice(start + 1, end)
    if (body.some(l => l.trim().startsWith(`"${i18nPrefix}":`)))
      return `en.json: "${ns}.${i18nPrefix}" already exists`

    // Встаём последним ключом объекта: предыдущему нужна запятая, своей последней строке —
    // наоборот, без неё (иначе висячая запятая ломает JSON).
    const lastIdx = end - 1
    if (lines[lastIdx].trim() && !lines[lastIdx].trimEnd().endsWith(','))
      lines[lastIdx] = `${lines[lastIdx].trimEnd()},`

    const tail = [...block]
    tail[tail.length - 1] = tail[tail.length - 1].replace(/,$/, '')
    lines.splice(end, 0, ...tail)

    return null
  }

  const titleErr = insertIntoNamespace('title', [
    `    "${i18nPrefix}": {`,
    `      "list": ${JSON.stringify(args.label)}`,
    '    },',
  ])
  titleErr ? skipped.push(titleErr) : changes.push(`en.json: title.${i18nPrefix}.list = "${args.label}"`)

  const emptyErr = insertIntoNamespace('emptyState', [`    "${i18nPrefix}": ${JSON.stringify(emptyText)},`])
  emptyErr ? skipped.push(emptyErr) : changes.push(`en.json: emptyState.${i18nPrefix} = "${emptyText}"`)

  if (!args.emptyText)
    notes.push(`emptyState.${i18nPrefix} is a placeholder — confirm the exact copy against Figma at stage C.2`)

  // Последняя вставленная строка нового блока не должна оставить объект без запятой —
  // insertIntoNamespace уже проставил запятую предыдущему ключу, а свои блоки пишет с запятой.
  if (!args.dryRun)
    writeFileSync(P.enJson, lines.join('\n'))
}

// ---------- 5. модель ----------

writeFile(modelPath, `export interface I${modelName}ListItemData {
  id: string
}

export class ${modelName}ListItem {
  id: string

  constructor(data: I${modelName}ListItemData) {
    this.id = data.id
  }
}
`)

// ---------- 6. useSection.ts ----------
// pageName обязателен: без него BaseList выводит имя роута из entityName, checkExistsPage
// возвращает false и кнопки Create/Edit не появляются даже при верных правах.

writeFile(`${pagesDir}/useSection.ts`, `import type { UseListType } from 'cardona-core-service/src/@model/templates/baseList'
import { TableField } from 'cardona-core-service/src/@model/templates/tableFields'
import { FilterSearch } from 'cardona-core-service/src/@model/filter'
import { i18n } from '@/plugins/i18n'
import { ${modelName}ListItem } from '${modelAlias}'

const entityName = '${args.entityName}'
const pageName = '${pageName}'

export const useList = (): UseListType<${modelName}ListItem> => {
  const ListFilterModel = FilterSearch
  const ListItemModel = ${modelName}ListItem

  const fields = [
    new TableField({
      key: 'id',
      title: i18n.t('page.${i18nPrefix}.id'),
    }),
  ]

  return {
    entityName,
    pageName,
    fields,
    ListFilterModel,
    ListItemModel,
  }
}
`)

// ---------- 7. list/index.vue ----------
// permissionKey задаём явно: фолбэк строит ключ из entityName через convertCamelCase
// и почти никогда не совпадает с реальным.

writeFile(`${pagesDir}/list/index.vue`, `<script setup lang="ts">
import { BaseListConfig } from 'cardona-core-service/src/@model/templates/baseList'
import { useI18n } from 'vue-i18n'
import { useList } from '../useSection'
import { PermissionType } from '@permissions'

defineOptions({
  name: '${routeName}',
})

const { t } = useI18n()

const config = new BaseListConfig({
  emptyText: t('emptyState.${i18nPrefix}'),
  withCreateBtn: false,
  withSearch: false,
  withSettings: true,
  permissionKey: PermissionType.${args.permission},
  sidebar: false,
})
</script>

<template>
  <BaseList
    :use-list="useList"
    :config="config"
  />
</template>
`)

// ---------- вывод ----------

console.log(args.dryRun ? '[section-scaffold] --dry-run, files untouched. What would have been done:' : '[section-scaffold] done:')
created.forEach(f => console.log(`  + created  ${f}`))
changes.forEach(c => console.log(`  ~ ${c}`))
skipped.forEach(s => console.log(`  • ${s}`))
notes.forEach(n => console.log(`  ! ${n}`))

console.log(`
  Route: ${routeName}  →  ${url}
  Menu:  title.${i18nPrefix}.list = "${args.label}"
  API:   entityName '${args.entityName}', pageName '${pageName}'

  Next (stage C.2, a human is required):
    1. yarn dev → open ${url} → DevTools → Network → copy the full JSON of the list response
    2. hand the JSON + Figma to the section-list agent — it will build the model, columns and filters`)
