<script setup lang="ts">
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash'
import { IconsList } from '../../../../@model/enums/icons'
import { VColors, VSizes } from '../../../../@model/vuetify'

interface Props {
  value?: unknown
  isEdit?: boolean
  canEdit?: boolean
  disableAcceptUpdate?: boolean
  editIconOnHover?: boolean
}
interface Emits {
  (event: 'change-mode', payload: boolean): void
  (event: 'accept-change', payload: unknown): void
  (event: 'reject-change', payload: unknown): void
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
  disableAcceptUpdate: false,
  iconEdit: 'show',
})

const emits = defineEmits<Emits>()
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
  updateValue(editableValue.value)
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
    data-test-id="editable-wrapper"
    :class="{ 'editable-wrapper--open': openEdit }"
    @click.stop
  >
    <div
      v-if="!openEdit"
      class="d-flex justify-content-center align-center"
      :class="{ 'flex-row-reverse': rightPositionIconEdit }"
      data-test-id="readable-value"
    >
      <slot :value="value">
        {{ value }}
      </slot>
      <div
        v-if="canEdit"
        class="icon-edit-wrapper pl-1"
        :class="{
          'show-on-hover': editIconOnHover,
        }"
      >
        <VIcon
          data-test-id="edit-icon"
          :icon="IconsList.EditIcon"
          :color="VColors.Primary"
          @click.stop="setEditMode(true)"
        />
      </div>
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
      <div
        class="action-buttons d-flex align-center gap-1 pl-1"
        data-test-id="action-buttons"
      >
        <VBtn
          data-test-id="accept-update-button"
          class="cursor-pointer text-success v-btn--rectangle"
          variant="text"
          :size="VSizes.Medium"
          @click.stop="setUpdate"
        >
          <VIcon :icon="IconsList.CheckIcon" />
        </VBtn>
        <VBtn
          data-test-id="cancel-update-button"
          class="cursor-pointer text-error v-btn--rectangle"
          variant="text"
          :size="VSizes.Medium"
          @click.stop="cancelUpdate"
        >
          <VIcon :icon="IconsList.XIcon" />
        </VBtn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editable-wrapper {
  position: relative;
  .icon-edit-wrapper.show-on-hover {
    display: none;
  }
  &:hover{
    .icon-edit-wrapper.show-on-hover {
      position: absolute;
      display: block;
      right: -1.5rem;
    }
  }
}
</style>
