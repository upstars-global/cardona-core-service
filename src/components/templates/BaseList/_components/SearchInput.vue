<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useI18n } from 'vue-i18n'
import { IconsList } from '../../../../@model/enums/icons'
import type { VSizes } from '@/@model/vuetify'

interface Props {
  modelValue: string
  size?: VSizes
  placeholder?: string
}

interface Emits {
  (event: 'update:modelValue', payload: string): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const { t } = useI18n()

const placeholder = computed(() => props.placeholder || t('placeholder.search._'))

const TIME_DEBOUNCE = 500

const searchInput = ref(props.modelValue)

const debouncedEmitUpdate = debounce((value: string) => {
  emit('update:modelValue', value)
}, TIME_DEBOUNCE)

watch(() => props.modelValue, (newValue: string) => {
  searchInput.value = newValue
})

watch(searchInput, (newValue: string) => {
  debouncedEmitUpdate(newValue)
})
</script>

<template>
  <div class="search-field">
    <VTextField
      v-model="searchInput"
      :placeholder="placeholder"
      :size="size"
      autocomplete="off"
    >
      <template #prepend-inner>
        <VIcon :icon="IconsList.SearchIcon" />
      </template>
    </VTextField>
  </div>
</template>
