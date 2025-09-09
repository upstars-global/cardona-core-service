<script setup lang="ts">
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as recast from 'recast'
import { ref } from 'vue'
import { VColors } from '../../@model/vuetify'

defineOptions({
  name: 'Constructor',
})

const code = ref(`export class MetaForm {
  readonly id?: string
  readonly title: TextBaseField
  readonly path: TextBaseField
  readonly keywords: TextareaBaseField
  readonly description: TextareaBaseField
  readonly canonicalUrl: TextBaseField

  constructor(data: Partial<MetaData>) {
    this.id = data?.id
    this.title = new TextBaseField({
      key: 'title',
      value: data?.title,
      label: i18n.t('page.meta.name'),
      validationRules: { required: true }
    })
    this.path = new TextBaseField({
      key: 'path',
      value: data?.path || '/',
      label: i18n.t('page.meta.path'),
    })
    this.description = new TextareaBaseField({
      key: 'description',
      value: data?.description,
      label: i18n.t('page.meta.description'),
    })
    this.keywords = new TextareaBaseField({
      key: 'keywords',
      value: data?.keywords,
      label: i18n.t('page.meta.keywords'),
      placeholder: i18n.t('page.meta.keywordsPlaceholder'),
    })
    this.canonicalUrl = new TextBaseField({
      key: 'canonicalUrl',
      value: data?.canonicalUrl || getSelectedProjectUrl(),
      label: i18n.t('page.meta.canonicalUrl'),
    })
  }
}`)

const parsedFields = ref<any[]>([])
const className = ref('MetaForm')
const output = ref('')

// доступні типи полів
const FIELD_CLASSES = ['TextBaseField', 'TextareaBaseField', 'SelectBaseField']

function parseCode() {
  parsedFields.value = []

  const ast = recast.parse(code.value, {
    parser: {
      parse: (source: string) =>
        parser.parse(source, {
          sourceType: 'module',
          plugins: ['typescript', 'classProperties'],
        }),
    },
  })

  traverse(ast, {
    AssignmentExpression(path) {
      if (
        t.isMemberExpression(path.node.left)
        && t.isThisExpression(path.node.left.object)
        && t.isIdentifier(path.node.left.property)
      ) {
        const fieldName = path.node.left.property.name

        if (
          t.isNewExpression(path.node.right)
          && t.isIdentifier(path.node.right.callee)
          && FIELD_CLASSES.includes(path.node.right.callee.name)
        ) {
          const fieldType = path.node.right.callee.name
          const argsNode = path.node.right.arguments[0]

          if (t.isObjectExpression(argsNode)) {
            const args: Record<string, string> = {}

            argsNode.properties.forEach(prop => {
              if (t.isObjectProperty(prop) && t.isIdentifier(prop.key))
                args[prop.key.name] = recast.print(prop.value).code
            })

            parsedFields.value.push({
              name: fieldName,
              className: fieldType,
              args,
            })
          }
        }
      }
    },
  })
}

function updateCode() {
  const constructorLines = parsedFields.value.map(field => {
    const args = Object.entries(field.args)
      .map(([key, value]) => `      ${key}: ${value},`)
      .join('\n')

    return `    this.${field.name} = new ${field.className}({\n${args}\n    })`
  })

  const result = `
export class ${className.value} {
  readonly id?: string
${parsedFields.value.map(f => `  readonly ${f.name}: ${f.className}`).join('\n')}

  constructor(data: Partial<MetaData>) {
    this.id = data?.id
${constructorLines.join('\n')}
  }
}
  `.trim()

  output.value = result
}
</script>

<template>
  <div>
    <VToolbar
      title="Constructor"
      :color="VColors.Primary"
    />
    <div class="pa-4">
      <h2>Редактор класу</h2>
      <VTextarea
        v-model="code"
        rows="16"
        cols="80"
        class="w-100 mb-4"
      />
      <VBtn
        class="mr-2"
        @click="parseCode"
      >
        Розпарсити
      </VBtn>
      <div v-if="parsedFields.length">
        <h3 class="mt-4">
          Поля
        </h3>
        <div
          v-for="(field, i) in parsedFields"
          :key="i"
          class="mb-4 pa-2 border rounded"
        >
          <div class="d-flex align-center">
            <div>
              <VChip
                label
                :color="VColors.Info"
                class="mr-2"
              >
                {{ field.name }}
              </VChip>
            </div>

            <div class="d-flex align-center mb-2">
              <VSelect
                v-model="field.className"
                :items="FIELD_CLASSES"
              />
            </div>
          </div>

          <div
            v-for="(value, key) in field.args"
            :key="key"
            class="d-flex align-center mb-2"
          >
            <div class="d-flex">
              <div>
                <VChip
                  label
                  :color="VColors.Info"
                  class="mr-2"
                >
                  {{ key }}
                </VChip>
              </div>
              <div>{{ field.args[key] }}</div>
            </div>
          </div>
        </div>

        <VBtn
          class="mt-2"
          @click="updateCode"
        >
          Згенерувати код
        </VBtn>

        <h3 class="mt-4">
          Результат
        </h3>
        <pre class="code-output">{{ output }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-output {
  background-color: #f6f8fa;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
