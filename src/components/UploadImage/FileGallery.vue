<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import NoFiles from '../UploadImage/NoFiles.vue'
import usePagination from '../templates/BaseList/сomposables/pagination'
import AppTextField from '../../@core/components/app-form-elements/AppTextField.vue'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import { useCompostelaStore } from '../../stores/compostelaCore'
import GridView from './GridView.vue'
import ListView from './ListView.vue'

const props = withDefaults(defineProps<{
  urlFile: string
  path: string
  isOnlyGallery: boolean
}>(), {
  urlFile: '',
  path: '/',
  isOnlyGallery: false,
})

const emits = defineEmits<{
  input: [value: string]
  inputPath: [value: string]
}>()

const { t } = useI18n()
const defaultCountItem = 25
const defaultPerPageOptions = [5, 10, 25, 50]

const paginated = usePagination({
  defaultPerPageOptions,
  defaultPerPage: 25,
  isUseRouter: false,
  storageKey: '',
})

const {
  currentPage,
  perPage,
  numberOfPages,
  setPage,
  updateTotal,
  onChangePagination,
} = paginated

const url = ref(props.path)
const type = ref('grid')
const compostelaStore = useCompostelaStore()

const items = computed(() => {
  const arrUrl = url.value.split('/').filter(item => !!item)
  let urlPath = ''

  return arrUrl.map(item => {
    urlPath = urlPath.concat(`/${item}`)

    return {
      path: urlPath,
      name: item,
    }
  })
})

const isLoad = ref(false)
const files = ref([])
const searchQuery = ref('')
const errorMessage = ref('')
const flagConcatFile = ref(false)

const fetchFilesStructure = async () => {
  if (isLoad.value)
    return
  isLoad.value = true

  try {
    const { data, pagination } = await compostelaStore.getStructureList({
      path: url.value,
      pageNumber: currentPage.value,
      perPage: perPage.value,
      search: searchQuery.value.trim(),
    })

    if (pagination?.total)
      updateTotal(pagination.total)

    if (data) {
      const newData = data.map(item => {
        const arrPath = item.path.split('/')

        return {
          ...item,
          name: arrPath[arrPath.length - 1],
        }
      })

      if (flagConcatFile.value)
        files.value = files.value.concat(newData)
      else
        files.value = newData
    }
  }
  catch (e) {
    errorMessage.value = String(t('toast.error.loadFile'))
  }
  finally {
    isLoad.value = false
  }
}

onChangePagination(fetchFilesStructure)

const resetPage = (newPerPage: any = null) => {
  flagConcatFile.value = false
  if (newPerPage && perPage.value !== newPerPage)
    setPage(1, newPerPage)
  else if (currentPage.value !== 1)
    setPage(1)
  else
    fetchFilesStructure()
}

watch(searchQuery, () => {
  resetPage()
})

watch(() => currentPage.value, () => {
  fetchFilesStructure()
})

const goToCatalog = path => {
  if (path === url.value || isLoad.value)
    return
  url.value = path
  resetPage()
}

const setType = newType => {
  type.value = newType

  if (newType === 'grid')
    resetPage(defaultCountItem)
  else
    resetPage(defaultPerPageOptions[0])
}

const scrolledBottom = () => {
  const page = currentPage.value + 1

  if (page <= numberOfPages.value) {
    flagConcatFile.value = true
    setPage(page)
  }
}

const setUrlFile = async (publicPathIMG, path) => {
  const propsPath = props.path[0] === '/' ? props.path : `/${props.path}`

  if (props.isOnlyGallery) {
    emits('inputPath', publicPathIMG)

    return
  }

  if (propsPath === url.value) {
    emits('input', publicPathIMG)
    emits('inputPath', path)
  }
  else {
    const nameFileArr = path?.split('/')
    const nameFile = nameFileArr[nameFileArr.length - 1]

    const { publicPath } = await compostelaStore.uploadFile({
      path: `${props.path}/${nameFile}`,
      replace: path,
    })

    goToCatalog(propsPath)
    emits('input', publicPath)
    emits('inputPath', `${props.path}/${nameFile}`)
  }
}

onMounted(async () => {
  resetPage(defaultCountItem)
})
</script>

<template>
  <div class="file-gallery">
    <div class="breadcrumb-wrapper ">
      <VBreadcrumbs
        v-if="!searchQuery"
        class="pt-0"
      >
        <VBreadcrumbsItem
          :active="items.length === 0"
          @click.prevent="goToCatalog('/')"
        >
          <VIcon
            :icon="IconsList.FolderIcon"
            size="16"
            class="align-text-top"
          />
        </VBreadcrumbsItem>

        <VBreadcrumbsDivider v-if="items.length">
          <VIcon :icon="IconsList.ChevronRightIcon" />
        </VBreadcrumbsDivider>

        <template
          v-for="(item, index) in items"
          :key="item.path"
        >
          <VBreadcrumbsItem
            :active="index === items.length - 1"
            class="text-body-1"
            @click.prevent="goToCatalog(item.path)"
          >
            {{ item.name }}
          </VBreadcrumbsItem>
          <VBreadcrumbsDivider v-if="index !== items.length - 1">
            <VIcon :icon="IconsList.ChevronRightIcon" />
          </VBreadcrumbsDivider>
        </template>
      </VBreadcrumbs>
    </div>

    <div class="d-flex align-center gap-2 mb-2">
      <AppTextField
        v-model="searchQuery"
        :placeholder="$t('placeholder.search._')"
        :prepend-inner-icon="IconsList.SearchIcon"
        debounce="500"
      />

      <VBtnToggle
        :color="VColors.Primary"
        :variant="VVariants.Outlined"
        divided
        class="file-gallery__btn-toggle"
      >
        <VBtn
          :class="{ active: type === 'grid' }"
          :icon="IconsList.GridIcon"
          :size="VSizes.Small"
          class="file-gallery__btn-toggle-item"
          @click="setType('grid')"
        />
        <VBtn
          :class="{ active: type === 'list' }"
          :icon="IconsList.ListIcon"
          :size="VSizes.Small"
          class="file-gallery__btn-toggle-item"
          @click="setType('list')"
        />
      </VBtnToggle>
    </div>

    <NoFiles v-if="files.length === 0 && !isLoad" />

    <GridView
      v-else-if="type === 'grid'"
      :is-load="isLoad"
      :files="files"
      :url-file="urlFile"
      :page="currentPage"
      @click-directory="goToCatalog"
      @click-file="setUrlFile"
      @scrolled-bottom="scrolledBottom"
    />

    <ListView
      v-else-if="type === 'list'"
      :is-load="isLoad"
      :files="files"
      :url-file="urlFile"
      :paginated="paginated"
      class="list-view"
      @click-directory="goToCatalog"
      @click-file="setUrlFile"
    />
  </div>
</template>

<style lang="scss" scoped>
.file-gallery {
  &__btn-toggle {
    height: 2.5rem;
  }
  &__btn-toggle-item {
    &.v-btn {
      border-color: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-primary));
      &.active {
        background-color: rgba(var(--v-theme-primary), var(--v-activated-opacity))!important;
      }
    }
  }
}
</style>
