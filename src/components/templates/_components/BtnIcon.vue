<script setup lang="ts">
import type { TranslateResult } from 'vue-i18n'
import { computed } from 'vue'
import type { IconsList } from '../../../@model/enums/icons'
import { Location } from '../../../@model/enums/tooltipPlacement'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'

const props = withDefaults(defineProps<Props>(), {
  tooltipPlacement: Location.Bottom,
  tooltipText: () => '',
})

const emits = defineEmits<Emits>()
export interface Props {
  value: boolean
  icon: IconsList
  isStatic?: boolean
  tooltipText?: TranslateResult
  tooltipPlacement?: Location
}

interface Emits {
  (event: 'click', payload: boolean): void
}

const stateColor = computed(
  () =>
    props?.value ? VColors.Success : VColors.Error,
)

const onClick = () => {
  if (!props.isStatic)
    emits('click', props.value)
}

const variant = computed(
  () =>
    `${VVariants.Outlined} ${VVariants.Flat}`,
)
</script>

<template>
  <div
    class="btn-check-icon"
    :class="{ 'default-cursor': isStatic }"
    style="cursor: initial"
    data-test-id="btn-icon-wrapper"
  >
    <VTooltip
      :location="tooltipPlacement"
    >
      <template #activator="{ props }">
        <VBtn
          data-test-id="button-icon__body"
          :class="{
            'v-btn--variant-tonal': !isStatic,
          }"
          :ripple="!isStatic"
          :color="stateColor"
          :variant="VVariants.Outlined"
          :size="VSizes.XSmall"
          :icon="icon"
          rounded="lg"
          v-bind="props"
          @click.stop="onClick"
        />
      </template>
      {{ tooltipText }}
    </VTooltip>
  </div>
</template>

<style scoped lang="scss">
.default-cursor {
  button {
    cursor: initial;
  }
}
.btn-check-icon {
  button {
    opacity: 1 !important;
  }
}
</style>
