<template>
  <div v-if="openEdit" class="d-flex justify-content-center align-items-center">
    <div style="min-width: 4rem" class="mr-1">
      <b-form-input
        v-model="numberPositionComputed"
        :size="size"
        type="number"
        autofocus
        :formatter="formatterInput"
        @keydown="onKeyDown"
        @keyup.enter="successNewPosition"
        @keyup.esc="cancelNewPosition"
      />
    </div>
    <div class="cursor-pointer text-success mr-1" @click.stop="successNewPosition">
      <feather-icon :icon="IconsList.CheckIcon" size="14" />
    </div>
    <div class="cursor-pointer text-danger" @click.stop="cancelNewPosition">
      <feather-icon :icon="IconsList.XIcon" size="14" />
    </div>
  </div>
  <div
    v-else
    class="d-flex justify-content-center align-items-center"
    :class="{ 'position-text-block': canUpdate }"
    @click="onOpenEdit"
  >
    <feather-icon v-if="canUpdate" :icon="IconsList.EditIcon" class="mr-1" />
    <span>{{ position }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { ListSize } from '../../../../@core/components/table-fields/model'
import { IconsList } from '../../../../@model/enums/icons'
import { NumberOrString } from '../../../../@model'
import {
  getMappedValueByManyMethods,
  toPositiveNumbers,
  toIntegerNumbers,
} from '../../../../helpers'

export default defineComponent({
  name: 'PositionField',

  props: {
    position: {
      type: Number,
      default: 0,
    },
    canUpdate: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<ListSize>,
    },
  },
  emits: ['edit-position'],
  setup(props, { emit }) {
    const openEdit = ref(false)

    const numberPositionComputed = ref(props.position)

    const onOpenEdit = () => {
      if (!props.canUpdate) return
      openEdit.value = true
    }

    const successNewPosition = () => {
      emit('edit-position', numberPositionComputed.value || props.position)
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

    const onKeyDown = (event) => {
      if (disabledKeys.value.some((key) => key === event.key)) {
        event.preventDefault()
      }
    }

    const getNumberMoreThenZero = (value: NumberOrString): NumberOrString =>
      +value != 0 ? value : ''
    const formatterInput = (value: NumberOrString): NumberOrString =>
      getMappedValueByManyMethods(value, [
        toPositiveNumbers,
        toIntegerNumbers,
        getNumberMoreThenZero,
      ])

    return {
      openEdit,
      numberPositionComputed,

      successNewPosition,
      cancelNewPosition,

      onOpenEdit,
      IconsList,
      onKeyDown,
      formatterInput,
    }
  },
})
</script>
