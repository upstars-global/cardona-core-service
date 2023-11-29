<script setup lang="ts">
const featuresData = [
  { title: 'Quality Code', desc: 'Code structure that all developers will easily understand and fall in love with.', icon: 'custom-laptop' },
  { title: 'Continuous Updates', desc: 'Free updates for the next 12 months, including new demos and features.', icon: 'custom-rocket' },
  { title: 'Starter Kit', desc: 'Start your project quickly without having to remove unnecessary features.', icon: 'custom-paper' },
  { title: 'API Ready', desc: 'Just change the endpoint and see your own data loaded within seconds.', icon: 'custom-check' },
  { title: 'Excellent Support', desc: 'An easy-to-follow doc with lots of references and code examples.', icon: 'custom-user' },
  { title: 'Well Documented', desc: 'An easy-to-follow doc with lots of references and code examples.', icon: 'custom-keyboard' },
]
</script>

<template>
  <VContainer id="features">
    <div class="feature-cards">
      <div class="headers d-flex justify-center flex-column align-center mb-15">
        <VChip
          label
          color="primary"
          class="mb-4"
        >
          Useful Features
        </VChip>
        <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
          <div>
            <div class="position-relative me-2">
              <h3 class="section-title">
                Everything you need
              </h3>
            </div>
            to start your next project
          </div>
        </div>
        <p class="mb-0">
          Not just a set of tools, the package includes ready-to-deploy conceptual application.
        </p>
      </div>
      <VRow>
        <VCol
          v-for="(data, index) in featuresData"
          :key="index"
          cols="12"
          md="4"
          sm="6"
        >
          <div class="d-flex flex-column align-center justify-center gap-4 mx-auto">
            <VIcon
              :icon="data.icon"
              size="64"
              color="primary"
            />
            <h5 class="text-h5">
              {{ data.title }}
            </h5>
            <p
              class="text-center"
              style="max-inline-size: 310px;"
            >
              {{ data.desc }}
            </p>
          </div>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.feature-cards {
  margin-block: 5.25rem;

}

.title-text::before{
  background: url('../../../assets/images/front-pages/icons/section-title-icon.png') no-repeat left bottom/contain;
  content: 'Everything You Need';
  font-weight: 700;
}

.section-title::after {
  position: absolute;
  background: url('../../../assets/images/front-pages/icons/section-title-icon.png') no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: '';
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}
</style>
