<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from '../../../@core/utils/utils'
import { BSize } from '../../../@model/bootstrap'
import { LinkViewValue } from '../../../@model/view'
import { IconsList } from '../../../@model/enums/icons'
import { copyToClipboard } from '../../../helpers/clipboard'

interface Props {
  value: LinkViewValue
  size?: BSize
  copyElement?: string
}

const { router } = useRouter()

const props = withDefaults(defineProps<Props>(), {
  size: BSize.Md,
})
const linkSizeClass = computed(() => `size-${props.size}`)
const iconSize = computed(() =>
  props.size === BSize.Xl ? '16' : props.size === BSize.Sm ? '12' : '14'
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
  >
    <span class="link-title">
      {{ value.title }}
    </span>

    <feather-icon
      :icon="IconsList.ExternalLinkIcon"
      class="mr-0"
      :size="iconSize"
      @click.stop="onClickLink"
    />

    <feather-icon
      v-if="copyElement"
      :icon="IconsList.CopyIcon"
      class="ml-25"
      :size="iconSize"
      @click.stop="copyToClipboard(copyElement)"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '../../../@core/scss/base/bootstrap-extended/_include';

.link-title {
  margin-right: 0.25rem;
}

.size {
  &-sm {
    .link-title {
      font-size: $small-font-size;
    }
  }

  &-xl {
    .link-title {
      font-size: $h3-font-size;
      margin-right: 0.5rem;
    }
  }
}
</style>
