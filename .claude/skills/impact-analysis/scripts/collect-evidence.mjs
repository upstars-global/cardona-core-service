#!/usr/bin/env node
// Impact Analysis evidence collector (v2).
//
// Does the deterministic work so the AI spends tokens on judgement and Ukrainian prose,
// not on reconstructing algorithms from grep output. Compared to v1 this version RESOLVES
// facts instead of dumping raw matches:
//
//   * route name + URL + i18n title key, by reimplementing `sectionRouterGenerator`
//     (src/helper/router.ts) over the parsed entries of additional-routes.ts, plus the
//     hand-written modules in src/plugins/2.router/modules/;
//   * menu path ("Gamification → VIP Seasons"), by parsing buildMenu.ts into a tree and
//     resolving both the leaf and its ancestors against en.json;
//   * a tiered diff (full body for small files, hunk headers + changed symbols for large
//     ones) instead of one raw 60KB blob;
//   * cardona-core-service changes already classified by blast radius.
//
// Anything it cannot resolve comes back as `null` plus a `reason`, and the AI falls back to
// references/cardona-map.md. Silent gaps are worse than loud ones, so every cap and every
// failure is reported in the bundle.
//
// Usage:
//   node collect-evidence.mjs                 # auto: whole current branch (committed vs master + uncommitted)
//   node collect-evidence.mjs HEAD~1 HEAD     # explicit git range (two args)
//   node collect-evidence.mjs master...HEAD   # explicit range (one arg)

import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO = process.cwd()
const CORE_CLONES = ['../cardona-core-service-github', '../cardona-core-service']

const DIFF_TOTAL_CAP = 25000 // символов на весь дифф
const DIFF_FILE_FULL = 4000 // до этого размера файл входит целиком

const sh = (cmd, opts = {}) => {
  try {
    return execSync(cmd, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024, ...opts }).trim()
  } catch {
    return ''
  }
}
const lines = (s) => (s ? s.split('\n').filter(Boolean) : [])
const readIf = (rel) => (existsSync(resolve(REPO, rel)) ? readFileSync(resolve(REPO, rel), 'utf8') : '')

// Панели нумеруют плагин роутера по-разному (cardona — 2.router, compostela — 1.router),
// поэтому директорию ищем, а не хардкодим.
const ROUTER_DIR = ['src/plugins/2.router', 'src/plugins/1.router'].find((d) => existsSync(resolve(REPO, d))) || 'src/plugins/2.router'

const ADDITIONAL_ROUTES = `${ROUTER_DIR}/additional-routes.ts`
const ROUTER_MODULES = `${ROUTER_DIR}/modules`
const BUILD_MENU = 'src/navigation/vertical/apps-and-pages/buildMenu.ts'
const BUILD_ADMIN_MENU = 'src/navigation/vertical/apps-and-pages/buildAdminMenu.ts'
const EN_JSON = 'src/plugins/i18n/locales/en.json'
const PRODUCT_CONFIG = 'src/configs/productConfig.ts'

// ---------- Step 1: change set ----------

function resolveChangeSet() {
  const argv = process.argv.slice(2)
  if (argv.length) {
    const range = argv.length === 2 ? `${argv[0]} ${argv[1]}` : argv[0]
    return { source: 'explicit', range, files: lines(sh(`git diff --name-only ${range}`)), diffCmd: `git diff ${range}` }
  }
  // Whole current branch: everything it contains that master doesn't — committed diff
  // vs the fork point PLUS uncommitted work (staged, unstaged, untracked). Fallback: last commit.
  const branch = sh('git rev-parse --abbrev-ref HEAD')
  const base = sh('git merge-base master HEAD') || 'master'
  if (branch && branch !== 'master') {
    const tracked = lines(sh(`git diff --name-only ${base}`))
    const untracked = lines(sh('git ls-files --others --exclude-standard'))
    const files = [...new Set([...tracked, ...untracked])].filter(Boolean)
    if (files.length) return { source: 'branch (incl. uncommitted)', range: `${base}..worktree`, files, diffCmd: `git diff ${base}` }
  }
  return { source: 'last-commit', range: 'HEAD~1 HEAD', files: lines(sh('git diff --name-only HEAD~1 HEAD')), diffCmd: 'git diff HEAD~1 HEAD' }
}

