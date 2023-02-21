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
      <div class="p-2">
        <!--  ViewInfo   -->
        <template v-if="Object.keys(viewForm).isNotEmpty">
          <template v-for="key in Object.keys(viewForm)">
            <slot
              v-if="checkSlotExistence(`sidebar-row(${key})`)"
              :name="`sidebar-row(${key})`"
              :item="viewForm[key]"
            />

            <view-generator
              v-else-if="!checkSlotExistence(`sidebar-row(${key})`) && viewForm[key]"
              :key="key"
              :value="viewForm[key]"
              :justify-content="ViewJustifyContent.End"
              class="mb-1"
              :class="`${key}-view`"
            />
          </template>
        </template>

        <div v-if="canUpdate" class="d-flex mt-2">
          <b-button
            v-if="canRemove"
            variant="outline-danger"
            class="mr-1"
            size="sm"
            @click="action('remove', hide)"
          >
            {{ $t('action.remove') }}
          </b-button>
          <b-button variant="outline-secondary" size="sm" @click="action('update', hide)">
            {{ $t('action.edit') }}
          </b-button>
        </div>
      </div>
    </template>
  </b-sidebar>
</template>

<script lang="ts">
import { BSidebar } from 'bootstrap-vue'
import { convertCamelCase } from '@/helpers'
import { ref, watch } from 'vue'
import ViewGenerator from '@/components/templates/ViewGenerator/index.vue'
import { ViewJustifyContent } from '@model/view'

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

    const title: string = `title.${convertCamelCase(props.entityName, '.')}.sidebarTitle`

    const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]

    return {
      action,
      title,
      viewForm,
      ViewJustifyContent,
      checkSlotExistence,
    }
  },
}
</script>
