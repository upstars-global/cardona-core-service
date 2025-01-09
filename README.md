# vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates.

However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can run `Volar: Switch TS Plugin on/off` from VS Code command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
## [Инструкция по написанию unit tests](./tests/README.md)


### Переход на новую версию vuexy
1. в новый проект vuexy добавить в [package.json](package.json)
```
    "vuex": "^4.0.2",
    "uuid": "^8.3.2",
    "vue-cleave-component": "^3.0.2",
    "vue-draggable-next": "^2.2.1",
    "vue-froala-wysiwyg": "^4.1.2",
    "countries-list": "^2.6.1",
    "axios": "1.4.0",
    "axios-jwt": "^2.0.1",
    "axios-mock-adapter": "1.21.4",
    "vue-select": "^4.0.0-beta.6",
    "decimal.js": "^10.4.3",
    "moment": "^2.29.4",
    "vee-validate": "^4.11.8",
    "@vee-validate/i18n": "^4.11.8",
    "@vee-validate/rules": "^4.11.8",
    "lodash": "^4.17.21"
```

2. в [index.html](index.html) добавить 

```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/codemirror.min.css">

<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/codemirror.min.js" integrity="sha512-/8pAp30QGvOa8tNBv7WmWiPFgYGOg2JdVtqI8vK+xZsqWHnNd939v9s+zJHXZcJe5wPD44D66zz+CLTD3KacYA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/mode/xml/xml.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/codemirror@5.65.5/mode/javascript/javascript.js"></script>
```

3. перенести папки/файлы: 
```
@model 
@fake-db
pages/demo
pages/permission
services
store
use
utils/date.ts
helpers 
extensions
directives
configs
components/CTable
components/BaseModal
components/FiltersBlock
components/templates
components/CodeViewEditor.vue
```

4. добавить текст переводов
5. добавить логику в гварды и добавить генератор кастомных путей sectionRouterGenerator
