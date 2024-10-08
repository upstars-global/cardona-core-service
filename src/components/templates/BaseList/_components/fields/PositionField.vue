<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue'
import AppTextField from '../../../../../@core/components/app-form-elements/AppTextField.vue'
import { IconsList } from '../../../../../@model/enums/icons'
import { getMappedValueByManyMethods, toIntegerNumbers, toPositiveNumbers } from '../../../../../helpers'
import type { NumberOrString } from '../../../../../@model'
import { ListSize } from '../../../../../@model/templates/tableFields'
import { VColors, VSizes } from '../../../../../@model/vuetify'

const props = withDefaults(
  defineProps<{
    position?: number
    canUpdate?: boolean
    size?: ListSize
  }>(),
  {
    position: 0,
    canUpdate: false,
    size: ListSize.MD,
  },
)

const emits = defineEmits<{
  (e: 'editPosition', value: number): void
}>()

const openEdit = ref(false)

const numberPositionComputed = ref(props.position)

const onOpenEdit = () => {
  if (!props.canUpdate)
    return
  openEdit.value = true
}

const successNewPosition = () => {
  emits('editPosition', numberPositionComputed.value || props.position)
  openEdit.value = false
}

const cancelNewPosition = () => {
  numberPositionComputed.value = props.position
  openEdit.value = false
}

const disabledKeys = computed(() => [
  'e',
  '.',
  '-',
  numberPositionComputed.value.toString().isEmpty && '0',
])

const onKeyDown = (event: KeyboardEvent) => {
  if (disabledKeys.value.includes(event.key))
    event.preventDefault()
}

const getNumberMoreThenZero = (value: NumberOrString): NumberOrString =>
  +value !== 0 ? value : ''

const formatterInput = (value: NumberOrString): NumberOrString =>
  getMappedValueByManyMethods(value, [
    toPositiveNumbers,
    toIntegerNumbers,
    getNumberMoreThenZero,
  ])

const isSmallSize = computed(() => props.size === ListSize.SM)

const buttonSize = computed(() => {
  return isSmallSize.value ? VSizes.Small : VSizes.Medium
})
</script>

<template>
  <div
    v-if="openEdit"
    class="d-flex align-center"
    @click.stop
  >
    <div
      style="min-width: 4rem"
      class="mr-1"
    >
      <AppTextField
        v-model="numberPositionComputed"
        :size="buttonSize"
        type="number"
        autofocus
        :formatter="formatterInput"
        class="priority-input"
        :class="{ 'app-text-field--small': isSmallSize }"
        @keydown="onKeyDown"
        @keyup.enter="successNewPosition"
        @keyup.esc="cancelNewPosition"
      />
    </div>
    <VBtn
      class="text-success mr-1 v-btn--rectangle"
      variant="text"
      :size="buttonSize"
      @click.stop="successNewPosition"
    >
      <VIcon
        :icon="IconsList.CheckIcon"
        size="14"
      />
    </VBtn>
    <VBtn
      class="cursor-pointer text-error v-btn--rectangle"
      variant="text"
      :size="buttonSize"
      @click.stop="cancelNewPosition"
    >
      <VIcon
        :icon="IconsList.XIcon"
        size="14"
      />
    </VBtn>
  </div>
  <div
    v-else
    class="d-flex align-center"
    :class="{ 'position-text-block': canUpdate }"
    @click.stop="onOpenEdit"
  >
    <VIcon
      v-if="canUpdate"
      :icon="IconsList.EditIcon"
      :color="VColors.Primary"
      class="mr-1"
    />
    <span>{{ position }}</span>
  </div>
</template>

<style lang="scss" scoped>
.priority-input {
  min-width: 5rem;
}
</style>
