<script setup lang="ts">
import { computed, inject, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { sortBy } from 'lodash'
import type { RegionInfo } from '../@model/regions'
import { VColors, VSizes, VVariants } from '../@model/vuetify'
import { IconsList } from '../@model/enums/icons'
import { withPopper } from '../helpers/selectPopper'
import { ModalsIds } from '../@model/enums/modal'
import { useRegionsStore } from '../stores/regions'
import RemoveModal from './BaseModal/RemoveModal.vue'

const props = defineProps<{
  modelValue: Array<string>
  disabled?: boolean
  allowedOnly?: boolean
  bannedOnly?: boolean
  excludeCountries?: string[]
  customLabel?: string
  customDescription?: string
  required?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'update:type', value: countriesType): void
}>()

const { t } = useI18n()
const collator = new Intl.Collator('en')
const modal = inject('modal')

enum countriesType {
  Ban = 'ban',
  Allow = 'allow',
}
const regionsStore = useRegionsStore()
const selectRef = ref()
const countriesRadioModel = ref(countriesType.Ban)
const selectedCountries = ref([])
const selectedCountriesVisible = ref(new Map())
const regions = ref<Record<string, RegionInfo>>({})

const isCountry = (region: RegionInfo) => region.code === region.countryCode

watch(countriesRadioModel, newValue => {
  emits('update:type', newValue)
})

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

const regionsSet = computed(() => new Set(Object.values(regions.value).map(item => item.code)))
const selectedCountriesList = computed(() => [...selectedCountriesVisible.value.values()].flat(1).map(item => item.code))

onBeforeMount(async () => {
  regions.value = await regionsStore.fetchRegionList({})

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
      const itemData = regions.value[item]
      if (!itemData)
        return

      const countryData = regions.value[itemData.countryCode]
      if (!countryData)
        return

      const key = countryData.name

      if (selectedCountriesVisible.value.has(key)) {
        const existingList: Array<RegionInfo> = selectedCountriesVisible.value.get(key)

        if (!existingList.some(r => r.code === itemData.code)) {
          existingList.push(itemData)
          selectedCountriesVisible.value.set(key, sortBy(existingList, r => r.code))
        }
      }
      else {
        selectedCountriesVisible.value.set(key, [itemData])
      }
    })
  }
  else {
    countriesRadioModel.value = countriesType.Ban
    selectedCountries.value = []
  }

  if (props.allowedOnly)
    countriesRadioModel.value = countriesType.Allow
  else if (props.bannedOnly)
    countriesRadioModel.value = countriesType.Ban
})

const regionsOptions = computed(() => {
  const list = [...regionsSet.value.difference(new Set(selectedCountriesList.value))]

  return list
    .map(code => regions.value[code])
    .filter(region => {
      if (props.excludeCountries?.length)
        return !props.excludeCountries.includes(region.code)

      return true
    })
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
  const key = region.countryName

  if (isCountry(region)) {
    const countryWithRegions = Object.values(regions.value).filter(
      item => item.countryCode === region.code,
    )

    selectedCountriesVisible.value.set(key, sortBy(countryWithRegions, r => r.code))
  }
  else {
    if (selectedCountriesVisible.value.has(key)) {
      const existingRegions = selectedCountriesVisible.value.get(key)

      if (!existingRegions.some((r: RegionInfo) => r.code === region.code)) {
        existingRegions.push(region)
        selectedCountriesVisible.value.set(key, sortBy(existingRegions, r => r.code))
      }
    }
    else {
      const selectedRegions: RegionInfo[] = [region]

      if (countriesRadioModel.value === countriesType.Allow) {
        const countryItem = regions.value[region.countryCode]
        if (countryItem)
          selectedRegions.push(countryItem)
      }

      selectedCountriesVisible.value.set(key, sortBy(selectedRegions, r => r.code))
    }
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

const onConfirmRemoveAll = ({ hide }: { hide: Function }) => {
  selectedCountriesVisible.value.clear()

  hide()

  updateValue()
}

const singleMode = computed(() => props.allowedOnly || props.bannedOnly)

const keyID = Math.random()

defineExpose({
  selectedCountriesVisibleView,
})
</script>

<template>
  <div>
    <div v-if="!singleMode">
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
          class="text-primary"
          :disabled="disabled"
        />
      </VBtnToggle>
    </div>

    <div class="mt-4">
      <div class="mb-1 field-generator-label text-body-2 text-high-emphasis d-flex justify-space-between align-baseline">
        <span :class="{ required }">
          {{ customLabel ? customLabel : countriesRadioLabel }}
        </span>

        <VBtn
          v-if="selectedCountriesVisible.size"
          :color="VColors.Error"
          :variant="VVariants.Tonal"
          :size="VSizes.Small"
          :disabled="disabled"
          @click="modal.showModal(ModalsIds.RemoveAllCountries + keyID)"
        >
          <VIcon :icon="IconsList.PlaylistX" />

          {{ $t('action.removeAll') }}
        </VBtn>
      </div>

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

    <span
      v-if="!required"
      class="text-sm text-color-mute mt-1"
    >
      {{ customDescription || $t('component.countriesSelect.description') }}
    </span>

    <div
      v-if="selectedCountriesVisible.size"
      class="selected-coutries pa-3 mt-3"
    >
      <PerfectScrollbar
        class="scroll-area"
        :options="{ wheelPropagation: false, suppressScrollX: true }"
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
              :key="`${key}_${region.code}`"
              :closable="!disabled"
              :disabled="disabled"
              label
              :color="isCountry(region) ? VColors.Error : VColors.Primary"
              :class="{ 'order-1': isCountry(region) }"
              @click:close="onDeleteRegion(key, index, region.code, region.countryCode)"
            >
              {{ isCountry(region) ? `${$t('action.remove')} ${region.label}` : region.label }}
            </VChip>
          </div>
        </div>
      </PerfectScrollbar>
    </div>

    <RemoveModal
      :remove-modal-id="ModalsIds.RemoveAllCountries + keyID"
      :title="$t('component.countriesSelect.removeAllModal.title')"
      :description="$t('component.countriesSelect.removeAllModal.description')"
      @on-click-modal-ok="onConfirmRemoveAll"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@styles/variables/_vuetify";

.select-countries-radio {
  height: 1.75rem;
  border-color: rgba(var(--v-theme-primary));
  .v-btn {
    font-size: $typography-body-2-font-size !important;
    font-weight: 500 !important;
    border-right-color: rgba(var(--v-theme-primary));
  }
}

.selected-coutries {
  border: 1px solid rgb(var(--v-theme-grey-200));
  border-radius: 6px;
}
.scroll-area {
  max-height: 30rem;
  transition: max-height 1s;
}

:deep(.v-chip--disabled) {
  color: rgba(var(--v-theme-grey-500)) !important;
  opacity: 1;
}

.required:after {
  content: "*";
  color: rgb(var(--v-theme-error));
  margin-left: 0.25rem;
}
</style>
