<template>
  <b-row v-if="$route.meta.breadcrumb || $route.meta.title" class="content-header">
    <!-- Content Left -->
    <b-col class="content-header-left mb-2" cols="12" md="9">
      <b-row class="breadcrumbs-top">
        <b-col cols="12">
          <h2 class="content-header-title float-left pr-1 mb-0">
            {{ $t(`title.${$route.meta.title}`) }}
          </h2>
          <div class="breadcrumb-wrapper">
            <b-breadcrumb>
              <b-breadcrumb-item to="/">
                <feather-icon icon="HomeIcon" size="16" class="align-text-top" />
              </b-breadcrumb-item>
              <b-breadcrumb-item
                v-for="item in $route.meta.breadcrumb"
                :key="item.text"
                :active="item.active"
                :to="item.to"
              >
                {{ $t(`title.${item.text}`) }}
              </b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </b-col>
      </b-row>
    </b-col>

    <!-- Content Right -->
    <b-col class="content-header-right text-md-right d-md-block d-none mb-1" md="3" cols="12">
    </b-col>
  </b-row>
</template>

<script>
import { BBreadcrumb, BBreadcrumbItem, BRow, BCol } from 'bootstrap-vue'

export default {
  components: {
    BBreadcrumb,
    BBreadcrumbItem,
    BRow,
    BCol,
  },
}
</script>
