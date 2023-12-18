<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import {ConditionsBaseField, TextareaBaseField} from "@/@model/templates/baseField";

const props = withDefaults(
  defineProps<{
    modelValue: string
    field: ConditionsBaseField
    disabled?: boolean
    errors: Array<string>
  }>(),
  {
    modelValue: '',
    errors: () => [],
  }
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
    });
  },
  set: (value) => emit('update:modelValue', value.value),
})

const availableVariables = ref<string[]>([])

onBeforeMount(async () => {
  availableVariables.value = await props.field.fetchOptions()
})

const onClickVariable = (variable: string) => emit('update:modelValue', `${modelValue.value.value} ${variable}`)
</script>

<template>
  <div>
    <field-generator v-model="modelValue" class="mb-50" :disabled="disabled" />

    <VRow class="small" :class="{ 'pointer-events-none': disabled }">
      <VCol cols="3" class="font-weight-bolder text-nowrap">
        {{ $t('component.conditions.availableVariables') }}:
      </VCol>

      <VCol cols="9" class="font-weight-bold pl-2 d-flex gap-2">
        <div
          v-for="(variable, index) in availableVariables"
          :key="index"
          class="variable-label"
          @click="onClickVariable(variable)"
        >
          {{ variable }}
          <VTooltip
              activator="parent"
              location="bottom"
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
  padding-bottom: 0.5rem;

  &:hover {
    color: rgb(var(--v-theme-primary));
  }
}
</style>
