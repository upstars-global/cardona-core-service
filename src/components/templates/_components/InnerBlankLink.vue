<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { LinkViewValue } from '../../../@model/view'
import { IconsList } from '../../../@model/enums/icons'
import { VSizes } from '../../../@model/vuetify'

const props = withDefaults(
  defineProps<{
    value: LinkViewValue
    size?: VSizes
  }>(),
  {
    size: VSizes.Medium,
  },
)

const router = useRouter()

const linkSizeClass = computed(() => {
  switch (props.size) {
    case VSizes.Large: return 'text-h4'
    case VSizes.Small: return 'text-subtitle-1'
    default: return ''
  }
})

const onClickLink = () => {
  const route = router.resolve(props.value.route!)

  window.open(route.href, '_blank')
}
</script>

<template>
  <div
    class="d-flex align-center text-primary font-weight-bold cursor-pointer"
    :class="linkSizeClass"
    @click="onClickLink"
  >
    <span class="link-title">
      {{ value.title }}
    </span>

    <VIcon
      :icon="IconsList.ExternalLinkIcon"
      :size="size"
    />
  </div>
</template>

<style lang="scss" scoped>
.link-title {
  margin-right: 0.25rem;
}
</style>