// ---------- Step 2: classification ----------

const GENERATED = ['components.d.ts', 'typed-router.d.ts', 'auto-imports.d.ts']
const isGenerated = (f) => GENERATED.includes(f) || f.startsWith('dist/') || f.startsWith('coverage/')
const PROJECT_WIDE = [
  'src/configs/productConfig.ts',
  'src/configs/permissions.ts',
  'src/plugins/2.router/guards.ts',
  'src/plugins/i18n/locales/en.json',
]

function classify(f) {
  if (isGenerated(f)) return 'generated'
  if (f.startsWith('cardona-core-service/')) return 'core-dependency'
  if (PROJECT_WIDE.includes(f) || /^src\/navigation\/.*build(Menu|AdminMenu)\.ts$/.test(f)) return 'project-wide'
  if (f.startsWith('src/pages/')) return 'page'
  if (/^src\/(components|@model|stores|composables)\//.test(f)) return 'shared'
  if (/^(vite\.config\.mts|tsconfig.*\.json|\.eslintrc.*|\.prettierrc|stylelint\.config\.js|vitest\.setup\.ts|jest\.config\.js|themeConfig\.ts)$/.test(f) || f.endsWith('.d.ts')) return 'build'
  if (f === 'Dockerfile' || f.startsWith('nginx/') || f.startsWith('charts/') || f === '.gitlab-ci.yml' || f.startsWith('gitlab-ci/')) return 'infra'
  if (f === '.env' || f === 'passport.yaml' || f.startsWith('public/') || f === 'index.html' || f.startsWith('server/')) return 'runtime'
  if (f === 'package.json' || f === 'yarn.lock') return 'deps'
  if (f.endsWith('.spec.ts') || f.startsWith('tests/') || f.endsWith('.md') || f.startsWith('.claude/') || f === '.gitignore') return 'docs'
  return 'other'
}

// ---------- route resolution (port of src/helper/router.ts) ----------

// URL строит lodash.kebabCase — берём именно его, чтобы совпадать с приложением
// символ в символ. Локальная реализация — только страховка, если lodash не разрешился
// (например, скрипт запущен вне проекта).
const localKebabCase = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())
    .join('-')

let kebabCase = localKebabCase
let kebabSource = 'local-fallback'
for (const specifier of ['lodash', resolve(REPO, 'node_modules/lodash/lodash.js')]) {
  try {
    const mod = await import(specifier)
    const fn = mod.kebabCase ?? mod.default?.kebabCase
    if (typeof fn === 'function') {
      kebabCase = fn
      kebabSource = specifier === 'lodash' ? 'lodash' : 'lodash (project node_modules)'
      break
    }
  } catch {
    // пробуем следующий вариант
  }
}

const uniq = (arr) => [...new Set(arr)]
const upper1 = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const convertCamelCase = (s, sep) => (s ? s[0].toLowerCase() + s.slice(1).replace(/[A-Z]/g, (l) => `${sep}${l.toLowerCase()}`) : s)
const getPrefixNameKey = (prefixName, name) =>
  prefixName ? prefixName.charAt(0).toLowerCase() + prefixName.slice(1) + upper1(name) : name

