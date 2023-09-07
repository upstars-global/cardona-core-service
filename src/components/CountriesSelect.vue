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
        v-model="selectedCountriesByRadio[countriesRadioModel]"
        :dir="$store.getters['appConfigCore/dirOption']"
        multiple
        :disabled="disabled"
        :options="regionsOptions"
        :placeholder="selectedCountriesPlaceholder"
        class="countries-select"
        @input="onSelectCountry"
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
    allowedCountries: {
      type: Array,
      default: () => [],
    },
    restrictedCountries: {
      type: Array,
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
    const selectedCountriesByRadio = ref({ ban: [], allow: [] })

    console.log({ props })

    // watch(props, () => {
    //   if (selectedCountriesByRadio.value.ban.isEmpty) {
    //     selectedCountriesByRadio.value.ban = props.restrictedCountries;
    //   }
    //   if (selectedCountriesByRadio.value.allow.isEmpty) {
    //     selectedCountriesByRadio.value.allow = props.allowedCountries;
    //   }
    // }, { deep: true })

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

    const hasCountryCode = (codeList: string[], countryCode: string): boolean => {
      return codeList.some((code) => {
        const [country] = code.split('-')

        return country === countryCode
      })
    }

    onMounted(async () => {
      regions.value = await store.dispatch('regions/fetchRegionList')
      // const formRestrictedCountries: Array<RegionInfo> = regions.value.filter(
      //     ({ code }: RegionInfo) => props.restrictedCountries?.includes(code)
      // )
      // selectedCountriesByRadio.value.ban = formRestrictedCountries
      // console.log(selectedCountriesByRadio.value.ban)
      selectedCountriesByRadio.value.ban = regions.value.filter(({ code }: RegionInfo) =>
        props.restrictedCountries?.includes(code)
      )
      selectedCountriesByRadio.value.allow = regions.value.filter(({ code }: RegionInfo) =>
        props.allowedCountries?.includes(code)
      )
      if (props.value.isNotEmpty) {
        const formRestrictedCountries: Array<RegionInfo> = regions.value.filter(
          ({ code }: RegionInfo) => props.value?.includes(code)
        )

        if (formRestrictedCountries.length > regions.value.length / 2) {
          countriesRadioModel.value = 'allow'
          selectedCountries.value = regions.value.filter(({ code }: RegionInfo) => {
            const [country, region] = code.split('-')

            return region ? !props.value.includes(code) : !hasCountryCode(props.value, country)
          })
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

    watch([props.allowedCountries, props.restrictedCountries], () => {
      console.log(props.allowedCountries, props.restrictedCountries)
      // const bannedCountries = selectedCountries.value.map(({ code }: RegionInfo) => code)
      //
      // if (countriesRadioModel.value === 'ban') {
      //   emit('update:restrictedCountries', bannedCountries)
      // } else {
      //   const allowedCountries: Array<string> = regions.value
      //       .map(({ code }: RegionInfo) => code)
      //       .filter((code: string) => {
      //         const [country, region] = code.split('-')
      //
      //         return region
      //             ? !bannedCountries.includes(country) && !bannedCountries.includes(code)
      //             : !hasCountryCode(bannedCountries, country)
      //       })
      //
      //   emit('update:allowedCountries', allowedCountries)
      // }
    })

    const typeCountriesByRadio = computed(() =>
      countriesRadioModel.value === 'ban' ? 'restrictedCountries' : 'allowedCountries'
    )

    const onSelectCountry = (value) => {
      const event = `update:${typeCountriesByRadio.value}`
      emit(
        event,
        value.map(({ code }) => code)
      )
    }

    return {
      countriesRadioModel,
      selectedCountries,
      optionsRadioCountries,
      countriesRadioLabel,
      selectedCountriesPlaceholder,
      regionsOptions,
      onSelectCountry,
      selectedCountriesByRadio,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../@core/scss/base/bootstrap-extended/_variables.scss';
@import '../assets/scss/style.scss';

.countries-select {
  .vs__selected,
  :deep(.vs__dropdown-option--selected) {
    background-color: $bg-light-purple;
    color: $purple;
    font-weight: 500;
  }
}
</style>