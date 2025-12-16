<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { BaseSectionType, PageType } from '../../../@model/templates/baseSection'
import { BaseSectionConfig } from '../../../@model/templates/baseList'

const props = withDefaults(defineProps<{
  withReadAction?: boolean
  config?: BaseSectionConfig
  pageType?: PageType
  useEntity: Function
  localEntityData?: Record<string, unknown>
  entityId?: string
  type?: BaseSectionType
}>(),
{
  useEntity: undefined,
  withReadAction: true,
  config: () => new BaseSectionConfig({}),
  pageType: PageType.Create,
  type: BaseSectionType.Default,
},
)

const emits = defineEmits<{
  (event: 'on-cancel'): void
  (event: 'on-save'): void
}>()

const formRef = ref<InstanceType<any> | null>(null)

const componentsMap = {
  default: () => import('./types/default.vue'),
}

const dynamicComponent = computed(() =>
  defineAsyncComponent(componentsMap[props.type]),
)

const onEmitEvent = (event: 'on-cancel' | 'on-save') => {
  emits(event)
}

defineExpose({
  get form() {
    return formRef.value?.form
  },
  get validate() {
    return formRef.value?.validate
  },
  get formRef() {
    return formRef.value?.formRef
  },
})
</script>

<template>
  <component
    :is="dynamicComponent"
    ref="formRef"
    :with-read-action="withReadAction"
    :config="config"
    :page-type="pageType"
    :use-entity="useEntity"
    :local-entity-data="localEntityData"
    :entity-id="entityId"
    :type="type"
    @on-cancel="onEmitEvent('on-cancel')"
    @on-save="onEmitEvent('on-save')"
    v-on="{
      ...$attrs,
      ...Object.fromEntries(
        Object.entries($attrs).map(([key]) => [
          key,
          (...args) => $emit(key, ...args),
        ]),
      ),
    }"
  >
    <slot />

    <template
      v-for="(_, slotName) in $slots"
      :key="slotName"
      #[slotName]="slotProps = {}"
    >
      <slot
        :name="slotName"
        v-bind="slotProps"
      />
    </template>
  </component>
</template>
