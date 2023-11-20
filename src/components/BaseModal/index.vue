<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
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

const props = withDefaults(defineProps<Props>(), { title: '' })

const emits = defineEmits<Emits>()

const modal = inject('modal')

const showModal = ref(false)

const show = () => {
  showModal.value = true
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
    width="auto"
    @update:modelValue="onHide"
  >
    <template #default>
      <VCard class="modal-card">
        <div
          class="modal-header with-absolute px-2 d-flex align-end justify-space-between"
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
        <slot :action="{ show, hide }" />
      </VCard>
    </template>
  </VDialog>
</template>

<style scoped lang="scss">
.without-header-title {
  position: absolute;
  right: 0;
}
.modal-header {
  .modal-header__close {
    margin-top: .5rem;
  &:hover {
    transform: translate(-3px, 5px);
  }
}
}
</style>
