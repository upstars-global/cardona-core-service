<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue'
import type { CourseDetails } from '@db/apps/academy/types'
import 'video.js/dist/video-js.css'

const { data } = await useApi<CourseDetails>('/apps/academy/course-details')

const courseDetails = computed(() => data.value)
const panelStatus = ref(0)
</script>

<template>
  <VCard class="overflow-visible course-details">
    <VCardText>
      <VRow>
        <!-- 👉 Course Details  -->
        <VCol
          cols="12"
          md="8"
        >
          <VCardItem class="pa-0 mb-2">
            <VCardTitle class="mb-2">
              {{ courseDetails?.title }}
            </VCardTitle>
            <VCardSubtitle>Prof.<span class="font-weight-medium text-high-emphasis ms-1"> {{ courseDetails?.instructor }}</span></VCardSubtitle>
            <template #append>
              <div class="d-flex gap-2 align-center">
                <VChip
                  variant="tonal"
                  color="error"
                  label
                >
                  UI/UX
                </VChip>
                <IconBtn>
                  <VIcon
                    icon="tabler-share"
                    size="26"
                  />
                </IconBtn>
                <IconBtn>
                  <VIcon
                    icon="tabler-bookmarks"
                    size="26"
                  />
                </IconBtn>
              </div>
            </template>
          </VCardItem>

          <VCard
            flat
            border
          >
            <div class="px-2 pt-2">
              <VideoPlayer
                src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
                poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
                controls
                plays-inline
                :height="$vuetify.display.mdAndUp ? 440 : 250"
                class="w-100 rounded"
              />
            </div>
            <VCardText>
              <h5 class="text-h5 mb-3">
                About this course
              </h5>
              <p class="text-body-1">
                {{ courseDetails?.about }}
              </p>
              <VDivider class="my-6" />
              <h5 class="text-h5 mb-3">
                By the numbers
              </h5>
              <div class="d-flex gap-x-12 gap-y-5 flex-wrap">
                <div>
                  <VList class="card-list">
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-checks" />
                      </template>
                      <VListItemTitle class="text-body-1">
                        Skill Level: {{ courseDetails?.skillLevel }}
                      </VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-user" />
                      </template>
                      <VListItemTitle class="text-body-1">
                        Students: {{ courseDetails?.totalStudents }}
                      </VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-flag" />
                      </template>
                      <VListItemTitle class="text-body-1">
                        Languages: {{ courseDetails?.language }}
                      </VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-file-text" />
                      </template>
                      <VListItemTitle class="text-body-1">
                        Captions: {{ courseDetails?.isCaptions }}
                      </VListItemTitle>
                    </VListItem>
                  </VList>
                </div>
                <div>
                  <VList class="card-list">
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-pencil" />
                      </template>
                      <VListItemTitle class="text-body-1">
                        Lectures: {{ courseDetails?.totalLectures }}
                      </VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-clock" />
                      </template>
                      <VListItemTitle class="text-body-1">
                        Video: {{ courseDetails?.length }}
                      </VListItemTitle>
                    </VListItem>
                  </VList>
                </div>
              </div>
              <VDivider class="my-6" />
              <h5 class="text-h5 mb-3">
                Description
              </h5>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="courseDetails?.description" />
              <VDivider class="my-6" />
              <h5 class="text-h5 mb-2">
                Instructor
              </h5>
              <div class="d-flex align-center">
                <VAvatar
                  :image="courseDetails?.instructorAvatar"
                  size="38"
                  class="me-3"
                />
                <div>
                  <div class="text-body-1 font-weight-medium">
                    {{ courseDetails?.instructor }}
                  </div>
                  <div class="text-sm text-disabled">
                    {{ courseDetails?.instructorPosition }}
                  </div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- 👉 Course Progress -->
        <VCol
          cols="12"
          md="4"
        >
          <div class="course-content">
            <VExpansionPanels
              v-model="panelStatus"
              variant="accordion"
              class="expansion-panels-width-border"
            >
              <template
                v-for="(section, index) in courseDetails?.content"
                :key="index"
              >
                <VExpansionPanel
                  elevation="0"
                  :value="index"
                >
                  <template #title>
                    <div>
                      <h5 class="text-h5 mb-1">
                        {{ section.title }}
                      </h5>
                      <div class="text-medium-emphasis font-weight-normal">
                        {{ section.status }} | {{ section.time }}
                      </div>
                    </div>
                  </template>
                  <template #text>
                    <VList class="card-list px-2">
                      <VListItem
                        v-for="(topic, id) in section.topics"
                        :key="id"
                        class="py-4"
                      >
                        <template #prepend>
                          <VCheckbox
                            class="me-3"
                            :model-value="topic.isCompleted"
                          />
                        </template>
                        <VListItemTitle class="text-high-emphasis font-weight-medium mb-1">
                          {{ topic.title }}
                        </VListItemTitle>
                        <VListItemSubtitle>
                          <span class="text-disabled text-base">{{ topic.time }}</span>
                        </VListItemSubtitle>
                      </VListItem>
                    </VList>
                  </template>
                </VExpansionPanel>
              </template>
            </VExpansionPanels>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list{
  --v-card-list-gap: 1rem;
}

.course-content{
  position: sticky;
  inset-block-start: 5.25rem;
}
</style>

<style lang="scss">
.v-expansion-panel-text__wrapper{
  padding-block: 0.75rem !important;
  padding-inline: 0.5rem !important;
}

.v-expansion-panel--active{
  .v-expansion-panel-title{
    border-block-end: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  }
}
</style>

<style lang="scss">
body .v-layout .v-application__wrap{
  .course-details{
    .v-expansion-panels {
      .v-expansion-panel-title,
      .v-expansion-panel-title--active,
      .v-expansion-panel-title:hover,
      .v-expansion-panel-title:focus,
      .v-expansion-panel-title:focus-visible,
      .v-expansion-panel-title--active:focus,
      .v-expansion-panel-title--active:hover {
        .v-expansion-panel-title__overlay {
          opacity: 0.04 !important;
        }
      }
    }
  }
}
</style>
