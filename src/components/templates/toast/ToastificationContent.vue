<script setup lang="ts">
import { IconsList } from '../../../@model/enums/icons'

interface Props {
  variant: string
  icon?: string
  title?: string
  text?: string
  hideClose?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="toastification">
    <div
      class="d-flex align-items-start gap-2"
      :class="`text-${variant}`"
    >
      <div class="toastification__avatar d-flex align-center justify-center">
        <i
          class="toastification__avarat-icon v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer"
          :class="icon"
          role="button"
          aria-hidden="false"
        />
      </div>

      <div class="d-flex flex-grow-1">
        <div>
          <h4
            v-if="title"
            class="toastification-title"
            v-text="title"
          />
          <small
            v-if="text"
            class="d-inline-block text-body"
            v-text="text"
          />
        </div>
      </div>

      <div
        v-if="!hideClose"
        class="cursor-pointer toastification-close-icon ml-auto"
        @click="$emit('close-toast')"
      >
        <i
          class="v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer v-icon notranslate v-icon--size-default v-icon--clickable cursor-pointer "
          :class="IconsList.XIcon"
          role="button"
          aria-hidden="false"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toastification {
  &__avatar {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    background: currentColor;
  }
  &__avarat-icon {
    color: rgb(var(--v-theme-surface));
  }
}
.toastification-close-icon,
.toastification-title {
  line-height: 26px;
}

.toastification-close-icon {
 color: rgb(var(--v-theme-on-surface))
}
.toastification-title {
  color: inherit;
}
</style>
