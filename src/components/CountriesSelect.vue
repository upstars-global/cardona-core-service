<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import type { RegionInfo } from '../@model/regions'
import { VSizes } from '../@model/vuetify'
import { IconsList } from '../@model/enums/icons'
import { withPopper } from '../helpers/selectPopper'

const props = defineProps<{
  modelValue: Array<string>
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const { t } = useI18n()
const store = useStore()

const countriesRadioModel = ref('ban')
const selectedCountries = ref()
const regions = ref<Array<RegionInfo>>([])

const optionsRadioCountries = computed(() => [
  { text: t('component.countriesSelect.banInCountries'), value: 'ban' },
  { text: t('component.countriesSelect.allowInCountries'), value: 'allow' },
])

const countriesRadioLabel = computed(() => {
  const radioLabels = {
    allow: t('component.countriesSelect.allowedCountries'),
    ban: t('component.countriesSelect.bannedCountries'),
  }

  return radioLabels[countriesRadioModel.value]
})

const hasCountryCode = (codeList: string[], countryCode: string): boolean => {
  return codeList.some(code => {
    const [country] = code.split('-')

    return country === countryCode
  })
}

onMounted(async () => {
  regions.value = await store.dispatch('regions/fetchRegionList')

  if (props.modelValue.isNotEmpty) {
    const formRestrictedCountries: Array<RegionInfo> = regions.value.filter(
      ({ code }: RegionInfo) => props.modelValue?.includes(code),
    )

    if (formRestrictedCountries.length > regions.value.length / 2) {
      countriesRadioModel.value = 'allow'
      selectedCountries.value = regions.value.filter(({ code }: RegionInfo) => {
        const [country, region] = code.split('-')

        return region ? !props.modelValue.includes(code) : !hasCountryCode(props.modelValue, country)
      })
    }
    else {
      countriesRadioModel.value = 'ban'
      selectedCountries.value = formRestrictedCountries
    }
  }
  else {
    countriesRadioModel.value = 'ban'
    selectedCountries.value = []
  }
})

const regionsOptions = computed(() =>
  regions.value.filter(
    ({ code }: RegionInfo) =>
      !selectedCountries.value.some((region: RegionInfo) => region.code === code),
  ),
)

watch([selectedCountries, countriesRadioModel], () => {
  if (!selectedCountries.value)
    return
  const bannedCountries = selectedCountries.value.map(({ code }: RegionInfo) => code)

  if (countriesRadioModel.value === 'ban' || bannedCountries.isEmpty) {
    emits('update:modelValue', bannedCountries)
  }
  else {
    const allowedCountries: Array<string> = regions.value
      .map(({ code }: RegionInfo) => code)
      .filter((code: string) => {
        const [country, region] = code.split('-')

        return region
          ? !bannedCountries.includes(country) && !bannedCountries.includes(code)
          : !hasCountryCode(bannedCountries, country)
      })

    emits('update:modelValue', allowedCountries)
  }
})
</script>

<template>
  <div>
    <hr class="mb-6 mt-0">
    <VBtnToggle
      v-model="countriesRadioModel"
      :disabled="disabled"
      divided
      mandatory
      color="primary"
      variant="outlined"
      :size="VSizes.Small"
      class="select-countries-radio"
    >
      <VBtn
        v-for="({ text, value }) in optionsRadioCountries"
        :key="value"
        :value="value"
        :text="text"
        :disabled="disabled"
      />
    </VBtnToggle>

    <div class="mt-4">
      <VLabel class="mb-1 field-generator-label text-body-2 text-high-emphasis justify-between">
        <span>
          {{ countriesRadioLabel }}
        </span>
      </VLabel>

      <VueSelect
        v-model="selectedCountries"
        multiple
        append-to-body
        :calculate-position="withPopper()"
        :disabled="disabled"
        :options="regionsOptions"
        :placeholder="$t('component.countriesSelect.allowAll')"
        class="select-field"
      >
        <template #open-indicator="{ attributes }">
          <VIcon
            v-bind="attributes"
            :icon="IconsList.ChevronDownIcon"
          />
        </template>
      </VueSelect>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-countries-radio {
  height: 1.75rem;
}
</style>
