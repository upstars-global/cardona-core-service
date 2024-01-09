<script setup lang="ts">
import { watch } from 'vue';

import { useFileSystemAccess } from '@vueuse/core';

import { computed } from 'vue'
import TextareaField from './TextareaField.vue'
import useToastService from '../../../../helpers/toasts'
import { IconsList } from '../../../../@model/enums/icons'
import {VSizes, VVariants} from "../../../../@model/vuetify";
import {UsersListBaseField} from "../../../../@model/templates/baseField";

type ModelValue = Array<string>
interface Props {
  modelValue: ModelValue
  field: UsersListBaseField
  errors?: boolean
  disabled?: boolean
}

interface Emits {
  (event: 'update:modelValue', payload: ModelValue): void
}

const { toastError } = useToastService()

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
})
const emits = defineEmits<Emits>()

const { data, fileMIME, open} = useFileSystemAccess()

const isNotEmptyString = (text: string): boolean => !!text.trim()
const getTrimStartEnd = (playerId: string) => playerId.trimEnd().trimStart()

const onGetPropsValue = (): string => {
  return props.modelValue.filter(isNotEmptyString).map(getTrimStartEnd).join(',')
}

const fromStringIdsToArray = (value: string): ModelValue =>
  value
    .replaceAll('\n', ',')
    .split(',')
    .filter(isNotEmptyString)
    .map((playerId) => playerId.trimEnd().trimStart())

const onSetPropsValue = (value: string): void => {
  emits('update:modelValue', fromStringIdsToArray(value))
}
watch(() => data.value, (value) => {
  if(value) {
    if(fileMIME.value === cvsFileType) {
      emits('update:modelValue', fromStringIdsToArray(data.value))
    } else {
      toastError('invalidTypeFile')
      return
    }
    data.value = undefined
  }
})

const value = computed({
  get: onGetPropsValue,
  set: onSetPropsValue,
})

const cvsFileType = 'text/csv'

const pickerOpts = {
  types: [
    {
      accept: {
        "text/csv": [".csv"]
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};
</script>

<template>
  <div>
    <textarea-field v-model="value" :field="field" :errors="errors" :disabled="disabled" />
    <div class="d-flex justify-end mt-2">
      <VBtn
          :variant="VVariants.Outlined"
          :size="VSizes.Small"
          @click="open(pickerOpts)"
      >
        <VIcon :icon="IconsList.UploadIcon" class="mr-1" />
        {{$t('page.demo.uploadCSV')}}
      </VBtn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.upload-csv-label {
  font-weight: 600;
}
</style>
