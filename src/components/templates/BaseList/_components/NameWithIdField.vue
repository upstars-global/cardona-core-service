<template>
  <div class="white-space-nowrap">
    <router-link v-if="isExistsRoute" :to="getUpdateRoute(item)" class="d-flex align-items-center">
      {{ itemName }}

      <b-badge v-if="isYou" variant="light-info" class="font-weight-bold ml-25">
        {{ $t('common.you') }}
      </b-badge>
    </router-link>

    <p v-else class="mb-0 text-primary">
      {{ itemName }}
    </p>

    <small> ID {{ item.id }} </small>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import store from '../../../../store'
import { Location } from 'vue-router'

export default defineComponent({
  name: 'NameWithIdField',

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

    return {
      isYou,
      isExistsRoute,
      itemName,
    }
  },
})
</script>
