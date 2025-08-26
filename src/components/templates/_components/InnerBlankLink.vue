<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { LinkViewValue } from '../../../@model/view'
import { IconsList } from '../../../@model/enums/icons'
import { VSizes } from '../../../@model/vuetify'
import { copyToClipboard } from '../../../helpers/clipboard'

interface Props {
  value: LinkViewValue
  size?: VSizes
  copyElement?: string
}

const props = withDefaults(
  defineProps<Props>(),
  {
    size: VSizes.Medium,
  },
)

const router = useRouter()

const linkSizeClass = computed(() => {
  switch (props.size) {
    case VSizes.Large: return 'text-h5'
    case VSizes.Medium: return 'text-body-1'
    case VSizes.Small: return 'text-body-2'
    default: return ''
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case VSizes.Large: return VSizes.Medium
    case VSizes.Medium: return VSizes.Small
    case VSizes.Small: return VSizes.XSmall
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
    class="d-flex align-center text-primary cursor-pointer"
    :class="linkSizeClass"
  >
    <span class="link-title">
      <slot
        name="title"
        :action="{ openLink: onClickLink, copy: copyToClipboard }"
      >
        {{ value.title }}
      </slot>
    </span>

    <VIcon
      data-test-id="icon-link"
      :icon="IconsList.ExternalLinkIcon"
      :size="iconSize"
      @click.stop="onClickLink"
    />

    <VIcon
      v-if="copyElement"
      class="text-color-mute ml-2"
      data-test-id="icon-copy"
      :icon="IconsList.CopyIcon"
      :size="iconSize"
      @click.stop="copyToClipboard(copyElement)"
    />
  </div>
</template>

<style lang="scss" scoped>
.link-title {
  margin-right: 0.25rem;
}
</style>
