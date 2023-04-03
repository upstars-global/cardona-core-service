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
  >
    <template v-if="item" #default="{ hide }">
      <!-- Header -->
      <div
        class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-75"
      >
        <h5 class="mb-0">{{ $t(title) }}</h5>

        <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="21" @click="hide" />
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
            </slot>
          </div>
        </template>

        <slot name="sidebar-actions" :form="viewForm">
          <div v-if="canUpdate" class="d-flex mt-2">
            <b-button
              variant="outline-secondary"
              size="sm"
              class="mr-1"
              @click="action('update', hide)"
            >
              {{ $t('action.edit') }}
            </b-button>

            <b-button
              v-if="canRemove"
              variant="outline-danger"
              size="sm"
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

const emitAfterAnimationSidebar = 200

export default {
  name: 'SideBar',
  components: {
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
    canRemove: {
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
      checkSlotExistence,
    }
  },
}
</script>
