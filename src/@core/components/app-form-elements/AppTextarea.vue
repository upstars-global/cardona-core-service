<script lang="ts" setup>
import { computed, ref, useAttrs } from 'vue'

defineOptions({
  name: 'AppTextarea',
  inheritAttrs: false,
})

// const { class: _class, label, variant: _, ...restAttrs } = useAttrs()

const elementId = computed (() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id || attrs.label

  return _elementIdToken ? `app-textarea-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}` : undefined
})

const label = computed(() => useAttrs().label as string | undefined)

const textarea = ref(null)

defineExpose({
  textarea,
})
</script>

<template>
  <div
    class="app-textarea flex-grow-1"
    :class="$attrs.class"
  >
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />
    <VTextarea
      v-bind="{
        ...$attrs,
        class: null,
        label: undefined,
        variant: 'outlined',
        id: elementId,
      }"
      ref="textarea"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps || {}"
        />
      </template>
    </VTextarea>
  </div>
</template>

<style lang="scss" scoped>
.app-textarea {
  :deep(.v-field--disabled) {
    opacity: var(--v-muted-placeholder-opacity);
  }
}
</style>
