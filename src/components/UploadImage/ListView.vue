<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ListPagination from '../templates/BaseList/_components/ListPagination.vue'
import { TableField } from '../../@model/templates/tableFields'
import { IconsList } from '.././../@model/enums/icons'
import CTable from '../../components/CTable/index.vue'
import ImageItem from './ImageItem.vue'

const props = withDefaults(defineProps<{
  isLoad: boolean
  files: any[]
  urlFile: string | null
  paginated: any
}>(), {
  isLoad: false,
  files: [],
  urlFile: '',
  paginated: {},
})

const emits = defineEmits<{
  (e: 'click-directory', value: string): void
  (e: 'click-file', value: string, path: string): void
}>()

const refTable = ref<HTMLDivElement>()
const { t } = useI18n()

const columns = [
  new TableField({ key: 'img', title: t('uploadImg.tableColImg') }),
  new TableField({ key: 'url', title: t('uploadImg.tableColUrl') }),
]

const {
  perPage,
  setPerPage,
  setupDataMeta,
} = props.paginated

const selectedColumns = ref<TableField[]>([...columns])
const dataMeta = computed(() => setupDataMeta(props.files.length))

const page = computed({
  get: () => props.paginated.currentPage.value || 1,
  set: val => props.paginated.setPage(val),
})

const onRowClick = (val: Record<string, string>) => {
  if (val.type === 'DIRECTORY')
    emits('click-directory', `/${val.path}`)
  else
    emits('click-file', val.publicPath, val.path)
}
</script>

<template>
  <div>
    <div class="table-box mb-4">
      <div class="search-row">
        <div class="d-flex justify-start align-center gap-4 mb-1 mb-md-0">
          <label class="text-body-heading mb-0">
            {{ $t('common.show') }}
          </label>

          <VueSelect
            :model-value="perPage"
            label="per page"
            :options="paginated.perPageOptions"
            :clearable="false"
            :searchable="false"
            class="search-row__select select-size-sm"
            @update:model-value="setPerPage"
          >
            <template #open-indicator="{ attributes }">
              <VIcon
                v-bind="attributes"
                :icon="IconsList.ChevronDownIcon"
              />
            </template>
          </VueSelect>
        </div>
      </div>

      <div class="mb-2 table-box__table">
        <CTable
          ref="refTable"
          hover
          show-empty
          :fields="selectedColumns"
          :rows="files"
          :is-loading-list="isLoad"
          responsive
          small
          :items-per-page="perPage"
          @row-clicked="onRowClick"
        >
          <template #cell(img)="{ item }">
            <div
              class="item-file"
              :class="{ active: urlFile === item.raw.publicPath }"
            >
              <div
                v-if="item.raw.type === 'DIRECTORY'"
                class="item-directory d-flex justify-center align-center"
              >
                <VIcon
                  :icon="IconsList.FolderIcon"
                  size="20"
                />
              </div>
              <ImageItem
                v-else
                :file="item.raw"
              />
            </div>
          </template>
          <template #cell(url)="{ item }">
            <div v-if="item.raw.type === 'DIRECTORY'">
              {{ item.raw.name }}
            </div>
            <div v-else>
              /{{ item.raw.name }}
            </div>
          </template>
        </CTable>
      </div>
    </div>

    <div class="mx-2">
      <ListPagination
        v-model="page"
        :data-meta="dataMeta"
        :pagination-config="paginated"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  border: 1px solid rgba(var(--v-theme-on-surface), var(--v-selected-opacity));
  border-radius: var(--v-border-radius);
  overflow: hidden;

  :deep(.c-table) {
    tr {
      td[data-c-field='img'] {
        width: 13rem;

        .v-skeleton-loader__text {
          height: 5.5rem;
          margin: 0;
        }
      }
    }
  }
}
.search-row {
  padding: 0.75rem 1rem;

  :deep(.v-select) {
    width: 5.75rem;
    .vs__search {
      display: none;
    }
    .vs__dropdown-menu {
      min-width: 8.75rem;
    }
  }
}
</style>
