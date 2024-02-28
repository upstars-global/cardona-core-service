<script setup lang="ts">
import { debounce } from 'lodash'

import SkeletonGridItem from '../UploadImage/SkeletonGridItem.vue'
import { IconsList } from '../../@model/enums/icons'

const props = withDefaults(defineProps<{
  isLoad: boolean
  files: any[]
  page: number
  urlFile: string | null
}>(), {
  isLoad: false,
  files: [],
  page: 1,
  urlFile: '',
})

const emits = defineEmits<{
  clickDirectory: [value: string]
  clickFile: [value: string, path: string]
  scrolledBottom: []
}>()

const perfectScrollbarSettings = {
  wheelPropagation: false,
}

const onScroll = debounce(({ target }): void => {
  if (target.scrollTop + target.clientHeight >= target.scrollHeight)
    emits('scrolledBottom')
}, 500)
</script>

<template>
  <PerfectScrollbar
    id="filesGridScroll"
    :settings="perfectScrollbarSettings"
    class="scroll-area"
    @ps-scroll-y="onScroll"
  >
    <div class="files files-grid d-flex flex-wrap">
      <template v-if="files.length">
        <div
          v-for="file in files"
          :key="file.path + file.publicPath"
          class="item-file"
          :class="{ active: urlFile === file.publicPath }"
        >
          <div class="item-file-content">
            <div
              v-if="file.type === 'DIRECTORY'"
              class="item-directory d-flex justify-center align-center"
              @click="$emit('clickDirectory', `/${file.path}`)"
            >
              <VIcon
                :icon="IconsList.FolderIcon"
                size="16"
                class="mr-1"
              />
              {{ file.name }}
            </div>
            <div
              v-else
              class="item-file-img"
              :style="{ backgroundImage: `url(${file.publicPath}?ar=184)` }"
              @click="$emit('clickFile', file.publicPath, file.path)"
            />
          </div>
        </div>
        <template v-if="isLoad">
          <SkeletonGridItem
            v-for="n in 16"
            :key="`skeleton-${n}-item`"
          />
        </template>
      </template>
      <SkeletonGrid
        v-else
        :number="16"
      />
    </div>
  </PerfectScrollbar>
</template>

<style lang="scss">
.scroll-area {
  position: relative;
  width: 100%;
  height: 310px;
  margin-right: -0.5rem;
  margin-left: -0.5rem;
}
.files {
  &.files-grid {
    .item-file {
      position: relative;
      width: calc(25% - 1rem);
      margin: 0.5rem;
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

      &:hover {
        border-color: rgb(var(--v-theme-primary));
        color: rgb(var(--v-theme-primary));
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
  }
}
</style>
