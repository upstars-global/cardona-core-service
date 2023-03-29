<template>
  <div>
    <hr class="mb-2 mt-0" />

    <b-form-radio-group
      v-model="countriesRadioModel"
      button-variant="outline-primary"
      :options="optionsRadioCountries"
      buttons
      :disabled="disabled"
      class="mb-1"
      size="sm"
    />

    <b-form-group
      v-if="countriesRadioModel"
      :label="countriesRadioLabel"
      label-for="forbiddenCountries"
      class="mb-0"
    >
      <v-select
        v-model="selectedCountries"
        :dir="$store.getters['appConfig/dirOption']"
        multiple
        :disabled="disabled"
        :options="regionsOptions"
        :placeholder="selectedCountriesPlaceholder"
        class="countries-select"
      />
    </b-form-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import store from '../store'
import i18n from '../libs/i18n'
import { RegionInfo } from '../@model/regions'

export default defineComponent({
  name: 'CountriesSelect',
  props: {
    value: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const countriesRadioModel = ref('')
    const selectedCountries = ref()
    const regions = ref<Array<RegionInfo>>([])

    const optionsRadioCountries = computed(() => [
      { text: i18n.t('component.countriesSelect.banInCountries'), value: 'ban' },
      { text: i18n.t('component.countriesSelect.allowInCountries'), value: 'allow' },
    ])

    const countriesRadioLabel = computed(() => {
      const radioLabels = {
        allow: i18n.t('component.countriesSelect.allowedCountries'),
        ban: i18n.t('component.countriesSelect.bannedCountries'),
      }

      return radioLabels[countriesRadioModel.value]
    })

    const selectedCountriesPlaceholder = computed(() => {
      const selectedCountriesPlaceholders = {
        allow: i18n.t('component.countriesSelect.banAll'),
        ban: i18n.t('component.countriesSelect.allowAll'),
      }

      return selectedCountriesPlaceholders[countriesRadioModel.value]
    })

    onMounted(async () => {
      regions.value = await store.dispatch('regions/fetchRegionList')

      if (props.value.isNotEmpty) {
        const formRestrictedCountries: Array<RegionInfo> = regions.value.filter(
          ({ code }: RegionInfo) => props.value?.includes(code)
        )

        if (formRestrictedCountries.length > regions.value.length / 2) {
          countriesRadioModel.value = 'allow'
          selectedCountries.value = regions.value.filter(
            ({ code }: RegionInfo) => !props.value.includes(code)
          )
        } else {
          countriesRadioModel.value = 'ban'
          selectedCountries.value = formRestrictedCountries
        }
      } else {
        countriesRadioModel.value = 'ban'
        selectedCountries.value = []
      }
    })

    const regionsOptions = computed(() =>
      regions.value.filter(
        ({ code }: RegionInfo) =>
          !selectedCountries.value.some((region: RegionInfo) => region.code === code)
      )
    )

    watch([selectedCountries, countriesRadioModel], () => {
      const bannedCountries: Array<string> = selectedCountries.value.map(
        ({ code }: RegionInfo) => code
      )

      if (countriesRadioModel.value === 'ban') {
        emit('input', bannedCountries)
      } else {
        const allowedCountries: Array<string> = regions.value
          .map(({ code }: RegionInfo) => code)
          .filter((code: string) => {
            const [country, region]: Array<string> = code.split('-')

            return region
              ? !bannedCountries.includes(country) && !bannedCountries.includes(code)
              : !bannedCountries.some((bannedCode: string) => bannedCode.includes(country))
          })

        emit('input', allowedCountries)
      }
    })

    return {
      countriesRadioModel,
      selectedCountries,
      optionsRadioCountries,
      countriesRadioLabel,
      selectedCountriesPlaceholder,
      regionsOptions,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../@core/scss/base/bootstrap-extended/_variables.scss';
@import '../assets/scss/style.scss';

.countries-select::v-deep {
  .vs__selected,
  .vs__dropdown-option--selected {
    background-color: $bg-light-purple;
    color: $purple;
    font-weight: 500;
  }
}
</style>
