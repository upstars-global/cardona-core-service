<template>
  <div class="page-full d-flex flex-column align-items-center justify-content-center">
    <feather-icon size="100" icon="LockIcon" class="mb-2" />
    <p class="text-body-heading font-medium-5 text-bold mb-1">
      {{ $t('page.noAccess.noAccessToPartition') }}
    </p>
    <p class="text-sub font-medium-1 mb-3">
      {{ $t('page.noAccess.textPage') }}
    </p>
    <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" @click="backHistoryPage">
      {{ $t('common.back') }}
    </b-button>
  </div>
</template>

<script>
export default {
  methods: {
    backHistoryPage() {
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/_include.scss';
.page-full {
  height: calc(100vh - 180px);
}

.text-sub {
  color: $body-color;
}
</style>
