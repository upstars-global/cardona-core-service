<template>
  <div class="file-gallery">
    <b-breadcrumb v-if="!searchQuery" class="breadcrumb-chevron mb-1">
      <b-breadcrumb-item :active="items.length === 0" @click.prevent="goToCatalog('/')">
        <feather-icon icon="FolderIcon" size="16" class="align-text-top" />
      </b-breadcrumb-item>
      <b-breadcrumb-item
        v-for="(item, index) in items"
        :key="item.path"
        :active="index === items.length - 1"
        @click.prevent="goToCatalog(item.path)"
      >
        {{ item.name }}
      </b-breadcrumb-item>
    </b-breadcrumb>

    <div class="d-flex align-items-center mb-1">
      <b-input-group class="input-group-merge mr-1">
        <b-input-group-prepend is-text>
          <feather-icon icon="SearchIcon" />
        </b-input-group-prepend>
        <b-form-input
          v-model="searchQuery"
          :placeholder="$t('placeholder.search._')"
          debounce="500"
        />
      </b-input-group>

      <b-button-group>
        <b-button
          variant="outline-primary"
          class="px-1"
          :class="{ active: type === 'grid' }"
          @click="setType('grid')"
        >
          <feather-icon icon="GridIcon" />
        </b-button>
        <b-button
          variant="outline-primary"
          class="px-1"
          :class="{ active: type === 'list' }"
          @click="setType('list')"
        >
          <feather-icon icon="ListIcon" />
        </b-button>
      </b-button-group>
    </div>

    <no-files v-if="files.length === 0 && !isLoad" />
    <grid-view
      v-else-if="type === 'grid'"
      :is-load="isLoad"
      :files="files"
      :url-file="urlFile"
      :page="currentPage"
      @clickDirectory="goToCatalog"
      @clickFile="setUrlFile"
      @scrolledBottom="scrolledBottom"
    />
    <list-view
      v-else-if="type === 'list'"
      :is-load="isLoad"
      :files="files"
      :url-file="urlFile"
      :paginated="paginated"
      @clickDirectory="goToCatalog"
      @clickFile="setUrlFile"
    />
  </div>
</template>

<script lang="ts">
import NoFiles from '@/components/UploadImage/NoFiles.vue'
import GridView from '@/components/UploadImage/GridView.vue'
import ListView from '@/components/UploadImage/ListView.vue'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { getStructureList, uploadFile } from '@/_@queries/сompostela'
import usePagination from '@/use/pagination'
import i18n from '@/libs/i18n'

export default defineComponent({
  name: 'FileGallery',
  components: {
    NoFiles,
    GridView,
    ListView,
  },
  props: {
    urlFile: {
      type: String || null,
      required: true,
      default: '',
    },
    path: {
      type: String,
      default: '/',
    },
  },
  emits: ['input', 'inputPath'],
  setup(props, { emit }) {
    const defaultCountItem = 25
    const defaultPerPageOptions = [5, 10, 25, 50]
    const {
      linkGen,
      perPageOptions,
      perPage,
      total,
      setupDataMeta,
      numberOfPages,
      setPage,
      setPerPage,
      currentPage,
      updateTotal,
      onChangePagination,
    } = usePagination({ defaultPerPageOptions, defaultPerPage: 25, isUseRouter: false })
    const paginated = ref({
      linkGen,
      perPageOptions,
      perPage,
      total,
      setupDataMeta,
      numberOfPages,
      setPage,
      setPerPage,
      updateTotal,
      onChangePagination,
    })

    const url = ref(props.path)
    const type = ref('grid')
    const items = computed(() => {
      const arrUrl = url.value.split('/').filter((item) => !!item)
      let urlPath = ''
      return arrUrl.map((item) => {
        urlPath = urlPath.concat('/' + item)
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
      if (isLoad.value) return
      isLoad.value = true
      try {
        const { data, pagination } = await getStructureList(
          url.value,
          currentPage.value,
          perPage.value,
          searchQuery.value.trim()
        )
        if (pagination?.total) {
          updateTotal(pagination.total)
        }
        if (data) {
          const newData = data.map((item) => {
            const arrPath = item.path.split('/')
            return {
              ...item,
              name: arrPath[arrPath.length - 1],
            }
          })
          if (flagConcatFile.value) {
            files.value = files.value.concat(newData)
          } else {
            files.value = newData
          }
        }
      } catch (e) {
        errorMessage.value = String(i18n.t(`toast.error.loadFile`))
      } finally {
        isLoad.value = false
      }
    }

    onChangePagination(fetchFilesStructure)

    const resetPage = (newPerPage: any = null) => {
      flagConcatFile.value = false
      if (newPerPage && perPage.value !== newPerPage) {
        setPage(1, newPerPage)
      } else if (currentPage.value !== 1) {
        setPage(1)
      } else {
        fetchFilesStructure()
      }
    }

    watch(searchQuery, () => {
      resetPage()
    })

    const goToCatalog = (path) => {
      if (path === url.value || isLoad.value) return
      url.value = path
      resetPage()
    }

    const setType = (newType) => {
      type.value = newType

      if (newType === 'grid') {
        resetPage(defaultCountItem)
      } else {
        resetPage(defaultPerPageOptions[0])
      }
    }

    const scrolledBottom = () => {
      const page = currentPage.value + 1

      if (page <= numberOfPages.value) {
        flagConcatFile.value = true
        setPage(page)
      }
    }

    const setUrlFile = async (publicPathIMG, path) => {
      const propsPath = props.path[0] === '/' ? props.path : '/' + props.path
      if (propsPath === url.value) {
        emit('input', publicPathIMG)
        emit('inputPath', path)
      } else {
        const nameFileArr = path?.split('/')
        const nameFile = nameFileArr[nameFileArr.length - 1]
        const { publicPath } = await uploadFile({
          path: props.path + '/' + nameFile,
          replace: path,
        })
        goToCatalog(propsPath)
        emit('input', publicPath)
        emit('inputPath', props.path + '/' + nameFile)
      }
    }

    onMounted(async () => {
      resetPage(defaultCountItem)
    })

    return {
      isLoad,
      errorMessage,
      items,
      files,
      goToCatalog,
      searchQuery,
      type,
      setType,
      setUrlFile,
      currentPage,
      scrolledBottom,
      paginated,
    }
  },
})
</script>
