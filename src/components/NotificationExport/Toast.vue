<script setup lang="ts">
import { IconsList } from '../../@model/enums/icons'

defineOptions({ name: 'NotificationExportToast' })

defineProps<Props>()

defineEmits<{
  (event: 'download'): void
}>()
interface Props {
  variant: string
  icon?: string
  title?: string
  text?: string
  options: {
    startMessage: string
    endMessage: string
    entityName: string
    textButton: string
  }
}
</script>

<template>
  <div class="toastification">
    <div class="d-flex align-items-start gap-2">
      <div class="contnet-wrapper">
        <div class="d-flex flex-grow-1 font-weight-medium">
          <div class="d-flex align-center">
            <div class="icon-file pa-2 bg-grey-100 rounded-circle d-flex align-center justify-center mr-3">
              <i
                class="icon-file-body v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer "
                :class="IconsList.FileIcon"
                role="button"
                aria-hidden="false"
              />
            </div>
            <span class="text-color-mute">
              {{ options.startMessage }}
              <span class="text-color-base text-body-1 font-weight-medium">
                “{{ options.entityName }}”
              </span>
              {{ options.endMessage }}
            </span>
          </div>
        </div>
        <button
          class="ml-11 mt-2 v-btn v-btn--elevated v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated pl-3 pr-4"
          @click="$emit('download')"
        >
          <i
            class="v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer "
            :class="IconsList.DownloadIcon"
            role="button"
            aria-hidden="false"
          />
          <span class="ml-2">
            {{ options.textButton }}
          </span>
        </button>
      </div>

      <div
        class="cursor-pointer toastification-close-icon ml-auto"
        @click="$emit('close-toast')"
      >
        <i
          class="v-icon text-color-mute notranslate v-icon--size-default v-icon--clickable cursor-pointer v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer "
          :class="IconsList.XIcon"
          role="button"
          aria-hidden="false"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon-file {
  width: 2rem;
  height: 2rem;
  background-color: rgba(var(--v-theme-grey-100), var(--v-opacity-grey));
  &-body {
    width: 1rem;
    height: 1rem;
    background-color: rgba(var(--v-theme-grey-500), var(--v-opacity-grey));
  }
}
</style>