// Записи sectionRouterGenerator из additional-routes.ts. Формат в файле — однострочные
// объектные литералы, поэтому построчный разбор надёжнее и дешевле полноценного парсера.
function parseGeneratorConfigs() {
  const src = readIf(ADDITIONAL_ROUTES)
  if (!src) return []

  const configs = []
  for (const line of src.split('\n')) {
    const t = line.trim()
    if (!t.startsWith('{') || !/name:\s*'/.test(t)) continue

    const str = (key) => (t.match(new RegExp(`${key}:\\s*'([^']+)'`)) || [])[1]
    const bool = (key) => {
      const m = t.match(new RegExp(`${key}:\\s*(true|false)`))
      return m ? m[1] === 'true' : undefined
    }
    const cfg = {
      name: str('name'),
      sectionName: str('sectionName'),
      prefixName: str('prefixName'),
      permission: (t.match(/permission:\s*(PermissionType\.\w+)/) || [])[1],
      isProject: bool('isProject'),
      isSingleRoute: bool('isSingleRoute'),
      withCard: bool('withCard'),
      isConvertName: bool('isConvertName'),
      withoutSectionNameInUrl: bool('withoutSectionNameInUrl'),
      isPermissionGroup: bool('isPermissionGroup'),
    }
    if (cfg.name) configs.push(cfg)
  }

  return configs
}

const permissionPrefix = (readIf(PRODUCT_CONFIG).match(/permissionPrefix\s*=\s*'([^']*)'/) || [])[1] || ''

function generatedRoutes() {
  const out = []
  for (const cfg of parseGeneratorConfigs()) {
    let importSTR = cfg.isConvertName ? convertCamelCase(cfg.name, '/') : cfg.name
    if (cfg.sectionName) importSTR = `${cfg.sectionName}/${importSTR}`

    const generatedUrl = cfg.sectionName && cfg.withoutSectionNameInUrl ? importSTR.replace(`/${cfg.sectionName}`, '') : importSTR
    const baseUrl = uniq(generatedUrl.split('/')).map((p) => kebabCase(p)).join('/')
    const entityUrl = cfg.isProject === false ? `/${baseUrl}` : `/:project/${baseUrl}`

    const entityName = upper1(cfg.name)
    const prefixName = cfg.prefixName || ''
    const titleBase = getPrefixNameKey(prefixName, cfg.name)
    const permission = cfg.permission || `${permissionPrefix}-${convertCamelCase(cfg.name, '-')}`

    const add = (suffix, path, titleKey, componentSuffix) =>
      out.push({
        routeName: `${prefixName}${entityName}${suffix}`,
        url: path,
        i18nTitleKey: `title.${titleKey}`,
        component: `src/pages/${importSTR}/${componentSuffix}`,
        permission,
        origin: 'generator',
      })

    if (cfg.isSingleRoute) {
      add('', entityUrl, titleBase, 'index.vue')
      continue
    }
    add('List', entityUrl, `${titleBase}.list`, 'list/index.vue')
    add('Create', `${entityUrl}/create/:type?/:id?`, `${titleBase}.create`, 'create/index.vue')
    add('Update', `${entityUrl}/update/:id`, `${titleBase}.edit`, 'update/index.vue')
    if (cfg.withCard) add('Card', `${entityUrl}/card/:id`, `${titleBase}.card`, 'card/index.vue')
  }

  return out
}

// Ближайший объемлющий `{ … }` для позиции в исходнике — через сопоставление скобок.
// Кавычки пропускаем, чтобы скобка внутри строки не сбивала глубину.
function enclosingBlock(src, index) {
  const stack = []
  let best = null
  let quote = null

  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quote) {
      if (c === '\\') i++
      else if (c === quote) quote = null
      continue
    }
    if (c === '\'' || c === '"' || c === '`') {
      quote = c
      continue
    }
    if (c === '{') stack.push(i)
    else if (c === '}') {
      const start = stack.pop()
      if (start !== undefined && start < index && i > index && (best === null || start > best[0])) best = [start, i]
    }
  }

  return best ? src.slice(best[0], best[1] + 1) : null
}

