<template>
  <b-input-group class="input-group-merge search">
    <b-input-group-prepend is-text>
      <feather-icon icon="SearchIcon" />
    </b-input-group-prepend>

    <b-form-input
      v-model.trim="searchModel"
      :placeholder="placeholder"
      debounce="500"
      :size="size"
      autocomplete="off"
    />
  </b-input-group>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import i18n from '../../../../libs/i18n'

export default defineComponent({
  name: 'SearchInput',

  props: {
    value: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      default: 'md',
    },

    placeholder: {
      type: String,
      default: () => i18n.t('placeholder.search._'),
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const searchModel = computed({
      get: () => props.value,
      set: (val) => emit('input', val),
    })

    return {
      searchModel,
    }
  },
})
</script>
