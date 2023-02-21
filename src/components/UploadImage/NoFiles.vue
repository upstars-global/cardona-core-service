<template>
  <div class="not-files-block d-flex flex-column justify-content-center align-items-center">
    <feather-icon icon="ImageIcon" size="32" class="icon-no-file mb-1" />
    <p class="text-body-heading font-weight-bold mb-0">{{ $t('uploadImg.nothingInFolder') }}</p>
    <p class="font-small-3">{{ $t('uploadImg.ChooseDifferentFolder') }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NoFiles',
})
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/_include';
.not-files-block {
  height: 14.286rem;

  .icon-no-file {
    color: $text-muted;
  }
}
</style>