// Рукописные модули: путь/имя могут быть вынесены в локальные const, поэтому сначала
// собираем их значения, потом резолвим ссылки и shorthand-свойства.
function moduleRoutes() {
  const dir = resolve(REPO, ROUTER_MODULES)
  if (!existsSync(dir)) return []

  const out = []
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
    const src = readFileSync(resolve(dir, file), 'utf8')
    const consts = new Map()
    for (const m of src.matchAll(/const\s+(\w+)\s*=\s*'([^']*)'/g)) consts.set(m[1], m[2])

    const deref = (raw) => {
      if (raw === undefined) return undefined
      const quoted = raw.match(/^['`]([^'`]*)['`]$/)
      if (quoted) return quoted[1]
      return consts.get(raw.trim())
    }

    // Роут — объект, внутри которого есть component: () => import('@/pages/...').
    // Вложенность произвольная (meta.breadcrumb[]), поэтому границы объекта берём
    // сопоставлением скобок, а не регуляркой.
    for (const hit of src.matchAll(/component:\s*\(\)\s*=>\s*import\(\s*[`'"]([^`'"]+)[`'"]/g)) {
      // Путь часто собирают шаблонной строкой: import(`@/pages${path}/list/index.vue`).
      const comp = hit[1].replace(/\$\{(\w+)\}/g, (whole, name) => consts.get(name) ?? whole)
      const body = enclosingBlock(src, hit.index)
      if (!body) continue

      // breadcrumb содержит свои title: — вырезаем, чтобы не перепутать с meta.title.
      const flat = body.replace(/breadcrumb:\s*\[[\s\S]*?\n\s*\],?/g, '')

      const rawPath = (flat.match(/(?:^|[\s,])path:\s*([^,\n]+)/) || [])[1]
      const rawName = (flat.match(/(?:^|[\s,])name:\s*([^,\n]+)/) || [])[1]
      const path = deref(rawPath) ?? (/(?:^|[\s,])path\s*,/.test(flat) ? consts.get('path') : undefined)
      const name = deref(rawName) ?? (/(?:^|[\s,])name\s*,/.test(flat) ? consts.get('name') : undefined)
      const titleKey = (flat.match(/title:\s*[`']([^`']+)[`']/) || [])[1]

      out.push({
        routeName: name || null,
        url: path || null,
        i18nTitleKey: titleKey ? `title.${titleKey}` : null,
        component: comp.replace(/^@\//, 'src/'),
        permission: (flat.match(/permission:\s*(PermissionType\.\w+)/) || [])[1] || null,
        origin: `module:${ROUTER_MODULES}/${file}`,
      })
    }
  }

  return out
}

const ROUTES = [...generatedRoutes(), ...moduleRoutes()]

// ---------- i18n ----------

// В панелях en.json иногда содержит висячую запятую (строгий JSON её не допускает).
// Терять из-за этого все подписи меню не стоит — вторая попытка после мягкой чистки.
let EN = {}
let enJsonNote = null
const rawEn = readIf(EN_JSON) || '{}'
try {
  EN = JSON.parse(rawEn)
} catch {
  try {
    EN = JSON.parse(rawEn.replace(/,(\s*[}\]])/g, '$1'))
    enJsonNote = `${EN_JSON} — невалидный строгий JSON (висячая запятая); разобран после мягкой чистки, файл стоит починить`
  } catch (e) {
    EN = {}
    enJsonNote = `${EN_JSON} не разобран (${e.message}) — подписи меню будут показаны i18n-ключами`
  }
}
const i18n = (key) => {
  if (!key) return null
  const v = key.split('.').reduce((acc, k) => (acc && typeof acc === 'object' ? acc[k] : undefined), EN)
  return typeof v === 'string' ? v : null
}

// ---------- menu ----------

// buildMenu.ts — вложенные литералы, отформатированные prettier. Разбираем по отступам:
// заголовок группы всегда левее свойств своих детей, поэтому стек «отступ → заголовок»
// даёт корректных предков для каждого листа с `to:`.
function parseMenu(rel) {
  const src = readIf(rel)
  if (!src) return []

  const srcLines = src.split('\n')
  const titleByIndent = new Map()
  const leaves = []

  srcLines.forEach((line, idx) => {
    const indent = line.match(/^\s*/)[0].length

    // Каждый вызов clearMenu( — отдельное меню со своим уровнем отступов
    // (generalMenu, managingMenu, …). Без сброса заголовок группы из предыдущего
    // блока остаётся «фантомным предком» для всех листьев следующего.
    if (line.includes('clearMenu(')) titleByIndent.clear()

    const titleMatch = line.match(/^\s*title:\s*'([^']+)'/)
    if (titleMatch) {
      for (const k of [...titleByIndent.keys()]) if (k > indent) titleByIndent.delete(k)
      titleByIndent.set(indent, titleMatch[1])
    }

    const toMatch = line.match(/^\s*to:\s*'([^']+)'/)
    if (!toMatch) return

    // title может стоять и после to: внутри того же объекта — досматриваем пару строк.
    let leafKey = titleByIndent.get(indent)
    if (!leafKey) {
      for (let i = idx + 1; i < Math.min(idx + 4, srcLines.length); i++) {
        const m = srcLines[i].match(/^\s*title:\s*'([^']+)'/)
        if (m && srcLines[i].match(/^\s*/)[0].length === indent) {
          leafKey = m[1]
          break
        }
      }
    }

    const ancestors = [...titleByIndent.entries()]
      .filter(([k]) => k < indent)
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => v)

    leaves.push({ routeName: toMatch[1], titleKey: leafKey || null, groupKeys: ancestors, menu: rel === BUILD_MENU ? 'main' : 'admin' })
  })

  return leaves
}

