<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { IconsList } from '@/@model/enums/icons'

const props = defineProps<{
  modalKey: string
  title?: string
  state?: boolean
}>()

const store = useStore()

const isOpenModal = computed(() => props.state !== undefined ? props.state : store.getters['modalsCore/getState'](props.modalKey))

const onCloseModal = event => {
  store.dispatch('modalsCore/setModalState', { modalKey: props.modalKey, data: false })
}
</script>

<template>
  <VDialog
    :model-value="isOpenModal"
    width="auto"
    @update:model-value="onCloseModal"
  >
    <template #default>
      <VCard class="modal-card">
        <div class="modal-header px-2 d-flex align-end justify-space-between">
          <p class="mb-0">
            {{ title }}
          </p>

          <VBtn
            color="white"
            size="30"
            class="modal-header__close"
            @click="onCloseModal"
          >
            <VIcon :icon="IconsList.XIcon" />
          </VBtn>
        </div>
        <slot name="modal-body" />
      </VCard>
    </template>
  </VDialog>
</template>

<style lang="scss" scoped>
.modal-card {
  overflow: visible!important;
}
.modal-header {
  position: relative;
  height: 3rem;
  border-radius: 0.375rem 0.375rem 0 0;

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
