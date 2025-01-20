<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'

import { hide } from '@floating-ui/dom'
import { useRoute } from 'vue-router'
import ViewGenerator from '../../../components/templates/ViewGenerator/index.vue'
import { ViewInfo } from '../../../@model/view'
import { IconsList } from '../../../@model/enums/icons'
import { convertCamelCase } from '../../../helpers'
import { SideBarCollapseItem } from '../../../@model/templates/baseList'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'
import { getStorage, setStorage } from '../../../helpers/storage'
import { EMIT_AFTER_ANIMATION_SIDEBAR, IS_TEST_ENV } from '../../../utils/constants'

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

const route = useRoute()
const slots = useSlots()

const currentPageName = route.name?.toString()
const openBlocsKey = `${currentPageName}-${props.entityName}-suidebar-open-blocs`
const allBlocsKey = computed(() => viewForm.value ? Object.keys(viewForm.value) : [])
const openBlocs = ref([])

const viewForm = ref(null)

const action = (name: string, hide: Function) => {
  hide && hide()

  setTimeout(() => {
    emits(name)
  }, EMIT_AFTER_ANIMATION_SIDEBAR)
}

watch(
  () => props.item,
  item => {
    if (item)
      viewForm.value = new props.sideBarModel(item)
    openBlocs.value = JSON.parse(getStorage(openBlocsKey)) || allBlocsKey.value
  },
)

const title = `title.${convertCamelCase(props.entityName, '.')}.sidebarTitle`

const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]

const updateOpensBloks = newKey => {
  const list = openBlocs.value.find(key => key === newKey) ? openBlocs.value.filter(key => key !== newKey) : [...openBlocs.value, newKey]

  setStorage(openBlocsKey, list)
  openBlocs.value = list
}

const isOpenBlock = key => {
  return openBlocs.value.find(item => item === key)
}

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
    <div class="content-sidebar-header d-flex justify-space-between align-center px-6 py-3 bg-light">
      <h5
        class="content-sidebar-header__title mb-0 text-h5 font-weight-medium"
        data-test-id="sidebar-title"
      >
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
      v-if="viewForm && sidebarActive"
      class="p-1 pb-2 bg-light px-4"
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
              cols="4"
            >
              <template
                v-if="checkSlotExistence(`sidebar-value(${key})`)"
                #[`sidebar-value(${key})`]
              >
                <slot
                  :name="`sidebar-value(${key})`"
                  :item="viewForm[key]"
                />
              </template>
            </ViewGenerator>
            <template v-else-if="viewForm[key] instanceof SideBarCollapseItem && sidebarCollapseMode">
              <div>
                <VExpansionPanels
                  :model-value="isOpenBlock(key)"
                  data-test-id="collapse-item"
                >
                  <VExpansionPanel
                    :eager="IS_TEST_ENV"
                    :expand-icon="IconsList.ChevronRightIcon"
                    :title="`${viewForm[key].title}`"
                    :value="key"
                    @click="updateOpensBloks(key)"
                  >
                    <VExpansionPanelText
                      class="px-0"
                      :eager="IS_TEST_ENV"
                      @click.stop
                    >
                      <div
                        v-for="groupKey in Object.keys(viewForm[key].views)"
                        :key="groupKey"
                      >
                        <ViewGenerator
                          v-if="viewForm[key].views[groupKey] instanceof ViewInfo"
                          :key="key"
                          :data-test-id="`collapse-item-${groupKey}`"
                          :model-value="viewForm[key].views[groupKey]"
                          :key-name="groupKey"
                          :class="`${groupKey}-view`"
                          cols="4"
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

              <hr
                v-if="viewForm[key].withBottomSeparator"
                data-test-id="collapse-item-separator"
                class="my-0"
              >
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
          class="d-flex pl-2 py-4 gap-4 sidebar-actions"
        >
          <slot name="sidebar-action-items" />

          <VBtn
            v-if="canUpdateItem"
            data-test-id="edit-button"
            :variant="VVariants.Outlined"
            :color="VColors.Secondary"
            :size="VSizes.Small"
            @click="action('update', hide)"
          >
            {{ $t('action.edit') }}
          </VBtn>

          <VBtn
            v-if="canRemoveItem"
            data-test-id="remove-button"
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
  .content-sidebar-header {
    background: rgb(var(--v-theme-background));
  }

  :deep(.v-expansion-panel-text__wrapper) {
    padding-left: 0;
    padding-right: 0;
  }
}

.v-navigation-drawer__scrim {
  position: fixed;
}
</style>
