<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import CopyField from '../../../../../components/templates/BaseList/_components/fields/CopyField.vue'
import CopyShortField from '../../../../../components/templates/BaseList/_components/fields/CopyShortField.vue'
import { VColors } from '../../../../../@model/vuetify'
import { IconsList } from '../../../../../@model/enums/icons'
import { copyToClipboard } from '../../../../../helpers/clipboard'

const props = defineProps<{
  item: Record<string, any>
  getUpdateRoute?: (item: Record<string, any>) => Location
  getDetailsRoute?: (item: Record<string, any>) => Location
  isShowYou?: boolean
  isShort?: boolean
}>()

const store = useStore()

const isYou = computed(() => props.isShowYou && props.item.id.toString() === store.getters.userInfo.id.toString())

const itemName = computed<string>(() => props.item.name || props.item.userName || props.item.title)

const itemId = computed(() => props.item?.id)

const currentComponent = computed(() => (props?.isShort ? CopyShortField : CopyField))

const routePath = computed((): Location | Record<string, never> => {
  if (props.getDetailsRoute?.(props.item)?.name)
    return props.getDetailsRoute?.(props.item)

  if (props.getUpdateRoute?.(props.item)?.name)
    return props.getUpdateRoute?.(props.item)

  return {}
})
</script>

<template>
  <div class="name-with-id-field white-space-nowrap">
    <div class="name-with-id-field__name">
      <slot>
        <div class="d-flex align-center">
          <RouterLink
            v-if="routePath?.name"
            :to="routePath"
            class="d-flex align-center"
            data-test-id="link"
            @click.stop
          >
            {{ itemName }}

            <VChip
              v-if="isYou"
              :color="VColors.Info"
              label
              class="font-weight-semi-bold ml-1"
              data-test-id="badge-you"
            >
              {{ $t('common.you') }}
            </VChip>
          </RouterLink>

          <p
            v-else
            class="mb-0 text-primary"
            data-test-id="name"
          >
            {{ itemName }}
          </p>

          <VIcon
            :icon="IconsList.CopyIcon"
            class="text-color-mute ml-1 cursor-pointer"
            size="16"
            @click.stop="copyToClipboard(itemName)"
          />
        </div>
      </slot>
    </div>

    <span class="d-flex small text-body-2 text-medium-emphasis">
      <span class="mr-1">ID</span>
      <Component
        :is="currentComponent"
        data-test-id="copy-field"
        :value="itemId?.toString() || ''"
      />
    </span>
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
