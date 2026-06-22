<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VVariants } from '../../@model/vuetify'
import { useTextEditorStore } from '../../stores/textEditor'
import { SelectBaseField } from '../../@model/templates/baseField'
import FieldGenerator from '../../components/templates/FieldGenerator/index.vue'
import type { CurrencyLimit } from '../../@model/gift'
import { getAvailableFields } from '../../@model/gift'
import type { EmitEvents } from '../../@model'

defineOptions({
  name: 'VaraibleGiftPreset',
})

const emit = defineEmits<EmitEvents<{
  'setVariables': Record<string, CurrencyLimit>
}>>()

const { t } = useI18n()
const textEditorStore = useTextEditorStore()

const isOpenSelectors = ref(false)

const setStateOpenSelectors = (state: boolean) => {
  isOpenSelectors.value = state
}

const selectedGift = ref(new SelectBaseField(
  {
    value: '',
    key: 'selectedGift',
    label: t('component.variableGiftPreset.gift'),
    fetchOptionsAction: textEditorStore.fetchGiftsOptions,
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
  label: t('component.variableGiftPreset.value'),
  clearable: false,
  options: [],
}))

const giftData = ref()

const canApply = ref(false)
const isApplied = ref(false)

const onSelectGift = async ({ _value }: SelectBaseField) => {
  giftValue.value.options = []
  if (!_value?.id)
    return
  giftData.value = await textEditorStore.readGiftEntity(_value.id)
  giftData.value.depositLimits = _value.depositLimits
  giftValue.value.options = getAvailableFields(giftData.value).map(field => ({
    id: field,
    name: t(`component.variableGiftPreset.fields.${field}`),
  }))
  canApply.value = false
  isApplied.value = false
}

const onSelectGiftFieldValue = ({ _value }: SelectBaseField) => {
  emit('setVariables', giftData.value[_value?.id] ?? {})
  canApply.value = true
  isApplied.value = false
}

const setApply = () => {
  isApplied.value = true
  canApply.value = false
}
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
          {{ $t('component.variableGiftPreset.fillFromGift') }} {{giftData ? giftData?.type : ''}}
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
              @update:model-value="onSelectGift"
            />
          </VCol>
          <VCol cols="5">
            <FieldGenerator
              v-model="giftValue"
              @update:model-value="onSelectGiftFieldValue"
            />
          </VCol>
          <VCol cols="2">
            <VBtn
              class="w-100 btn-apply"
              :variant="VVariants.Outlined"
              :disabled="!canApply"
              @click="setApply"
            >
              <span v-if="isApplied">
                <VIcon
                  :icon="IconsList.CheckIcon"
                  :size="20"
                  class="mr-2"
                /> {{ $t('component.variableGiftPreset.applied') }}
              </span>
              <span v-else>
                {{ $t('component.variableGiftPreset.apply') }}
              </span>
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

.btn-apply {
  margin-top: 1.65rem;
}
</style>
