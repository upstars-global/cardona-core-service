<template>
  <div class="name-with-id-field white-space-nowrap">
    <div class="name-with-id-field__name">
      <slot>
        <router-link
          v-if="isExistsRoute"
          :to="getUpdateRoute(item)"
          class="d-flex align-items-center"
        >
          {{ itemName }}

          <b-badge v-if="isYou" variant="light-info" class="font-weight-bold ml-25">
            {{ $t('common.you') }}
          </b-badge>
        </router-link>

        <p v-else class="mb-0 text-primary">
          {{ itemName }}
        </p>
      </slot>
    </div>

    <span class="d-flex small">
      <span class="mr-25">ID</span><component :is="currentComponent" :value="itemId"> </component
    ></span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import store from '../../../../store'
import { Location } from 'vue-router'
import CopyField from './CopyField.vue'
import CopyShortField from './CopyShortField.vue'

export default defineComponent({
  name: 'NameWithIdField',
  components: { CopyField, CopyShortField },

  props: {
    item: {
      type: Object,
      required: true,
    },

    getUpdateRoute: {
      type: Function,
      default: () => ({}),
    },

    isShowYou: {
      type: Boolean,
      default: false,
    },

    isShort: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const isYou = computed(() => {
      return props.isShowYou && props.item.id.toString() === store.getters.userInfo.id.toString()
    })
    const isExistsRoute = computed(() => {
      const { name }: Location = props.getUpdateRoute(props.item)

      return !!name
    })
    const itemName = computed<string>(
      () => props.item.name || props.item.userName || props.item.title
    )

    const itemId = computed(() => props.item?.id)

    const currentComponent = computed(() => (props?.isShort ? 'copy-short-field' : 'copy-field'))
    return {
      isYou,
      itemId,
      isExistsRoute,
      itemName,
      currentComponent,
    }
  },
})
</script>
<style lang="scss" scoped>
.name-with-id-field {
  margin-bottom: 1px;
  &__name {
    padding-bottom: 2px;
  }
}
</style>