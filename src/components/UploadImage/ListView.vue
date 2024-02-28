<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ListPagination from '../templates/BaseList/_components/ListPagination.vue'
import { TableField } from '../../@model/templates/tableFields'
import { IconsList } from '.././../@model/enums/icons'

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
      <VRow class="search-row">
        <VCol
          cols="12"
          md="6"
          class="d-flex justify-start align-center gap-4 mb-1 mb-md-0"
        >
          <label class="text-body-heading mb-0">
            {{ $t('common.show') }}
          </label>

          <VueSelect
            :model-value="perPage"
            label="per page"
            :options="paginated.perPageOptions"
            :clearable="false"
            :searchable="false"
            @update:model-value="setPerPage"
          />
        </VCol>
      </VRow>

      <CTable
        v-show="!isLoad"
        ref="refTable"
        hover
        show-empty
        :fields="selectedColumns"
        :items="files"
        :busy="isLoad"
        class="mb-2"
        responsive
        @row-clicked="onRowClick"
      >
        <template #cell(img)="{ item }">
          <div
            class="item-file"
            :class="{ active: urlFile === item.raw.publicPath }"
          >
            <div class="item-file-content">
              <div
                v-if="item.raw.type === 'DIRECTORY'"
                class="item-directory d-flex justify-center align-center"
              >
                <VIcon
                  :icon="IconsList.FolderIcon"
                  size="20"
                />
              </div>
              <div
                v-else
                class="item-file-img"
                :style="{ backgroundImage: `url(${item.raw.publicPath}?ar=184)` }"
              />
            </div>
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
}
.search-row {
  padding: 1rem 2rem;
}
.item-file {
  position: relative;
  width: 8.571rem;
  border-radius: 4px;
  border: 1px solid rgba(var(--v-theme-on-surface), var(--v-selected-opacity));
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
    border: 2px solid rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-primary));
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
