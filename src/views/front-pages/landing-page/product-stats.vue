<template>
  <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
    <VContainer>
      <div class="py-12">
        <VRow>
          <VCol
            v-for="(product, index) in [
              { title: 'Support Tickets Resolved', value: '7.1k+', icon: 'custom-laptop', color: 'rgb(var(--v-theme-primary))' },
              { title: 'Join creatives community', value: '50k+', icon: 'custom-user', color: 'rgb(var(--v-theme-success))' },
              { title: 'Highly Rated Products', value: '4.8/5', icon: 'custom-diamond', color: 'rgb(var(--v-theme-info))' },
              { title: 'Money Back Guarantee', value: '100%', icon: 'custom-check', color: 'rgb(var(--v-theme-warning))' },
            ]"
            :key="index"
          >
            <VCard
              flat
              :style="{ border: `1px solid ${product.color}` }"
            >
              <VCardText class="text-center">
                <VIcon
                  :color="product.color"
                  :icon="product.icon"
                  size="64"
                  class="mb-3"
                />
                <h2 class="text-h2 font-weight-bold">
                  {{ product.value }}
                </h2>
                <span class="text-body-1 font-weight-medium">{{ product.title }}</span>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
  .stat-cards{
    border: 1px solid rgb(var(--v-theme-on-surface));
  }
</style>
