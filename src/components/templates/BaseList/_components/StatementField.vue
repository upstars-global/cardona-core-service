<template>
  <b-badge class="custom-badge" :variant="badgeVariant"> {{ badgeLabel }} </b-badge>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useUtils as useI18nUtils } from '../../../../@core/libs/i18n'

export default defineComponent({
  name: 'StatementField',

  props: {
    state: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const { t } = useI18nUtils()
    const badgeVariant = computed(() => (props.state ? 'light-success' : 'light-danger'))
    const badgeLabel = computed(() => (props.state ? t('common.yes') : t('common.no')))

    return {
      badgeVariant,
      badgeLabel,
    }
  },
})
</script>

<style lang="scss" scoped>
.custom-badge::v-deep {
  &.badge {
    font-size: 0.9rem;
    font-weight: 600;
  }
}
</style>
