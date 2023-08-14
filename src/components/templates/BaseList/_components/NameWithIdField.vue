<template>
  <div class="white-space-nowrap">
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

    <copy-field :value="itemId">
      <small> ID {{ itemId }} </small>
    </copy-field>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import store from '../../../../store'
import { Location } from 'vue-router'
import CopyField from './CopyField.vue'

export default {
  name: 'NameWithIdField',
  components: { CopyField },

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

    return {
      isYou,
      itemId,
      isExistsRoute,
      itemName,
    }
  },
}
</script>
