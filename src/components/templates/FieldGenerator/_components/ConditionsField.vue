<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import type { ConditionsBaseField } from '../../../../@model/templates/baseField'
import { TextareaBaseField } from '../../../../@model/templates/baseField'
import FieldGenerator from '../index.vue'
import { MAX_WIDTH_TOOLTIP } from '../../../../utils/constants'

const props = withDefaults(
  defineProps<{
    modelValue: string
    field: ConditionsBaseField
    disabled?: boolean
    errors: boolean
  }>(),
  {
    modelValue: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const modelValue = computed({
  get: () => {
    return new TextareaBaseField({
      value: props.modelValue,
      key: props.field.key,
      label: props.field.label,
      placeholder: props.field.placeholder,
      validationRules: props.field.validationRules,
    })
  },
  set: value => emit('update:modelValue', value.value),
})

const availableVariables = ref<string[]>([])

onBeforeMount(async () => {
  availableVariables.value = await props.field.fetchOptions()
})

const onClickVariable = (variable: string) => emit('update:modelValue', `${modelValue.value.value} ${variable}`)
</script>

<template>
  <div>
    <FieldGenerator
      v-model="modelValue"
      class="mb-2"
      :disabled="disabled"
    />

    <VRow class="small">
      <VCol
        cols="4"
        class="font-weight-regular text-no-wrap text-body-2 text-color-base"
      >
        {{ $t('component.conditions.availableVariables') }}:
      </VCol>

      <VCol
        cols="8"
        class="font-weight-regular pl-2 d-flex flex-wrap"
      >
        <div
          v-for="(variable, index) in availableVariables"
          :key="index"
          class="variable-label__wrapper  ml-2"
          data-test-id="condition-variable-item"
          :class="{ 'pointer-events-none': disabled, 'variable-label': !disabled }"
          @click="onClickVariable(variable)"
        >
          <small
            class="text-body-1 variable-label text-color-base font-weight-medium"
            :data-test-id="`variable-value-${index}`"
          >{{ variable }}</small>
          <VTooltip
            activator="parent"
            location="bottom"
            :max-width="MAX_WIDTH_TOOLTIP"
          >
            <div class="comment-text__tooltip">
              {{ $t(`component.conditions.${variable}`) }}
            </div>
          </VTooltip>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.variable-label {
  cursor: pointer;

  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

.pointer-events-none {
  pointer-events: none;
}
</style>