const MENU = [...parseMenu(BUILD_MENU), ...parseMenu(BUILD_ADMIN_MENU)]

function menuPathFor(routeName) {
  const leaf = MENU.find((l) => l.routeName === routeName)
  if (!leaf) return null

  const labels = [...leaf.groupKeys, leaf.titleKey].filter(Boolean).map((k) => i18n(k) || k)

  return { path: labels.join(' → '), menu: leaf.menu, keys: [...leaf.groupKeys, leaf.titleKey].filter(Boolean) }
}

// ---------- evidence: pages ----------

// Самое длинное совпадение по префиксу компонента: src/pages/a/b/list/index.vue должен
// выиграть у src/pages/a/b/index.vue, когда изменён файл внутри list/.
// Все роуты секции, которой принадлежит файл. Поднимаемся от его директории вверх,
// пока не найдём уровень, под которым живут роуты: так `.../vipSeasons/_components/Foo.vue`
// и `.../vipSeasons/list/index.vue` одинаково приводят к семейству VipSeasons*.
function routesForPage(file) {
  const under = (child, parent) => child === parent || child.startsWith(`${parent}/`)
  const exact = ROUTES.filter((r) => r.component === file)
  if (exact.length) return exact

  let dir = file.replace(/\/[^/]+$/, '')
  while (dir.startsWith('src/pages') && dir !== 'src/pages') {
    const hits = ROUTES.filter((r) => under(r.component, dir))
    if (hits.length) return hits
    dir = dir.replace(/\/[^/]+$/, '')
  }

  return []
}

function routeForPage(file) {
  const candidates = routesForPage(file)
  if (!candidates.length) return null

  // Приоритет: разобранное имя (в модулях встречаются фабрики с вычисляемым name),
  // затем List (это то, куда QA заходит первым), затем длина пути компонента.
  return candidates.sort(
    (a, b) =>
      Number(Boolean(b.routeName)) - Number(Boolean(a.routeName)) ||
      Number(/List$/.test(b.routeName || '')) - Number(/List$/.test(a.routeName || '')) ||
      b.component.length - a.component.length,
  )[0]
}

