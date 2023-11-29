<script setup lang="ts">
import type { HelpCenterAllCategoryArticles, HelpCenterArticlesOverview } from '@db/pages/help-center/types'

import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'

import HelpCenterLandingArticlesOverview from '@/views/pages/help-center/HelpCenterLandingArticlesOverview.vue'
import HelpCenterLandingFooter from '@/views/pages/help-center/HelpCenterLandingFooter.vue'
import HelpCenterLandingKnowledgeBase from '@/views/pages/help-center/HelpCenterLandingKnowledgeBase.vue'

definePage({
  meta: {
    layout: 'blank',
  },
})

interface ApiDataType {
  keepLearning: HelpCenterArticlesOverview[]
  popularArticles: HelpCenterArticlesOverview[]
  allArticles: HelpCenterAllCategoryArticles[]
}

// fetching data from fake-api

const { data: faqData } = await useApi<ApiDataType>('/pages/help-center')

const apiData = faqData.value
</script>

<template>
  <div class="help-center-page">
    <Navbar />
    <div v-if="apiData">
      <AppSearchHeader
        title="Hello, how can we help?"
        subtitle="Common troubleshooting topics: eCommerce, Blogging to payment"
        custom-class="rounded-0"
      />

      <!-- 👉 Popular Articles -->
      <div class="py-16 bg-surface">
        <VContainer>
          <h3 class="text-h3 text-center mb-6">
            Popular Articles
          </h3>
          <HelpCenterLandingArticlesOverview :articles="apiData.popularArticles" />
        </VContainer>
      </div>

      <!-- 👉 Knowledge Base -->
      <div class="py-12">
        <VContainer>
          <h3 class="text-h3 text-center my-6">
            Knowledge Base
          </h3>
          <HelpCenterLandingKnowledgeBase :categories="apiData.allArticles" />
        </VContainer>
      </div>

      <!-- 👉 Keep Learning -->
      <div class="py-16 bg-surface">
        <VContainer>
          <h3 class="text-h3 text-center mb-6">
            Keep Learning
          </h3>
          <HelpCenterLandingArticlesOverview :articles="apiData.keepLearning" />
        </VContainer>
      </div>

      <!-- 👉 Still need help? -->
      <HelpCenterLandingFooter />

      <div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.help-center-page {
  .search-header {
    background-size: cover !important;
    padding-block-start: 7rem !important;
  }
}

@media (max-width: 960px) and (min-width: 600px) {
  .help-center-page {
    .v-container {
      padding-inline: 2rem !important;
    }

    .search-header {
      padding: 5rem !important;
    }
  }
}

@media (max-width: 599px) {
  .help-center-page {
    .search-header {
      padding-block-end: 2rem !important;
      padding-block-start: 4rem !important;
      padding-inline: 2rem !important;
    }
  }
}
</style>
