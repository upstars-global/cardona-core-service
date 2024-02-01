<script setup lang="ts">
import { ref, useSlots, watch } from 'vue'

import { hide } from '@floating-ui/dom'
import ViewGenerator from '../../../components/templates/ViewGenerator/index.vue'
import { ViewInfo } from '../../../@model/view'
import { IconsList } from '../../../@model/enums/icons'
import { convertCamelCase } from '../../../helpers'
import { SideBarCollapseItem } from '../../../@model/templates/baseList'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'

const props = defineProps<{
  item?: object
  sidebarActive: boolean
  canUpdate?: boolean
  canUpdateItem?: boolean
  canRemoveItem?: boolean
  sidebarCollapseMode?: boolean
  entityName?: string
  sideBarModel: Function
}>()

const emits = defineEmits<{
  (e: 'update:sidebar-active', value: boolean): void
  (e: 'update'): void
  (e: 'remove'): void
  (e: 'hide'): void
}>()

const slots = useSlots()

const emitAfterAnimationSidebar = 200

const viewForm = ref(null)

const action = (name: string, hide: Function) => {
  hide && hide()

  setTimeout(() => {
    emits(name)
  }, emitAfterAnimationSidebar)
}

watch(
  () => props.item,
  item => {
    if (item)
      viewForm.value = new props.sideBarModel(item)
  },
)

const title = `title.${convertCamelCase(props.entityName, '.')}.sidebarTitle`

const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]

const onHide = () => {
  emits('update:sidebar-active', false)
  emits('hide')
}
</script>

<template>
  <VNavigationDrawer
    :id="`${entityName}-sidebar`"
    :model-value="sidebarActive"
    temporary
    location="right"
    class="side-bar"
    @update:model-value="onHide"
  >
    <!-- Header -->
    <div class="content-sidebar-header d-flex justify-space-between align-center px-5 py-3 bg-light px-2">
      <h5 class="mb-0 text-h5">
        {{ $t(title) }}
      </h5>
      <VIcon
        class="ml-1 cursor-pointer"
        :icon="IconsList.XIcon"
        size="21"
        @click="onHide"
      />
    </div>
    <div
      v-if="viewForm"
      class="p-1 bg-light px-4"
    >
      <!--  ViewInfo   -->
      <template v-if="Object.keys(viewForm).isNotEmpty">
        <div
          v-for="key in Object.keys(viewForm)"
          :key="key"
          class="px-2"
        >
          <slot
            :name="`sidebar-row(${key})`"
            :item="viewForm[key]"
          >
            <ViewGenerator
              v-if="viewForm[key] instanceof ViewInfo"
              :key="key"
              :model-value="viewForm[key]"
              :key-name="key"
              :class="`${key}-view`"
            >
              <template
                v-if="checkSlotExistence(`sidebar-value(${key})`)"
                #[`sidebar-value(${key})`]="{ item }"
              >
                <slot
                  :name="`sidebar-value(${key})`"
                  :item="item"
                />
              </template>
            </ViewGenerator>
            <template v-else-if="viewForm[key] instanceof SideBarCollapseItem && sidebarCollapseMode">
              <div>
                <VExpansionPanels multiple>
                  <VExpansionPanel :title="viewForm[key].title">
                    <VExpansionPanelText>
                      <div
                        v-for="groupKey in Object.keys(viewForm[key].views)"
                        :key="groupKey"
                      >
                        <ViewGenerator
                          v-if="viewForm[key].views[groupKey] instanceof ViewInfo"
                          :key="key"
                          :model-value="viewForm[key].views[groupKey]"
                          :key-name="groupKey"
                          :class="`${groupKey}-view`"
                        >
                          <template
                            v-if="checkSlotExistence(`sidebar-value(${groupKey})`)"
                            #[`sidebar-value(${groupKey})`]="{ item }"
                          >
                            <slot
                              :name="`sidebar-value(${groupKey})`"
                              :item="item"
                            />
                          </template>
                        </ViewGenerator>
                      </div>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </div>

              <hr v-if="viewForm[key].withBottomSeparator">
            </template>
          </slot>
        </div>
      </template>

      <slot
        name="sidebar-actions"
        :form="viewForm"
      >
        <div
          v-if="canUpdate"
          class="d-flex py-4 sidebar-actions"
        >
          <slot name="sidebar-action-items" />

          <VBtn
            v-if="canUpdateItem"
            :variant="VVariants.Outlined"
            :color="VColors.Secondary"
            :size="VSizes.Small"
            @click="action('update', hide)"
          >
            {{ $t('action.edit') }}
          </VBtn>

          <VBtn
            v-if="canRemoveItem"
            :variant="VVariants.Outlined"
            :color="VColors.Error"
            :size="VSizes.Small"
            @click="action('remove', hide)"
          >
            {{ $t('action.remove') }}
          </VBtn>
        </div>
      </slot>
    </div>
  </VNavigationDrawer>
</template>

<style lang="scss" scoped>
.side-bar {
  min-width: 35rem;
  .content-sidebar-header {
    background: rgb(var(--v-theme-background));
  }
}

.sidebar-actions {
  :deep(.v-btn) {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}
</style>