// Изменённые страницы группируем по разделу: один раздел — одна запись в отчёте,
// со списком его файлов и всем семейством роутов (list/create/update/card).
function pageEvidence(files) {
  const sections = new Map()
  const unresolved = []

  for (const f of files) {
    const route = routeForPage(f)
    if (!route) {
      unresolved.push({
        file: f,
        reason: 'роут не найден ни среди записей sectionRouterGenerator, ни в src/plugins/2.router/modules — см. references/cardona-map.md §1–§2',
      })
      continue
    }

    const family = routesForPage(f)
    const key = route.routeName || route.component
    if (!sections.has(key)) {
      sections.set(key, {
        routeName: route.routeName,
        url: route.url,
        i18nTitleKey: route.i18nTitleKey,
        title: i18n(route.i18nTitleKey),
        permission: route.permission,
        origin: route.origin,
        menuPath: menuPathFor(route.routeName)?.path || null,
        family: family.map((r) => ({ routeName: r.routeName, url: r.url, menuPath: menuPathFor(r.routeName)?.path || null })),
        files: [],
        ...(route.routeName ? {} : { reason: `имя роута вычисляется в ${route.origin} — взять вручную из модуля` }),
      })
    }
    sections.get(key).files.push(f)
  }

  return { sections: [...sections.values()], unresolved }
}

// ---------- evidence: shared code ----------

const grepConsumers = (pattern) => lines(sh(`grep -rlE ${JSON.stringify(pattern)} src`)).slice(0, 60)
const pascal = upper1

// foo/index.ts импортируют как '…/foo', а не '…/foo/index' — ищем оба написания,
// иначе потребители index-файлов (а это большинство моделей и сторов) теряются.
const pathForms = (rel) => [...new Set([rel, rel.replace(/\/index$/, '')])]

// Потребители → страницы: каждый потребитель прогоняется через тот же резолвер роутов,
// чтобы в отчёт попали пункты меню и URL, а не пути файлов.
function consumersToPages(files) {
  const out = []
  for (const f of files) {
    if (!f.startsWith('src/pages/')) {
      out.push({ file: f, page: null })
      continue
    }
    const route = routeForPage(f)
    out.push({
      file: f,
      page: route ? { routeName: route.routeName, url: route.url, menuPath: menuPathFor(route.routeName)?.path || null } : null,
      ...(route && !route.routeName
        ? { reason: `имя роута вычисляется в ${route.origin} — открыть модуль и взять его вручную` }
        : {}),
    })
  }

  // Дедуп по разделу: одна секция — одна строка в отчёте.
  const seen = new Set()

  return out.filter((c) => {
    const key = c.page?.routeName || c.file
    if (seen.has(key)) return false
    seen.add(key)

    return true
  })
}

