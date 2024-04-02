<script setup lang="ts">
import { computed } from 'vue'
import { PhoneBaseField } from '../../../../@model/baseField'
import { getCountryDataByPhone } from '../../../../helpers/countries'
import Cleave from 'vue-cleave-component'
import '/node_modules/flag-icons/css/flag-icons.min.css'

type PhoneFieldProps = {
  value: string
  field: PhoneBaseField
  disabled?: boolean
  errors?: string[]
}

const props = withDefaults(defineProps<PhoneFieldProps>(), {
  value: '',
  errors: () => [],
})

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const cleaveOptions = {
  blocks: [2, 3, 3, 2, 4],
}

const modelValue = computed({
  get: (): string => props.value,
  set: (value: string) => {
    const phoneWithPlus: string = modelValue.value[0] !== '+' ? `+${value}` : value

    emit('input', phoneWithPlus)
  },
})

const phoneFlag = computed(() => getCountryDataByPhone(modelValue.value)?.shortCode.toLowerCase())
</script>

<template>
  <div class="d-flex justify-content-between align-items-center position-relative">
    <div class="position-relative input-phone-wrapper w-100">
      <span
        v-if="phoneFlag"
        class="flag-icon fi position-absolute"
        :class="`fi-${phoneFlag}`"
      ></span>
      <cleave
        v-model="modelValue"
        type="text"
        class="form-control"
        :class="{ 'pl-3': phoneFlag }"
        :placeholder="$t('common.phone._')"
        :disabled="disabled"
        :options="cleaveOptions"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.input-phone-wrapper {
  .flag-icon {
    top: 0;
    left: 0.75rem;
    bottom: 0;
    right: 0;
  }
}

.flag {
  display: inline-block;
  font-size: 2rem;
  position: absolute;
  top: 9px;
  left: 9px;
  margin: 0;
}

.error {
  border-color: $red;
}
</style>
