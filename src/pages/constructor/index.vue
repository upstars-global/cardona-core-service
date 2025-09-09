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

const code = ref(`interface IMetaData {
  id?: string
  title: string
  path: string
  keywords: string
  description: string
  canonicalUrl: string
}`)

const parsedFields = ref<any[]>([])
const className = ref('MetaForm')
const output = ref('')

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
    TSInterfaceDeclaration(path) {
      className.value = path.node.id.name.replace(/^I/, '') || 'GeneratedClass'

      path.node.body.body.forEach(prop => {
        if (t.isTSPropertySignature(prop) && t.isIdentifier(prop.key)) {
          const name = prop.key.name

          parsedFields.value.push({
            name,
            className: 'TextBaseField',
            args: {
              key: `'${name}'`,
              value: `data?.${name}`,
              label: `i18n.t('page.meta.${name}')`,
            },
          })
        }
      })
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
${parsedFields.value.map(f => `  readonly ${f.name}: ${f.className}`).join('\n')}

  constructor(data: I${className.value}) {
${constructorLines.join('\n')}
  }
}`.trim()

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
      <h2>Редактор класу з інтерфейсу</h2>
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
            <VChip
              label
              :color="VColors.Info"
              class="mr-2"
            >
              {{ field.name }}
            </VChip>
            <VSelect
              v-model="field.className"
              :items="FIELD_CLASSES"
            />
          </div>

          <div
            v-for="(value, key) in field.args"
            :key="key"
            class="d-flex align-center mb-2"
          >
            <div class="d-flex">
              <VChip
                label
                :color="VColors.Info"
                class="mr-2"
              >
                {{ key }}
              </VChip>
              <div>{{ value }}</div>
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
