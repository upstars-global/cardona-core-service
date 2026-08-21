<script setup lang="ts">
import { computed } from 'vue'
import { Field } from 'vee-validate'

const props = defineProps<{
  modelValue: unknown
  field: {
    id: string
    label: string
    rules?: Record<string, unknown>
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const isRequired = computed(() => !!(props.field.rules?.required))
</script>

<template>
  <Field
    v-model="internalValue"
    :name="field.id"
    :label="field.label.toLowerCase()"
    :rules="field.rules"
    :validate-on-blur="false"
    :validate-on-change="false"
    :validate-on-input="false"
    :validate-on-model-update="true"
  >
    <template #default="{ errorMessage }">
      <div :id="`${field.id}-field`">
        <VLabel
          v-if="field.label"
          data-test-id="field-label"
          class="mb-1 field-generator-label text-body-2 text-high-emphasis justify-between"
          :class="{ 'field-generator-label--required': isRequired }"
        >
          {{ field.label }}
        </VLabel>
        <slot />
        <span
          v-if="errorMessage"
          data-test-id="field-error"
          class="error-message text-caption text-error mt-4"
        >
          <slot
            name="error-message"
            :error-message="errorMessage"
          >
            {{ errorMessage }}
          </slot>
        </span>
      </div>
    </template>
  </Field>
</template>

<style lang="scss" scoped>
.field-generator-label {
  &--required:after {
    content: "*";
    color: rgb(var(--v-theme-error));
    margin-left: 0.25rem;
  }
}
</style>
