<template>
  <div>
    <div class="table-box mb-1">
      <b-row class="search-row">
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <label class="text-body-heading m-0">
            {{ $t('common.show') }}
          </label>

          <v-select
            :value="paginated.perPage"
            :dir="$store.getters['appConfig/dirOption']"
            label="per page"
            :options="paginated.perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
            @input="(val) => setPerPage(val)"
          />
        </b-col>
      </b-row>

      <b-skeleton-table v-if="isLoad" :rows="6" :columns="3" />

      <b-table
        v-show="!isLoad"
        ref="refTable"
        hover
        show-empty
        :fields="selectedColumns"
        :items="files"
        :busy="isLoad"
        class="our-table m-0"
        responsive
        @row-clicked="onRowClick"
      >
        <template #cell(img)="{ item }">
          <div class="item-file" :class="{ active: urlFile === item.publicPath }">
            <div class="item-file-content">
              <div
                v-if="item.type === 'DIRECTORY'"
                class="item-directory d-flex justify-content-center align-items-center"
              >
                <feather-icon icon="FolderIcon" size="20" class="m-0" />
              </div>
              <div
                v-else
                class="item-file-img"
                :style="{ backgroundImage: `url(${item.publicPath}?ar=184)` }"
              ></div>
            </div>
          </div>
        </template>
        <template #cell(url)="{ item }">
          <div v-if="item.type === 'DIRECTORY'">
            {{ item.name }}
          </div>
          <div v-else>/{{ item.name }}</div>
        </template>
      </b-table>
    </div>

    <div class="mx-2 mb-2">
      <b-row>
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted">
            {{ $t('pagination.showing', dataMeta) }}
          </span>
        </b-col>

        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >
          <b-pagination-nav
            v-if="paginated.numberOfPages"
            v-model="page"
            first-number
            last-number
            class="pagination-nav mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
            :link-gen="paginated.linkGen"
            :number-of-pages="paginated.numberOfPages"
            use-router
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" size="18" />
            </template>

            <template #next-text>
              <feather-icon icon="ChevronRightIcon" size="18" />
            </template>
          </b-pagination-nav>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { TableField } from '@core/components/table-fields/model'
import { useUtils as useI18nUtils } from '@core/libs/i18n'

export default defineComponent({
  name: 'ListView',
  components: {},
  props: {
    isLoad: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      required: true,
    },
    urlFile: {
      type: String || null,
      required: true,
      default: '',
    },
    paginated: {
      type: Object,
      required: true,
    },
  },
  emits: ['clickDirectory', 'clickFile', 'updatePage'],
  setup(props, { emit }) {
    const refTable: any = ref(null)
    const { t } = useI18nUtils()
    const columns = [
      new TableField({ key: 'img', label: t('uploadImg.tableCol1Name') }),
      new TableField({ key: 'url', label: t('uploadImg.tableCol2Name') }),
    ]
    const selectedColumns = ref<TableField[]>([...columns])
    const dataMeta = props.paginated.setupDataMeta(refTable)

    const page = computed({
      get: () => props.paginated.currentPage || 1,
      set: (val) => props.paginated.setPage(val),
    })
    const setPerPage = (perPage) => {
      props.paginated.setPerPage(perPage)
    }
    const onRowClick = (val) => {
      if (val.type === 'DIRECTORY') {
        emit('clickDirectory', '/' + val.path)
      } else {
        emit('clickFile', val.publicPath, val.path)
      }
    }
    return {
      selectedColumns,
      refTable,
      dataMeta,
      setPerPage,
      onRowClick,
      page,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/_include';
.table-box {
  border: 1px solid $border-color;
  border-radius: 0.5rem;
  overflow: hidden;
}
.search-row {
  padding: 1rem 2rem;
}
.item-file {
  position: relative;
  width: 8.571rem;
  border-radius: 4px;
  border: 1px solid $border-color;
  color: $body-color;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  overflow: hidden;

  .item-file-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &.active {
    border: 2px solid $primary;
    color: $primary;
    .item-file-content {
      border: 1px solid $white;
    }
  }
  &:before {
    content: '';
    display: block;
    padding-bottom: 50%;
  }

  .item-directory,
  .item-file-img {
    width: 100%;
    height: 100%;
  }
  .item-file-img {
    background-size: cover;
    background-position: center;
  }
}
</style>
