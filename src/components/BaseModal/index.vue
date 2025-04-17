<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { IconsList } from '../../@model/enums/icons'
import { ModalSizes, VColors, VVariants } from '../../@model/vuetify'
import { IS_TEST_ENV } from '../../utils/constants'

interface Props {
  id: string
  title?: string | TranslateResult
  state?: boolean
  width?: string
  size?: ModalSizes
  modalHeaderClass?: string
}

interface Emits {
  (event: 'show'): void
  (event: 'hide'): void
}
defineOptions({ name: 'BaseModal' })

const props = withDefaults(defineProps<Props>(), { title: '', width: '', size: ModalSizes.Small, modalHeaderClass: '' })

const emits = defineEmits<Emits>()

const attrs = useAttrs()

const modal = inject('modal')
const showModal = ref(false)
const payload = ref(null)

const modalWidth = computed(() => props.width || props.size)

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

const enhancedAttrs = computed(() => ({
  ...attrs,
  attach: IS_TEST_ENV ? true : attrs.attach,
}))
</script>

<template>
  <VDialog
    v-model="showModal"
    class="base-modal"
    :width="modalWidth"
    v-bind="enhancedAttrs"
    @update:model-value="onHide"
  >
    <template #default>
      <VCard class="modal-card">
        <div
          class="modal-header with-absolute px-6 py-3 d-flex align-end justify-space-between"
          :class="{
            'without-header-title': !title,
            [modalHeaderClass]: modalHeaderClass,
          }"
        >
          <slot
            name="modal-header"
            :title="title"
            :hide="hide"
          >
            <h5
              v-if="title"
              class="text-h5 mb-0"
              data-test-id="modal-title"
            >
              {{ title }}
            </h5>
          </slot>
          <VBtn
            size="30"
            :variant="VVariants.Outlined"
            :color="VColors.Secondary"
            class="modal-header__close bg-surface"
            data-test-id="btn-close"
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

  &__close {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(8px,-2px);
    border-color: rgb(var(--v-theme-grey-200));

    &:hover {
      transform: translate(5px,3px);
    }
  }
}
</style>
