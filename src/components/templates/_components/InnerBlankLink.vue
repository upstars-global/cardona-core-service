<script setup lang="ts">
import { computed } from 'vue'
import { BSize } from '../../../@model/bootstrap'
import type { LinkViewValue } from '../../../@model/view'
import { IconsList } from '../../../@model/enums/icons'

const props = withDefaults(
  defineProps<{
    value: LinkViewValue
    size?: BSize
  }>(),
  {
    size: BSize.Md,
  },
)

const { router } = useRouter()

const linkSizeClass = computed(() => `size-${props.size}`)

const iconSize = computed(() =>
  props.size === BSize.Xl ? '16' : props.size === BSize.Sm ? '12' : '14', // TODO: refactor sizes
)

const onClickLink = () => {
  const route = router.resolve(props.value.route!)

  window.open(route.href, '_blank')
}
</script>

<template>
  <div
    class="d-flex align-items-center text-primary font-weight-bold cursor-pointer"
    :class="linkSizeClass"
    @click="onClickLink"
  >
    <span class="link-title">
      {{ value.title }}
    </span>

    <VIcon
      :icon="IconsList.ExternalLinkIcon"
      class="mr-0"
      :size="iconSize"
    />
  </div>
</template>

<style lang="scss" scoped>
.link-title {
  margin-right: 0.25rem;
}
</style>
