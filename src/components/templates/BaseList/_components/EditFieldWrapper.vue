<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { IconsList } from '../../../../@model/enums/icons'
import { cloneDeep } from 'lodash'

interface Props {
  value?: unknown
}
interface Emits {
  (event: 'change-mode', payload: boolean): void
  (event: 'accept-change'): void
  (event: 'reject-change'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const slots = useSlots()
const openEdit = ref(false)

const setEditMode = (value: boolean) => {
  openEdit.value = value
  emits('change-mode', value)
  emits(value ? 'accept-change' : 'reject-change')
}

const editableValue = ref<unknown>(cloneDeep(props.value))
const acceptedValue = ref<unknown>(cloneDeep(props.value))
const setUpdate = (): void => {
  editableValue.value = cloneDeep(acceptedValue.value)
  setEditMode(false)
}
const cancelUpdate = (): void => {
  acceptedValue.value = cloneDeep(editableValue.value)
  setEditMode(false)
}
const updateValue = (value: unknown): void => {
  acceptedValue.value = cloneDeep(value)
}
</script>

<template>
  <div class="editable-wrapper" @click.stop>
    <div v-if="!openEdit" class="d-flex justify-content-center align-items-center">
      <feather-icon :icon="IconsList.EditIcon" class="mr-1" @click.stop="setEditMode(true)" />
      <slot :value="acceptedValue">{{ acceptedValue }}</slot>
    </div>

    <div v-else class="d-flex justify-content-center align-items-center">
      <slot name="input" :update-value="updateValue" :input-value="acceptedValue"></slot>
      <div class="cursor-pointer text-success ml-50" @click.stop="setUpdate">
        <feather-icon :icon="IconsList.CheckIcon" />
      </div>
      <div class="cursor-pointer text-danger ml-1" @click.stop="cancelUpdate">
        <feather-icon :icon="IconsList.XIcon" />
      </div>
    </div>
  </div>
</template>