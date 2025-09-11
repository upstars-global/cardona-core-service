<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  keys: string[]
}>()

const { copy } = useClipboard()

const jsonObj = reactive<Record<string, any>>({})
const flatMap = reactive<Record<string, string>>({})

// Генерує вкладений об’єкт і flatMap для редагування
watch(() => props.keys, () => {
  generateReactiveJson(props.keys)
}, { immediate: true })

function generateReactiveJson(keys: string[]) {
  Object.keys(flatMap).forEach(k => delete flatMap[k])
  Object.keys(jsonObj).forEach(k => delete jsonObj[k])

  const result: Record<string, any> = {}

  keys.forEach(key => {
    const parts = key.split('.')
    let current = result

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]

      if (i === parts.length - 1) {
        current[part] = ''
        flatMap[key] = ''
      }
      else {
        current[part] ??= {}
        current = current[part]
      }
    }
  })

  Object.assign(jsonObj, result)
}

function updateNestedObjectFromFlatMap() {
  const result: Record<string, any> = {}

  for (const fullKey in flatMap) {
    const parts = fullKey.split('.')
    let current = result

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]

      if (i === parts.length - 1) {
        current[part] = flatMap[fullKey]
      }
      else {
        current[part] ??= {}
        current = current[part]
      }
    }
  }

  return result
}

function copyToClipboard() {
  const full = updateNestedObjectFromFlatMap()
  const trimmed = full.page ?? full // якщо є page — беремо тільки його вміст
  const text = JSON.stringify(trimmed, null, 2)

  copy(text)
}
</script>

<template>
  <VCard
    class="pa-4"
    elevation="2"
  >
    <VCardTitle>🌍 I18n редактор</VCardTitle>

    <VCardText>
      <div
        v-for="(value, key) in flatMap"
        :key="key"
        class="mb-4"
      >
        <VRow>
          <VCol>
            {{ key }}
          </VCol>
          <VCol>
            <VTextField
              v-model="flatMap[key]"
              dense
              hide-details
              placeholder="Введіть переклад…"
            />
          </VCol>
        </VRow>
      </div>

      <div class="d-flex justify-end mt-4">
        <VBtn
          v-if="Object.keys(flatMap).length"
          color="success"
          @click="copyToClipboard"
        >
          📋 Копіювати JSON
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 4px;
}
</style>
