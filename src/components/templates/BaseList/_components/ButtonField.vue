<template>
  <div class="white-space-nowrap" :class="{ 'btn-table': btnName }">
    {{ btnName }}
  </div>
</template>

<script>
export default {
  name: 'ButtonField',
  props: {
    btnName: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/core/colors/palette-variables.scss';

.btn-table {
  border: 1px solid $border-color;
  max-width: max-content;
  padding: 0.25rem 0.5rem;
  border-radius: 0.35rem;
}
</style>
