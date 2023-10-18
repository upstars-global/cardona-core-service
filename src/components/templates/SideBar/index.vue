<script setup lang="ts">
import { ref, watch } from 'vue'
import ViewGenerator from '../../../components/templates/ViewGenerator/index.vue'
import { ViewInfo } from '../../../@model/view'
import { IconsList } from '../../../@model/enums/icons'
import { BSize, BVariant } from '../../../@model/bootstrap'
import { convertCamelCase } from '../../../helpers'
import { SideBarCollapseItem } from '@/@model/templates/baseList'

const props = defineProps<{
  item: object
  sidebarActive: boolean
  canUpdate?: boolean
  canUpdateItem?: boolean
  canRemoveItem?: boolean
  sidebarCollapseMode?: boolean
  entityName?: string
  sideBarModel: Function
}>()

const emits = defineEmits<{
  (e: 'update:sidebarActive', value: boolean): void
}>()

const slots = useSlots()

const emitAfterAnimationSidebar = 200

const viewForm = ref(new props.sideBarModel(props.item))

const action = (name: string, hide: Function) => {
  hide && hide()

  setTimeout(() => {
    emit(name)
  }, emitAfterAnimationSidebar)
}

watch(
  () => props.item,
  item => {
    viewForm.value = new props.sideBarModel(item)
  },
)

const title = `title.${convertCamelCase(props.entityName, '.')}.sidebarTitle`

const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]

const onHide = () => {
  emits('update:sidebarActive', false)
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
    <div class="content-sidebar-header d-flex justify-space-between align-center  px-5 py-3">
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
    <div class="p-1">
      <!--  ViewInfo   -->
      <template v-if="Object.keys(viewForm).isNotEmpty">
        <div
          v-for="key in Object.keys(viewForm)"
          :key="key"
          class="px-50"
        >
          <slot
            :name="`sidebar-row(${key})`"
            :item="viewForm[key]"
          >
            <ViewGenerator
              v-if="viewForm[key] instanceof ViewInfo"
              :key="key"
              :value="viewForm[key]"
              :key-name="key"
              class="py-25"
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
                        :value="viewForm[key].views[groupKey]"
                        :key-name="groupKey"
                        class="py-25"
                        :class="`${groupKey}-view`"
                      >
                        <template
                          v-if="checkSlotExistence(`sidebar-value(${groupKey})`)"
                          #[`sidebar-value(${key})`]="{ item }"
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
          class="d-flex mt-2 sidebar-actions"
        >
          <slot name="sidebar-action-items" />

          <VBtn
            v-if="canUpdateItem"
            :variant="BVariant.OutlineSecondary"
            :size="BSize.Sm"
            @click="action('update', hide)"
          >
            {{ $t('action.edit') }}
          </VBtn>

          <VBtn
            v-if="canRemoveItem"
            :variant="BVariant.OutlineDanger"
            :size="BSize.Sm"
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
</style>
