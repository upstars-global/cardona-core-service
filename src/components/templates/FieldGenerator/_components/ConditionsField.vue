<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { ConditionsBaseField } from '../../../../@model/baseField'
import FieldGenerator from '../../../../components/templates/FieldGenerator'
import { FieldInfo, FieldType } from '../../../../@model/field'

const props = withDefaults(
  defineProps<{
    value: string
    field: ConditionsBaseField
    disabled?: boolean
    errors: Array<string>
  }>(),
  {
    value: '',
    errors: () => [],
  }
)

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const modelValue = computed({
  get: () => {
    return new FieldInfo({
      type: FieldType.Textarea,
      value: props.value,
      key: props.field.key,
      label: props.field.label,
      placeholder: props.field.placeholder,
      validationRules: props.field.validationRules,
    })
  },
  set: (value) => emit('input', value.value),
})

const availableVariables = ref<string[]>([])

onBeforeMount(async () => {
  availableVariables.value = await props.field.fetchOptions()
})

const onClickVariable = (variable: string) => emit('input', `${modelValue.value.value} ${variable}`)
</script>

<template>
  <div>
    <field-generator v-model="modelValue" class="mb-50" :disabled="disabled" />

    <b-row class="small" :class="{ 'pointer-events-none': disabled }">
      <b-col cols="3" class="font-weight-bolder">
        {{ $t('component.conditions.availableVariables') }}:
      </b-col>

      <b-col cols="9" class="font-weight-bold">
        <span
          v-for="(variable, index) in availableVariables"
          :key="index"
          v-b-tooltip.hover.bottom="$t(`component.conditions.${variable}`)"
          class="variable-label"
          @click="onClickVariable(variable)"
        >
          {{ variable }}
        </span>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.variable-label {
  cursor: pointer;
  padding-bottom: 0.5rem;

  &:hover {
    color: $primary;
  }
}
</style>