<script setup lang="ts">
import { ref } from 'vue'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VVariants } from '../../@model/vuetify'

defineOptions({
  name: 'VaraibleGiftPreset',
})

const isOpenSelectors = ref(false)

const setStateOpenSelectors = (state: boolean) => {
  isOpenSelectors.value = state
}

const selectedGift = ref()
const selectedGiftField = ref()

</script>

<template>
  <div class="variable-gift-preset__wrapper pb-6">
    <div
      v-if="!isOpenSelectors"
      class="open-select d-flex align-center justify-end text-primary cursor-pointer"
    >
      <span
        class="bg-info"
        @click="setStateOpenSelectors(true)"
      >
        <VIcon
          :icon="IconsList.Sparkles"
          class="mr-2"
        />

        <span>
          {{ $t('component.variableGiftPreset.fillFromGift') }}
        </span>
      </span>
    </div>
    <div
      v-else
      class="selector-input bg-background px-4"
    >
      <div class="selector-input--header d-flex align-center justify-space-between py-3">
        <div class="title text-body-1 title text-color-base font-weight-medium">
          {{ $t('component.variableGiftPreset.fillFromGift') }}
        </div>
        <div>
          <VBtn
            :variant="VVariants.Text"
            :color="VColors.Secondary"
            :size="20"
            @click="setStateOpenSelectors(false)"
          >
            <VIcon :icon="IconsList.XIcon" />
          </VBtn>
        </div>
      </div>
      <div class="selector-input--body">
        <VRow>
          <VCol cols="5">
            Gift
          </VCol>
          <VCol cols="5">
            Gift field
          </VCol>
          <VCol cols="2">
            <VBtn
              class="w-100"
              :variant="VVariants.Outlined"
            >
              {{ $t('component.variableGiftPreset.apply') }}
            </VBtn>
          </VCol>
        </VRow>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selector-input {
  border-radius: 6px;
}
</style>
