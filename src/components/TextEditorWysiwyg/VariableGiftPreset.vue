<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VVariants } from '../../@model/vuetify'
import SelectField from '../../components/templates/FieldGenerator/_components/SelectField.vue'
import { useTextEditorStore } from '../../stores/textEditor'
import { SelectBaseField } from '../../@model/templates/baseField'
import FieldGenerator from '../../components/templates/FieldGenerator/index.vue'

defineOptions({
  name: 'VaraibleGiftPreset',
})

const i18n = useI18n()

const isOpenSelectors = ref(false)

const setStateOpenSelectors = (state: boolean) => {
  isOpenSelectors.value = state
}

const selectedGift = ref(new SelectBaseField(
  {
    value: '',
    key: 'selectedGift',
    label: i18n.t('component.variableGiftPreset.selectedGift'),
    fetchOptionsAction: useTextEditorStore().fetchGiftsOptions,
    clearable: false,
    infiniteLoading: true,
    filterable: false,
    filterBy: {
      isActive: 'true',
    },
  },
))

const giftValue = ref(new SelectBaseField({
  key: 'giftValue',
  label: i18n.t('component.variableGiftPreset.value'),
  options: [],
}))
</script>

<template>
  <div class="variable-gift-preset__wrapper pb-6">
    <div
      v-if="!isOpenSelectors"
      class="open-select d-flex align-center justify-end text-primary cursor-pointer"
    >
      <span @click="setStateOpenSelectors(true)">
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
            <FieldGenerator
              v-model="selectedGift"
              :with-label="false"
            />
          </VCol>
          <VCol cols="5">
            <FieldGenerator
              v-model="giftValue"
              :with-label="false"
            />
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
