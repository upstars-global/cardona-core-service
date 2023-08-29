<script lang="ts">
export default {
  name: 'CDropdownButton',
}
</script>

<script lang="ts" setup>
import store from '../store'
import { CDropdownItems } from '../@model/cDropdownButton'
import { BVariant, BVariants } from '../@model/bootstrap'
import { IconsList } from '../@model/enums/icons'

const props = withDefaults(
  defineProps<{
    items: Array<CDropdownItems>
    label: string
    variant: BVariant
    size?: string
    icon?: IconsList
  }>(),
  {
    size: 'md',
    variant: BVariants.Primary,
    icon: '',
  }
)

const checkCanView = (permission: string): boolean =>
  permission ? store.getters.abilityCan(permission, 'view') : true
</script>

<template>
  <b-dropdown right :variant="variant" :size="size">
    <template #button-content>
      <feather-icon v-if="icon" :icon="icon" />

      <span class="ml-50">
        {{ label }}
      </span>
    </template>

    <template #default>
      <template v-for="item in items">
        <b-dropdown-item
          v-if="checkCanView(item.permission)"
          :key="item.name"
          v-b-modal="item.modalId"
          :disabled="item.disabled"
        >
          <div class="d-flex align-items-center">
            <feather-icon v-if="item.icon" :icon="item.icon" class="mr-50" />

            <span>
              {{ item.name }}
            </span>
          </div>
        </b-dropdown-item>
      </template>
    </template>
  </b-dropdown>
</template>

<style lang="scss" scoped>
</style>


