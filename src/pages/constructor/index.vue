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

const code = ref(`class User {
  name: string
  age: number

  constructor(data: Partial<User>) {
    Object.assign(this, data)
  }

  greet() {
    return 'Hi, ' + this.name
  }
}`)

const parsed = ref<any[]>([])
const className = ref('')
const output = ref('')

function parseCode() {
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
    ClassDeclaration(path) {
      className.value = path.node.id.name
      parsed.value = []

      for (const member of path.node.body.body) {
        if (t.isClassProperty(member)) {
          parsed.value.push({
            kind: 'property',
            name: (member.key as t.Identifier).name,
            type: member.typeAnnotation
              ? recast.print(member.typeAnnotation.typeAnnotation).code
              : 'any',
          })
        }
        else if (t.isClassMethod(member)) {
          parsed.value.push({
            kind: 'method',
            name: (member.key as t.Identifier).name,
            params: member.params.map(p => (p as t.Identifier).name),
          })
        }
      }
    },
  })
}
function updateCode() {
  const body = parsed.value.map(item => {
    if (item.kind === 'property')
      return `  ${item.name}: ${item.type};`
    else
      return `  ${item.name}(${item.params.join(', ')}) {\n    // ...\n  }`
  })

  const result = `class ${className.value} {\n${body.join('\n')}\n}`

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
      <textarea
        v-model="code"
        rows="12"
        cols="60"
      />
      <VBtn @click="parseCode">
        Розпарсити
      </VBtn>

      <div v-if="parsed.length">
        <h3>Клас: {{ className }}</h3>
        <ul>
          <li
            v-for="(item, i) in parsed"
            :key="i"
          >
            <template v-if="item.kind === 'property'">
              🧩 {{ item.name }}: {{ item.type }}
            </template>
            <template v-else>
              ⚙️ {{ item.name }}({{ item.params.join(', ') }})
            </template>
          </li>
        </ul>
        <VBtn @click="updateCode">
          Згенерувати код
        </VBtn>
        <pre>{{ output }}</pre>
      </div>
    </div>
  </div>
</template>
