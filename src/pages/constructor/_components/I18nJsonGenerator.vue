<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import {IconsList} from "@/@model/enums/icons";
import {useCopyWithToast} from "@/pages/constructor/_composables/copyWithToast";

const props = defineProps<{
  keys: string[]
}>()

const { copy } = useClipboard()

const jsonObj = reactive<Record<string, any>>({})
const flatMap = reactive<Record<string, string>>({})
const output = ref('')

// Генерує вкладений об’єкт і flatMap для редагування
watch(
  () => props.keys,
  () => {
    generateReactiveJson(props.keys)
    updateOutput()
  },
  { immediate: true },
)

watch(flatMap, updateOutput, { deep: true })

function generateReactiveJson(keys: string[]) {
  // Зберігаємо попередні значення
  const previousFlatMap = { ...flatMap }

  // Очищуємо поточні значення
  Object.keys(flatMap).forEach(k => delete flatMap[k])
  Object.keys(jsonObj).forEach(k => delete jsonObj[k])

  const result: Record<string, any> = {}

  keys.forEach(key => {
    const parts = key.split('.')
    let current = result

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]

      if (i === parts.length - 1) {
        current[part] = previousFlatMap[key] ?? ''
        flatMap[key] = previousFlatMap[key] ?? ''
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

function updateOutput() {
  const full = updateNestedObjectFromFlatMap()
  const trimmed = full.page ?? full

  output.value = JSON.stringify(trimmed, null, 2)
}

const copyWithToast = useCopyWithToast()
</script>

<template>
  <VCard elevation="2">
    <div class="d-flex justify-end pt-4 pr-6  ">
      <VBtn
        v-if="Object.keys(flatMap).length"
        color="success"
        @click="copyWithToast(output, 'constructorJsonCopied')"
      >
        <VIcon :icon="IconsList.CopyIcon" />
      </VBtn>
    </div>
    <VCardText>
      <VRow dense>
        <!-- LEFT: Inputs -->
        <VCol
          cols="12"
          md="6"
        >
          <div
            v-for="(value, key) in flatMap"
            :key="key"
            class="mb-3"
          >
            <VRow>
              <VCol cols="6">
                <label>{{ key }}</label>
              </VCol>
              <VCol cols="6">
                <VTextField
                  v-model="flatMap[key]"
                  dense
                  hide-details
                  placeholder="Enter translation…"
                />
              </VCol>
            </VRow>
          </div>
        </VCol>

        <!-- RIGHT: JSON -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextarea
            v-model="output"
            auto-grow
            readonly
            label="Generated JSON"
            class="code-output"
            rows="10"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style scoped>
.code-output {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  background-color: #f6f8fa;
  border-radius: 6px;
}
</style>
