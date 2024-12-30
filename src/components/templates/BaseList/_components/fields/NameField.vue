<script setup lang="ts">
import { computed } from 'vue'
import type { _RouteLocationBase } from 'vue-router'

const props = defineProps<{
  item: Record<string, any>
  getUpdateRoute?: (item: Record<string, any>) => Location
  isShowYou?: boolean
  isShort?: boolean
}>()

const isExistsRoute = computed(() => {
  if (!props?.getUpdateRoute)
    return false
  const { name }: _RouteLocationBase = props?.getUpdateRoute(props.item)

  return !!name
})

const itemName = computed<string>(
  () => props.item.name || props.item.userName || props.item.title,
)
</script>

<template>
  <div class="name-with-id-field white-space-nowrap">
    <div class="name-with-id-field__name">
      <slot>
        <RouterLink
          v-if="isExistsRoute"
          :to="getUpdateRoute(item)"
          class="d-flex align-center"
          data-test-id="link"
          @click.stop
        >
          {{ itemName }}
        </RouterLink>

        <p
          v-else
          class="mb-0 text-primary"
          data-test-id="name"
        >
          {{ itemName }}
        </p>
      </slot>
    </div>
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
