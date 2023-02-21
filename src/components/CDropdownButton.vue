<script lang="ts">
export default {
  name: 'CDropdownButton',
}
</script>

<script lang="ts" setup>
import { getters } from '@/store'
import { CDropdownItems, Ripple } from '@model/cDropdownButton'

const props = withDefaults(
  defineProps<{
    items: Array<CDropdownItems>
    label: string
    variant: keyof typeof Ripple
    size?: string
    icon?: string
  }>(),
  {
    size: 'md',
    variant: 'primary',
    icon: '',
  }
)

const checkCanView = (permission: string): boolean =>
  permission ? getters.abilityCan(permission, 'view') : true
</script>

<template>
  <b-dropdown v-ripple.400="Ripple[variant]" right :variant="variant" :size="size">
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


