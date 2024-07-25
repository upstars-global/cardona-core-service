<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { IconsList } from '../../@model/enums/icons'
import ImageItem from './ImageItem.vue'
import SkeletonGrid from './SkeletonGrid.vue'

withDefaults(defineProps<{
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

const onScrollEnd = () => {
  emits('scrolledBottom')
}
</script>

<template>
  <PerfectScrollbar
    id="filesGridScroll"
    :settings="perfectScrollbarSettings"
    class="scroll-area"
    @ps-y-reach-end="onScrollEnd"
  >
    <div class="files files-grid d-flex flex-wrap">
      <div class="d-flex flex-wrap gap-4">
        <template v-if="files.length">
          <div
            v-for="file in files"
            :key="file.path + file.publicPath"
          >
            <div
              class="item-file"
              :class="{ active: urlFile === file.publicPath }"
            >
              <div
                v-if="file.type === 'DIRECTORY'"
                class="item-directory d-flex justify-center align-center gap-1"
                @click="$emit('clickDirectory', `/${file.path}`)"
              >
                <VIcon
                  :icon="IconsList.FolderIcon"
                  size="16"
                />
                {{ file.name }}
              </div>
              <ImageItem
                v-else
                :file="file"
                @click="$emit('clickFile', file.publicPath, file.path)"
              />
            </div>
          </div>
        </template>
        <template v-if="isLoad">
          <SkeletonGrid :number="16" />
        </template>
      </div>
    </div>
  </PerfectScrollbar>
</template>

<style lang="scss" scoped>
.scroll-area {
  position: relative;
  width: 100%;
  height: 18.5rem;
}
</style>