function sharedEvidence(f) {
  if (f.startsWith('src/components/')) {
    const rel = f.replace(/^src\/components\//, '').replace(/\.vue$/, '')
    const segs = rel.split('/').filter((s) => s !== 'index')
    const pascalName = segs.map(pascal).join('')
    const kebab = pascalName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    const consumers = grepConsumers(`<${pascalName}[\\s/>]|<${kebab}[\\s/>]|components/${rel}`)

    return { file: f, kind: 'component', tagName: pascalName, consumerCount: consumers.length, consumerPages: consumersToPages(consumers) }
  }
  if (f.startsWith('src/@model/')) {
    const rel = f.replace(/^src\/@model\//, '').replace(/\.ts$/, '')
    const consumers = grepConsumers(pathForms(rel).flatMap((r) => [`@model/${r}`, `@/@model/${r}`]).join('|'))

    return { file: f, kind: 'model', consumerCount: consumers.length, consumerPages: consumersToPages(consumers) }
  }
  if (f.startsWith('src/stores/')) {
    const rel = f.replace(/^src\/stores\//, '').replace(/\.ts$/, '')
    const useName = (readIf(f).match(/export const (use\w+Store)/) || [])[1] || ''
    const consumers = grepConsumers([...pathForms(rel).map((r) => `stores/${r}`), useName].filter(Boolean).join('|'))

    return { file: f, kind: 'store', useName, consumerCount: consumers.length, consumerPages: consumersToPages(consumers) }
  }
  const rel = f.replace(/^src\/composables\//, '').replace(/\.ts$/, '')
  const useName = (readIf(f).match(/export (?:const|function) (use\w+)/) || [])[1] || ''
  const consumers = grepConsumers([...pathForms(rel), useName].filter(Boolean).join('|'))

  return { file: f, kind: 'composable', useName, consumerCount: consumers.length, consumerPages: consumersToPages(consumers) }
}

// ---------- evidence: cardona-core-service ----------

// Каждый изменённый файл ядра — либо точечный (компонент/composable, ищем потребителей),
// либо project-wide (BaseList/BaseSection/ApiService/права/layouts → регрессионный прогон).
function classifyCoreFile(f) {
  if (/BaseList|BaseSection|baseStoreCore|ApiService|services\/api|@model\/permission|permissions|@layouts|initCore|templates\/tableFields|templates\/baseList|templates\/baseSection/.test(f))
    return 'project-wide'
  if (/(components|@core\/components)\//.test(f)) return 'component'
  if (/(composable|composables|helpers|utils)\//.test(f)) return 'util'
  if (/stores\//.test(f)) return 'store'

  return 'other'
}

function coreDependencyEvidence(files) {
  const versionLine = lines(sh('grep -n "cardona-core-service" package.json'))[0] || ''
  const pkgDiff = sh('git diff -- package.json') || sh('git diff HEAD~1 HEAD -- package.json')
  const tags = [...pkgDiff.matchAll(/cardona-core-service#([\w.-]+)/g)].map((m) => m[1])
  const oldTag = tags.length > 1 ? tags[0] : null
  const newTag = tags.length > 1 ? tags[tags.length - 1] : null
  const clone = CORE_CLONES.find((c) => existsSync(resolve(REPO, c, '.git')))

  let changedCoreFiles = []
  let localEdits = []
  if (clone) {
    if (oldTag && newTag) {
      sh(`git -C ${clone} fetch --tags --quiet`)
      changedCoreFiles = lines(sh(`git -C ${clone} diff --name-only ${oldTag} ${newTag}`)).slice(0, 100)
    }
    localEdits = lines(sh(`git -C ${clone} status --porcelain`)).slice(0, 100)
  }

  const inRepoCore = files.filter((f) => f.startsWith('cardona-core-service/'))
  const allCore = [...new Set([...changedCoreFiles, ...inRepoCore.map((f) => f.replace(/^cardona-core-service\//, ''))])]

  // Для точечных изменений ядра сразу ищем, кто их использует в приложении.
  const classified = allCore.map((f) => {
    const kind = classifyCoreFile(f)
    let consumerPages = null
    if (kind === 'component') {
      const base = f.replace(/\/index\.vue$/, '').split('/').pop()
      if (base) consumerPages = consumersToPages(grepConsumers(`<${base}[\\s/>]|${base}`))
    }

    return { file: f, kind, consumerPages }
  })

  return {
    currentVersionLine: versionLine,
    versionChanged: Boolean(oldTag && newTag),
    oldTag,
    newTag,
    clone: clone || null,
    localEdits,
    changedCoreFiles: classified,
    projectWide: classified.some((c) => c.kind === 'project-wide'),
  }
}

// ---------- tiered diff ----------

// Полный дифф режется по двум порогам, и КАЖДОЕ урезание попадает в bundle.truncated —
// молчаливое обрезание читается как «покрыто всё», хотя это не так.
function tieredDiff(diffCmd, files) {
  const parts = []
  const truncated = []
  let budget = DIFF_TOTAL_CAP

  for (const f of files) {
    const body = sh(`${diffCmd} -U1 -- ${JSON.stringify(f)}`)
    if (!body) continue

    if (body.length <= DIFF_FILE_FULL && body.length <= budget) {
      parts.push(body)
      budget -= body.length
      continue
    }

    // Крупный файл: заголовки ханков + изменённые символы верхнего уровня.
    const hunks = body.split('\n').filter((l) => l.startsWith('@@'))
    const symbols = [
      ...new Set(
        body
          .split('\n')
          .filter((l) => /^[+-]/.test(l) && !/^[+-][+-]/.test(l))
          .map((l) => (l.match(/(?:function|const|let|class|interface|enum|type)\s+(\w+)/) || l.match(/^\s*[+-]\s*(\w+)\s*[(:]/) || [])[1])
          .filter(Boolean),
      ),
    ].slice(0, 25)

    const summary = [
      `--- ${f} (сокращён: ${body.length} симв.)`,
      ...hunks.slice(0, 20),
      symbols.length ? `изменённые символы: ${symbols.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    if (summary.length <= budget) {
      parts.push(summary)
      budget -= summary.length
      truncated.push({ file: f, fullChars: body.length, kept: 'ханки + символы' })
    } else {
      truncated.push({ file: f, fullChars: body.length, kept: 'ничего — бюджет диффа исчерпан' })
    }
  }

  return { diff: parts.join('\n'), truncated }
}

// ---------- assemble ----------

const cs = resolveChangeSet()
const appFiles = cs.files.filter((f) => classify(f) !== 'generated')
const buckets = {}
for (const f of cs.files) (buckets[classify(f)] ||= []).push(f)

const { diff, truncated } = tieredDiff(cs.diffCmd, appFiles)
const branch = sh('git rev-parse --abbrev-ref HEAD')
const pages = pageEvidence(buckets.page || [])

const bundle = {
  changeSet: { source: cs.source, range: cs.range, fileCount: cs.files.length, diffCmd: cs.diffCmd },
  branch,
  ticketKey: (branch.match(/^(BAC-\d+)/i) || [])[1]?.toUpperCase() || null,
  buckets,
  pages: pages.sections,
  pagesUnresolved: pages.unresolved,
  shared: (buckets.shared || []).map(sharedEvidence),
  coreDependency: buckets['core-dependency'] || buckets.deps ? coreDependencyEvidence(cs.files) : null,
  projectWide: (buckets['project-wide'] || []).map((f) => ({
    file: f,
    note:
      f === 'src/plugins/i18n/locales/en.json'
        ? 'изменены ключи i18n — сверить, какие страницы их используют'
        : 'регрессионный прогон ключевых разделов (роутинг / меню / права / конфиг продукта)',
  })),
  diff,
  truncated,
  resolver: {
    routesIndexed: ROUTES.length,
    menuLeavesIndexed: MENU.length,
    i18nLoaded: Object.keys(EN).length > 0,
    kebabCase: kebabSource,
    unresolvedPages: pages.unresolved.length,
  },
  notes: [
    ...(enJsonNote ? [enJsonNote] : []),
    'pages[] — по одной записи на РАЗДЕЛ: готовые routeName / url / menuPath / title + files (какие файлы раздела изменены) + family (соседние роуты list/create/update). Брать как есть, выводить заново не нужно.',
    'pagesUnresolved[] — только эти файлы требуют ручного разбора; тогда и только тогда идти в references/cardona-map.md §1–§2.',
    'shared[].consumerPages — потребители, уже сопоставленные со страницами (routeName + url + menuPath); file без page значит «не страница».',
    'truncated — файлы, чей дифф урезан. Если нужен полный, взять его командой git самому.',
    'consumer-списки ограничены 60 файлами; при подозрении на обрезку расширить grep вручную.',
  ],
}

// Компактный JSON намеренно: bundle читает модель, отступы стоили бы ~25% лишних токенов.
process.stdout.write(JSON.stringify(bundle))
