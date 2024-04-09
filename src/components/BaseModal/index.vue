<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { IconsList } from '../../@model/enums/icons'

interface Props {
  id: string
  title?: string | TranslateResult
  state?: boolean
}

interface Emits {
  (event: 'show'): void
  (event: 'hide'): void
}
defineOptions({ name: 'BaseModal' })

const props = withDefaults(defineProps<Props>(), { title: '' })

const emits = defineEmits<Emits>()

const attrs = useAttrs()

const modal = inject('modal')

const showModal = ref(false)
const payload = ref(null)

const title = computed(() => payload.value?.title || props.title)

const show = payloadData => {
  showModal.value = true
  payload.value = payloadData
  emits('show')
}

const hide = () => {
  showModal.value = false
  emits('hide')
}

onMounted(() => {
  modal.registerModal(props.id, { show, hide, showModal })
})

onBeforeUnmount(() => {
  modal.unregisterModal(props.id)
})

const onHide = (value: boolean) => {
  if (!value)
    emits('hide')
}
</script>

<template>
  <VDialog
    v-model="showModal"
    class="base-modal"
    V-bind="attrs"
    @update:model-value="onHide"
  >
    <template #default>
      <VCard class="modal-card">
        <div
          class="modal-header with-absolute px-6 py-3 d-flex align-end justify-space-between"
          :class="{
            'without-header-title': !title,
          }"
        >
          <p
            v-if="title"
            class="mb-0"
          >
            {{ title }}
          </p>
          <VBtn
            color="white"
            size="30"
            class="modal-header__close"
            @click="hide"
          >
            <VIcon :icon="IconsList.XIcon" />
          </VBtn>
        </div>
        <slot
          :action="{ show, hide }"
          :payload="payload"
        />
      </VCard>
    </template>
  </VDialog>
</template>

<style lang="scss" scoped>
.modal-card {
  overflow: visible !important;
}
.modal-header {
  position: relative;
  border-radius: 0.375rem 0.375rem 0 0;
  min-width: initial;

  &__close {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(8px,-2px);

    &:hover {
      transform: translate(5px,3px);
    }
  }
}
</style>
