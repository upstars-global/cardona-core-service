<script setup lang="ts">
import { ref, useSlots, watch } from 'vue'
import { cloneDeep } from 'lodash'
import { IconsList } from '../../../../@model/enums/icons'

interface Props {
  value?: unknown
  isEdit?: boolean
  canEdit?: boolean
  disableAcceptUpdate?: boolean
}
interface Emits {
  (event: 'change-mode', payload: boolean): void
  (event: 'accept-change', payload: unknown): void
  (event: 'reject-change', payload: unknown): void
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
  disableAcceptUpdate: false,
})

const emits = defineEmits<Emits>()
const slots = useSlots()
const openEdit = ref(props.isEdit)

watch(
  () => props.isEdit,
  value => {
    if (props.disableAcceptUpdate)
      return
    openEdit.value = value
  },
)

const editableValue = ref<unknown>(cloneDeep(props.value))
const acceptedValue = ref<unknown>(cloneDeep(props.value))

const setEditMode = (value: boolean) => {
  openEdit.value = value
  emits('change-mode', value)
}

const setUpdate = (): void => {
  editableValue.value = cloneDeep(acceptedValue.value)
  if (!props.disableAcceptUpdate)
    setEditMode(false)
  emits('accept-change', editableValue.value)
}

const cancelUpdate = (): void => {
  acceptedValue.value = cloneDeep(editableValue.value)
  setEditMode(false)
  emits('reject-change', editableValue.value)
}

const updateValue = (value: unknown): void => {
  acceptedValue.value = cloneDeep(value)
}
</script>

<template>
  <div
    class="editable-wrapper"
    @click.stop
  >
    <div
      v-if="!openEdit"
      class="d-flex justify-content-center align-items-center"
    >
      <div
        v-if="canEdit"
        class="icon-edit-wrapper mr-1"
      >
        <VIcon
          :icon="IconsList.EditIcon"
          @click.stop="setEditMode(true)"
        />
      </div>
      <slot :value="acceptedValue">
        {{ acceptedValue }}
      </slot>
    </div>

    <div
      v-else
      class="d-flex justify-content-center align-items-center"
    >
      <slot
        name="input"
        :update-value="updateValue"
        :input-value="acceptedValue"
      />
      <div class="action-buttons d-flex align-center pl-1">
        <div
          class="cursor-pointer text-success"
          @click.stop="setUpdate"
        >
          <VIcon :icon="IconsList.CheckIcon" />
        </div>
        <div
          class="cursor-pointer text-error ml-1"
          @click.stop="cancelUpdate"
        >
          <VIcon :icon="IconsList.XIcon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editable-wrapper {
  .icon-edit-wrapper {
    width: 1rem;
    height: 24px;
  }
}
</style>
