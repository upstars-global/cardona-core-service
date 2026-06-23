<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VVariants } from '../../@model/vuetify'
import { useTextEditorStore } from '../../stores/textEditor'
import { SelectBaseField } from '../../@model/templates/baseField'
import FieldGenerator from '../../components/templates/FieldGenerator/index.vue'
import type { CurrencyLimit, GiftOptionsItem, GiftSpinOfferOptionsItem } from '../../@model/gift'
import { GIFT_SPIN_OFFER_OPTIONS, GIFT_TYPE_OPTIONS, getAvailableFields } from '../../@model/gift'
import type { EmitEvents } from '../../@model'

defineOptions({
  name: 'VariableGiftPreset',
})

const emit = defineEmits<EmitEvents<{
  'setVariables': Record<string, number>
}>>()

const { t } = useI18n()
const textEditorStore = useTextEditorStore()

const FETCH_OPTIONS_MAP = {
  gift: textEditorStore.fetchGiftsOptions,
  giftSpinOffers: textEditorStore.fetchGiftSpinOffersOptions,
} as const

interface GiftData {
  type?: string
  depositLimits?: CurrencyLimit[]
  sums?: CurrencyLimit[]
  sumLimits?: CurrencyLimit[]
  winLimits?: CurrencyLimit[]
  rates?: CurrencyLimit[]
  sumsAsPercent?: boolean
  winLimitsAsPercent?: boolean
  [key: string]: unknown
}

const isOpenSelectors = ref(false)

const giftType = ref(new SelectBaseField(
  {
    value: GIFT_TYPE_OPTIONS[0],
    key: 'type',
    label: t('component.variableGiftPreset.type'),
    options: GIFT_TYPE_OPTIONS,
    clearable: false,
  },
))

const gift = ref(new SelectBaseField(
  {
    value: '',
    key: 'gift',
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

const isBaseGiftType = computed(() => giftType.value.value.id === GIFT_TYPE_OPTIONS[0].id)

const giftData = ref<GiftData | null>(null)
const canApply = ref(false)
const isApplied = ref(false)

const resetApplyState = () => {
  canApply.value = false
  isApplied.value = false
}

const onSelectGiftType = ({ value }: SelectBaseField) => {
  gift.value.value = ''
  giftValue.value.value = ''
  giftValue.value.options = []
  giftData.value = null
  gift.value.fetchOptionsAction = FETCH_OPTIONS_MAP[value.id as keyof typeof FETCH_OPTIONS_MAP]
  gift.value.options = undefined
  resetApplyState()
}

const onSelectGift = ({ value }: { value: GiftOptionsItem | GiftSpinOfferOptionsItem }) => {
  if (!value?.id)
    return

  giftValue.value.value = ''

  if (isBaseGiftType.value) {
    giftValue.value.fetchOptionsAction = async () => {
      const entity = await textEditorStore.readGiftEntity((value as GiftOptionsItem).id)

      giftData.value = { ...entity, depositLimits: (value as GiftOptionsItem).depositLimits } as GiftData

      return {
        list: getAvailableFields(entity).map(field => ({
          id: field,
          name: t(`component.variableGiftPreset.fields.${field}`),
        })),
      }
    }
    giftValue.value.options = undefined
  }
  else {
    giftValue.value.options = GIFT_SPIN_OFFER_OPTIONS
    giftData.value = { rates: (value as GiftSpinOfferOptionsItem).rates }
  }

  resetApplyState()
}

const onSelectGiftFieldValue = ({ value }) => {
  if (!value?.id)
    return
  canApply.value = true
  isApplied.value = false
}

const setApply = () => {
  if (!giftData.value)
    return

  const fieldData = giftData.value[giftValue.value.value?.id] as CurrencyLimit[]

  const emittedValue: Record<string, number> = fieldData.reduce<Record<string, number>>((acc, curr) => ({
    ...acc,
    [curr.currency]: curr.value,
  }), {}) ?? {}

  emit('setVariables', emittedValue)
  isApplied.value = true
  canApply.value = false
}

const applyBtnLabel = computed(() => isApplied.value ? t('component.variableGiftPreset.applied') : t('component.variableGiftPreset.apply'))
</script>

<template>
  <div class="variable-gift-preset__wrapper pb-6">
    <div
      v-if="!isOpenSelectors"
      class="open-select d-flex align-center justify-end text-primary cursor-pointer"
      @click="isOpenSelectors = true"
    >
      <VIcon
        :icon="IconsList.Sparkles"
        class="mr-2"
      />
      <span>
        {{ $t('component.variableGiftPreset.fillFromGift') }}
      </span>
    </div>
    <div
      v-else
      class="selector-input bg-background"
    >
      <div class="selector-input--header d-flex align-center justify-space-between px-4 py-3">
        <div class="title text-body-1 title text-color-base font-weight-medium">
          {{ $t('component.variableGiftPreset.fillFromGift') }}
        </div>
        <div>
          <VBtn
            :variant="VVariants.Text"
            :color="VColors.Secondary"
            :size="20"
            @click="isOpenSelectors = false"
          >
            <VIcon :icon="IconsList.XIcon" />
          </VBtn>
        </div>
      </div>
      <div class="selector-input--body px-3 px-3">
        <VRow class="d-flex align-center py-0 my-0">
          <VCol
            cols="2"
            class="px-0 pt-0 pl-3"
          >
            <FieldGenerator
              v-model="giftType"
              @update:model-value="onSelectGiftType"
            />
          </VCol>
          <VCol
            cols="4"
            class="px-0 pt-0 pl-3"
          >
            <FieldGenerator
              v-model="gift"
              @update:model-value="onSelectGift"
            />
          </VCol>
          <VCol
            cols="4"
            class="px-0 pt-0 pl-3"
          >
            <FieldGenerator
              v-model="giftValue"
              :disabled="!gift.value.id"
              @update:model-value="onSelectGiftFieldValue"
            />
          </VCol>
          <VCol
            cols="2"
            class="pt-0"
          >
            <VBtn
              class="btn-apply w-100"
              :variant="VVariants.Outlined"
              :disabled="!canApply"
              @click="setApply"
            >
              <div class="d-flex align-center">
                <VIcon v-if="isApplied" :icon="IconsList.CheckIcon" class="mr-1" />
                {{ applyBtnLabel }}
              </div>
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
