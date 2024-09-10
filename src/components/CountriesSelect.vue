<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { sortBy } from 'lodash'
import type { RegionInfo } from '../@model/regions'
import { VColors, VSizes } from '../@model/vuetify'
import { IconsList } from '../@model/enums/icons'
import { withPopper } from '../helpers/selectPopper'

const props = defineProps<{
  modelValue: Array<string>
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const { t } = useI18n()
const store = useStore()
const collator = new Intl.Collator('en')

enum countriesType {
  Ban = 'ban',
  Allow = 'allow',
}
const selectRef = ref()
const countriesRadioModel = ref(countriesType.Ban)
const selectedCountries = ref([])
const selectedCountriesVisible = ref(new Map())
const regions = ref({})

const selectedCountriesVisibleView = computed(() => Object.values([...selectedCountriesVisible.value]).sort(([country1], [country2]) => collator.compare(country1, country2)))

const optionsRadioCountries = computed(() => [
  { text: t('component.countriesSelect.banInCountries'), value: countriesType.Ban },
  { text: t('component.countriesSelect.allowInCountries'), value: countriesType.Allow },
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

const regionsSet = computed(() => new Set(Object.values(regions.value).map(item => item.code)))
const selectedCountriesList = computed(() => [...selectedCountriesVisible.value.values()].flat(1).map(item => item.code))

onBeforeMount(async () => {
  regions.value = await store.dispatch('regions/fetchRegionList')

  if (props.modelValue.isNotEmpty) {
    let list = props.modelValue
    if (props.modelValue.length > Object.keys(regions.value).length / 2) {
      countriesRadioModel.value = countriesType.Allow
      list = Array.from(regionsSet.value.difference(new Set(props.modelValue)))
    }
    else {
      countriesRadioModel.value = countriesType.Ban
    }
    list.forEach(item => {
      const [country, region] = item.split('-')

      if (selectedCountriesVisible.value.has(regions.value[country].name) && region) {
        const list: Array<string> = selectedCountriesVisible.value.get(regions.value[country].name)

        list.push(regions.value[item])
        selectedCountriesVisible.value.set(regions.value[country].name, list)
      }
      else {
        selectedCountriesVisible.value.set(regions.value[country].name, [regions.value[item]])
      }
    })
  }
  else {
    countriesRadioModel.value = countriesType.Ban
    selectedCountries.value = []
  }
})

const regionsOptions = computed(() => {
  const list = [...regionsSet.value.difference(new Set(selectedCountriesList.value))]

  return list.map(code => regions.value[code])
})

watch(() => countriesRadioModel.value, () => {
  updateValue()
})

const updateValue = () => {
  const bannedCountries = [...selectedCountriesVisible.value.values()].flat(1).map(item => item.code)

  if (countriesRadioModel.value === countriesType.Ban || bannedCountries.isEmpty)
    emits('update:modelValue', bannedCountries)

  else
    emits('update:modelValue', Array.from(regionsSet.value.difference(new Set(bannedCountries))))
}

const onSelectItem = (region: RegionInfo) => {
  if (selectedCountriesVisible.value.has(region.countryName || region.name)) {
    const regions = selectedCountriesVisible.value.get(region.countryName || region.name)

    regions.push(region)
    selectedCountriesVisible.value.set(region.countryName || region.name, sortBy(regions, item => item.code))
  }
  else {
    let selectedRegions = []
    if (region.countryName)
      selectedRegions = [region]
    else
      selectedRegions = Object.values(regions.value).filter(item => item.countryCode === region.countryCode)

    selectedCountriesVisible.value.set(region.countryName || region.name, selectedRegions)
  }
  selectRef.value.clearSelection()
  updateValue()
}

const onDeleteRegion = (key: string, index: number, code: string, countryCode: string) => {
  if (code === countryCode) {
    selectedCountriesVisible.value.delete(key)
  }
  else {
    const list = Array.from(selectedCountriesVisible.value.get(key))
    if (list.length === 1)
      selectedCountriesVisible.value.delete(key)
    else
      selectedCountriesVisible.value.set(key, list.toSpliced(index, 1))
  }

  updateValue()
}
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
        ref="selectRef"
        append-to-body
        :calculate-position="withPopper()"
        :disabled="disabled"
        :options="regionsOptions"
        :placeholder="$t('component.countriesSelect.placeholder')"
        class="select-field"
        @option:selected="onSelectItem"
      >
        <template #open-indicator="{ attributes }">
          <VIcon
            v-bind="attributes"
            :icon="IconsList.ChevronDownIcon"
          />
        </template>
      </VueSelect>
    </div>

    <span class="text-sm text-secondary mt-1">
      {{ $t('component.countriesSelect.description') }}
    </span>

    <div
      v-if="selectedCountriesVisible.size"
      class="selected-coutries pa-3 mt-3"
    >
      <PerfectScrollbar
        class="scroll-area"
        :options="{ wheelPropagation: false }"
      >
        <div
          v-for="[key, value] in selectedCountriesVisibleView"
          :key="key"
          class="mb-2"
        >
          <div class="d-flex flex-wrap gap-2">
            <p class="text-body-1 mb-0">
              {{ key }}:
            </p>
            <VChip
              v-for="(region, index) in value"
              :key="`${key}_${region.name}`"
              closable
              label
              :color="region.code === region.countryCode ? VColors.Error : VColors.Primary"
              :class="{ 'order-1': region.code === region.countryCode }"
              @click:close="onDeleteRegion(key, index, region.code, region.countryCode)"
            >
              {{ region.code === region.countryCode ? `${$t('action.remove')} ${region.label}` : region.label }}
            </VChip>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-countries-radio {
  height: 1.75rem;
}

.selected-coutries {
  border: 1px solid rgb(var(--v-theme-grey-200));
  border-radius: 6px;
}
.scroll-area {
  max-height: 30rem;
  transition: max-height 1s;
}
</style>
