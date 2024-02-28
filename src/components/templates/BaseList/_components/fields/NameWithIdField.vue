<script setup lang="ts">
import { computed } from 'vue'
import type { _RouteLocationBase } from 'vue-router'
import store from '../../../../../store'
import CopyField from '../../../../../components/templates/BaseList/_components/fields/CopyField.vue'
import CopyShortField from '../../../../../components/templates/BaseList/_components/fields/CopyShortField.vue'

const props = defineProps<{
  item: Record<string, any>
  getUpdateRoute?: (item: Record<string, any>) => Location
  isShowYou?: boolean
  isShort?: boolean
}>()

const isYou = computed(() => {
  return props.isShowYou && props.item.id.toString() === store.getters.userInfo.id.toString()
})

const isExistsRoute = computed(() => {
  const { name }: _RouteLocationBase = props.getUpdateRoute(props.item)

  return !!name
})

const itemName = computed<string>(
  () => props.item.name || props.item.userName || props.item.title,
)

const itemId = computed(() => props.item?.id)

const currentComponent = computed(() => (props?.isShort ? CopyShortField : CopyField))
</script>

<template>
  <div class="name-with-id-field white-space-nowrap">
    <div class="name-with-id-field__name">
      <slot>
        <RouterLink
          v-if="isExistsRoute"
          :to="getUpdateRoute(item)"
          class="d-flex align-center"
          @click.stop
        >
          {{ itemName }}

          <VChip
            v-if="isYou"
            variant="light-info"
            class="font-weight-bold ml-25"
          >
            {{ $t('common.you') }}
          </VChip>
        </RouterLink>

        <p
          v-else
          class="mb-0 text-primary"
        >
          {{ itemName }}
        </p>
      </slot>
    </div>

    <span class="d-flex small">
      <span class="mr-1">ID</span>
      <Component
        :is="currentComponent"
        :value="itemId"
      /></span>
  </div>
</template>

<style lang="scss" scoped>
.name-with-id-field {
  margin-bottom: 1px;
  &__name {
    padding-bottom: 2px;
  }
}
</style>
