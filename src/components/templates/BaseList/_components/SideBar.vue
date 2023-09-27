<template>
  <b-sidebar
    :id="`${entityName}-sidebar`"
    :visible="sidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:sidebar-active', val)"
    @hidden="$emit('hide')"
  >
    <template v-if="item" #default="{ hide }">
      <!-- Header -->
      <div
        class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-75"
      >
        <h5 class="mb-0">{{ $t(title) }}</h5>

        <feather-icon class="ml-1 cursor-pointer" :icon="IconsList.XIcon" size="21" @click="hide" />
      </div>
      <div class="p-1">
        <!--  ViewInfo   -->
        <template v-if="Object.keys(viewForm).isNotEmpty">
          <div v-for="key in Object.keys(viewForm)" :key="key" class="px-50">
            <slot :name="`sidebar-row(${key})`" :item="viewForm[key]">
              <view-generator
                v-if="viewForm[key] instanceof ViewInfo"
                :key="key"
                :value="viewForm[key]"
                :key-name="key"
                class="py-25"
                :class="`${key}-view`"
              >
                <template
                  v-if="checkSlotExistence(`sidebar-value(${key})`)"
                  :slot="`sidebar-value(${key})`"
                  slot-scope="{ item }"
                >
                  <slot :name="`sidebar-value(${key})`" :item="item" />
                </template>
              </view-generator>
              <template
                v-else-if="viewForm[key] instanceof SideBarCollapseItem && sidebarCollapseMode"
              >
                <app-collapse>
                  <app-collapse-item :title="viewForm[key].title">
                    <template #header>
                      <p class="h6">{{ viewForm[key].title }}</p>
                    </template>
                    <div v-for="groupKey in Object.keys(viewForm[key].views)" :key="groupKey">
                      <view-generator
                        v-if="viewForm[key].views[groupKey] instanceof ViewInfo"
                        :key="key"
                        :value="viewForm[key].views[groupKey]"
                        :key-name="groupKey"
                        class="py-25"
                        :class="`${groupKey}-view`"
                      >
                        <template
                          v-if="checkSlotExistence(`sidebar-value(${groupKey})`)"
                          :slot="`sidebar-value(${groupKey})`"
                          slot-scope="{ item }"
                        >
                          <slot :name="`sidebar-value(${groupKey})`" :item="item" />
                        </template>
                      </view-generator>
                    </div>
                  </app-collapse-item>
                </app-collapse>
                <hr v-if="viewForm[key].withBottomSeparator" />
              </template>
            </slot>
          </div>
        </template>

        <slot name="sidebar-actions" :form="viewForm">
          <div v-if="canUpdate" class="d-flex mt-2 sidebar-actions">
            <slot name="sidebar-action-items" />

            <b-button
              v-if="canUpdateItem"
              :variant="BVariant.OutlineSecondary"
              :size="BSize.Sm"
              @click="action('update', hide)"
            >
              {{ $t('action.edit') }}
            </b-button>

            <b-button
              v-if="canRemoveItem"
              :variant="BVariant.OutlineDanger"
              :size="BSize.Sm"
              @click="action('remove', hide)"
            >
              {{ $t('action.remove') }}
            </b-button>
          </div>
        </slot>
      </div>
    </template>
  </b-sidebar>
</template>

<script lang="ts">
import { BSidebar } from 'bootstrap-vue'
import { convertCamelCase } from '../../../../helpers'
import { ref, watch } from 'vue'
import ViewGenerator from '../../../../components/templates/ViewGenerator/index.vue'
import { ViewInfo, ViewJustifyContent } from '../../../../@model/view'
import AppCollapse from '../../../../@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '../../../../@core/components/app-collapse/AppCollapseItem.vue'
import { SideBarCollapseItem } from '../model'
import { IconsList } from '../../../../@model/enums/icons'
import { BVariant, BSize } from '../../../../@model/bootstrap'

const emitAfterAnimationSidebar = 200

export default {
  name: 'SideBar',
  components: {
    AppCollapseItem,
    AppCollapse,
    ViewGenerator,
    BSidebar,
  },
  model: {
    prop: 'sidebarActive',
    event: 'update:sidebar-active',
  },
  props: {
    sidebarActive: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      default: null,
    },
    canUpdate: {
      type: Boolean,
      required: false,
    },
    canUpdateItem: {
      type: Boolean,
      required: false,
    },
    canRemoveItem: {
      type: Boolean,
      required: false,
    },
    sidebarCollapseMode: {
      type: Boolean,
      required: false,
    },
    entityName: {
      type: String,
      default: '',
    },
    sideBarModel: {
      type: Function,
      required: true,
    },
  },
  setup(props, { emit, slots }) {
    const viewForm = ref(new props.sideBarModel(props.item))

    const action = (name: string, hide: Function) => {
      hide()

      setTimeout(() => {
        emit(name)
      }, emitAfterAnimationSidebar)
    }

    watch(
      () => props.item,
      (item) => {
        viewForm.value = new props.sideBarModel(item)
      }
    )

    const title = `title.${convertCamelCase(props.entityName, '.')}.sidebarTitle`

    const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]

    return {
      action,
      title,
      viewForm,
      ViewJustifyContent,
      ViewInfo,
      SideBarCollapseItem,
      checkSlotExistence,
      IconsList,
      BVariant,
      BSize,
    }
  },
}
</script>

<style lang="scss" scoped>
.collapse-default :deep(.card) {
  border: none;
  .card-header,
  .card-body {
    padding: 0;
  }
}

.sidebar-actions {
  :deep(.btn:not(:last-child)) {
    margin-right: 1rem;
  }
}
</style>
