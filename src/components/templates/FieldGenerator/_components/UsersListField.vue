<script setup lang="ts">
import { computed, ref } from 'vue'
import TextareaField from './TextareaField.vue'
import { getFileValue } from '../../../../helpers'
import useToastService from '../../../../helpers/toasts'
import { IconsList } from '../../../../@model/enums/icons'
import { BSize, BVariant } from '../../../../@model/bootstrap'
import { UsersListBaseField } from '../../../../@model/baseField'

type ModelValue = Array<string>
interface Props {
  value: ModelValue
  field: UsersListBaseField
  errors?: Array<string>
  disabled?: boolean
}

interface Emits {
  (event: 'input', payload: ModelValue): void
}

const { toastError } = useToastService()

const acceptFile = '.csv'

const props = withDefaults(defineProps<Props>(), {
  value: () => [],
})
const emits = defineEmits<Emits>()

const isNotEmptyString = (text: string): boolean => !!text.trim()
const getTrimStartEnd = (playerId: string) => playerId.trimEnd().trimStart()

const onGetPropsValue = (): string => {
  return props.value.filter(isNotEmptyString).map(getTrimStartEnd).join(',')
}

const fromStringIdsToArray = (value: string): ModelValue =>
  value
    .replaceAll('\n', ',')
    .split(',')
    .filter(isNotEmptyString)
    .map((playerId) => playerId.trimEnd().trimStart())

const onSetPropsValue = (value: string): void => {
  emits('input', fromStringIdsToArray(value))
}

const value = computed({
  get: onGetPropsValue,
  set: onSetPropsValue,
})

const cvsFileType = 'text/csv'

const onInputFile = async (inputFile: File) => {
  if (!inputFile) return
  if (cvsFileType !== inputFile?.type) {
    toastError('invalidTypeFile')
    return
  }

  const uploadValue: string = await getFileValue(inputFile)
  emits('input', fromStringIdsToArray(uploadValue.toString()))
}

const inputFileRef = ref()
const openInputFileDialog = () => {
  inputFileRef.value.$el.children[0].click()
}
</script>

<template>
  <div>
    <textarea-field v-model="value" :field="field" :errors="errors" :disabled="disabled" />
    <div class="float-right d-flex justify-content-end pt-50">
      <b-form-file
        id="csv-file-input"
        ref="inputFileRef"
        class="d-none"
        :accept="acceptFile"
        @input="onInputFile"
      />
      <b-button :variant="BVariant.OutlinePrimary" :size="BSize.Sm" @click="openInputFileDialog">
        <span class="mr-50">
          <feather-icon :icon="IconsList.UploadIcon" />
        </span>
        <span class="upload-csv-label">{{ $t('page.demo.uploadCSV') }}</span>
      </b-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.upload-csv-label {
  font-weight: 600;
}
</style>