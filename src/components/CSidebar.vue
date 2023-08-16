<script setup lang="ts">
import i18n from '../libs/i18n'

const props = withDefaults(
  defineProps<{
    id: string
    title: string
    okVariant?: string
    okTitle?: string
    okDisabled?: boolean
    cancelVariant?: string
    cancelTitle?: string
  }>(),
  {
    okVariant: 'primary',
    okTitle: i18n.t('action.save') as string,
    cancelVariant: 'outline-secondary',
    cancelTitle: i18n.t('action.cancel') as string,
  }
)

const emit = defineEmits<{
  (event: 'ok', hide: Function): void
  (event: 'hidden'): void
}>()

const onClickOk = (hide: Function) => emit('ok', hide)
const onHidden = () => emit('hidden')
</script>

<template>
  <b-sidebar
    :id="id"
    bg-variant="white"
    shadow
    backdrop
    right
    class="c-sidebar"
    header-class="px-2 py-75"
    body-class="p-2"
    sidebar-class="sidebar-lg"
    lazy
    @hidden="onHidden"
  >
    <template #header="{ hide }">
      <div class="d-flex justify-content-between align-items-center w-100">
        <p class="font-small-4 font-weight-bolder mb-0">
          {{ title }}
        </p>

        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="21" @click="hide" />
      </div>
    </template>

    <template #default="{ hide }">
      <slot :hide="hide" />
    </template>

    <template #footer="{ hide }">
      <div class="d-flex justify-content-end py-1 px-2 border-top">
        <b-button :variant="cancelVariant" class="mr-2" @click="hide">
          {{ cancelTitle }}
        </b-button>

        <b-button :variant="okVariant" :disabled="okDisabled" @click="onClickOk(hide)">
          {{ okTitle }}
        </b-button>
      </div>
    </template>
  </b-sidebar>
</template>

<style lang="scss" scoped>
@import '../@core/scss/base/bootstrap-extended/_variables.scss';
@import '../@core/scss/base/components/_variables-dark.scss';

.c-sidebar {
  :deep(.b-sidebar-header) {
    background-color: $body-bg;
  }
}

body.dark-layout {
  .c-sidebar {
    :deep(.b-sidebar-header) {
      background: $theme-dark-body-bg;
      color: $white;
    }
  }
}
</style>
