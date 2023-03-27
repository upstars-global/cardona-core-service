<template>
  <vue-perfect-scrollbar
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
              class="item-directory d-flex justify-content-center align-items-center"
              @click="$emit('clickDirectory', '/' + file.path)"
            >
              <feather-icon icon="FolderIcon" size="16" class="mr-1" />
              {{ file.name }}
            </div>
            <div
              v-else
              class="item-file-img"
              :style="{ backgroundImage: `url(${file.publicPath}?ar=184)` }"
              @click="$emit('clickFile', file.publicPath, file.path)"
            ></div>
          </div>
        </div>
        <template v-if="isLoad">
          <skeleton-grid-item v-for="n in 16" :key="`skeleton-${n}-item`" />
        </template>
      </template>
      <skeleton-grid v-else :number="16" />
    </div>
  </vue-perfect-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { debounce } from 'lodash'
import SkeletonGrid from '../UploadImage/SkeletonGrid.vue'
import SkeletonGridItem from '../UploadImage/SkeletonGridItem.vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default defineComponent({
  name: 'GridView',
  components: {
    SkeletonGrid,
    SkeletonGridItem,
    VuePerfectScrollbar,
  },
  props: {
    isLoad: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    urlFile: {
      type: String || null,
      required: true,
      default: '',
    },
  },
  emits: ['clickDirectory', 'clickFile', 'scrolledBottom'],
  setup(props, { emit }) {
    const perfectScrollbarSettings = {
      wheelPropagation: false,
    }

    const onScroll = debounce(({ target }): void => {
      if (target.scrollTop + target.clientHeight >= target.scrollHeight) emit('scrolledBottom')
    }, 500)
    return {
      perfectScrollbarSettings,
      onScroll,
    }
  },
})
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/_include';
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

      &:hover {
        border: 1px solid $primary;
        color: $primary;
      }
      &.active {
        border: 2px solid $primary;
        color: $primary;
        .item-file-content {
          border: 1px solid $white;
        }
      }
      &.item-skeleton {
        background: $input-disabled-bg;
        .icon-no-file {
          color: $text-muted;
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
  }
}
</style>
