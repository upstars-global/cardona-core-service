<script lang="ts" setup>
import type { GridColumn } from '@core/types'

interface Props {
  selectedRadio: string
  radioContent: { bgImage: string | undefined; value: string; label?: string }[]
  gridColumn?: GridColumn
}

interface Emit {
  (e: 'update:selectedRadio', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const updateSelectedOption = (value: string) => {
  emit('update:selectedRadio', value)
}
</script>

<template>
  <VRadioGroup
    v-if="props.radioContent"
    :model-value="props.selectedRadio"
    @update:model-value="updateSelectedOption"
  >
    <VRow>
      <VCol
        v-for="item in props.radioContent"
        :key="item.bgImage"
        v-bind="gridColumn"
      >
        <VLabel
          class="custom-input custom-radio rounded cursor-pointer w-100"
          :class="props.selectedRadio === item.value ? 'active' : ''"
        >
          <slot
            name="content"
            :item="item"
          >
            <img
              v-if="item.bgImage"
              :src="item.bgImage"
              alt="bg-img"
              class="custom-radio-image"
            >
          </slot>

          <VRadio
            :id="`custom-radio-with-img-${item.value}`"
            :value="item.value"
          />
        </VLabel>

        <VLabel
          v-if="item.label || $slots.label"
          :for="`custom-radio-with-img-${item.value}`"
          class="cursor-pointer"
        >
          <slot
            name="label"
            :label="item.label"
          >
            {{ item.label }}
          </slot>
        </VLabel>
      </VCol>
    </VRow>
  </VRadioGroup>
</template>

<style lang="scss" scoped>
.custom-radio {
  padding: 0;

  &.active {
    border-width: 2px;
  }

  .custom-radio-image {
    block-size: 100%;
    inline-size: 100%;
    min-inline-size: 100%;
  }

  .v-radio {
    visibility: hidden;
  }
}
</style>
