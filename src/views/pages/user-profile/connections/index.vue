<script setup lang="ts">
import type { ConnectionsTab } from '@db/pages/profile/types'

const router = useRoute('pages-user-profile-tab')
const connectionData = ref<ConnectionsTab[]>([])

const fetchProjectData = async () => {
  if (router.params.tab === 'connections') {
    const data = await $api('/pages/profile', {
      query: {
        tab: router.params.tab,
      },
    }).catch(err => console.log(err))

    connectionData.value = data
  }
}

watch(router, fetchProjectData, { immediate: true })
</script>

<template>
  <VRow>
    <VCol
      v-for="data in connectionData"
      :key="data.name"
      sm="6"
      lg="4"
      cols="12"
    >
      <VCard>
        <div class="vertical-more">
          <MoreBtn
            :menu-list="[
              { title: 'Share connection', value: 'Share connection' },
              { title: 'Block connection', value: 'Block connection' },
              { type: 'divider', class: 'my-2' },
              { title: 'Delete', value: 'Delete', class: 'text-error' },
            ]"
            item-props
          />
        </div>

        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center gap-y-5">
            <VAvatar
              size="100"
              :image="data.avatar"
            />

            <div class="text-center">
              <h4 class="text-h4">
                {{ data.name }}
              </h4>
              <h6 class="text-h6">
                {{ data.designation }}
              </h6>
            </div>

            <div class="d-flex align-center flex-wrap gap-2">
              <VChip
                v-for="chip in data.chips"
                :key="chip.title"
                label
                :color="chip.color"
                size="small"
              >
                {{ chip.title }}
              </VChip>
            </div>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <div class="d-flex justify-space-around">
            <div class="text-center">
              <h4 class="text-h4">
                {{ data.projects }}
              </h4>
              <span class="text-body-1">Projects</span>
            </div>
            <div class="text-center">
              <h4 class="text-h4">
                {{ data.tasks }}
              </h4>
              <span class="text-body-1">Tasks</span>
            </div>
            <div class="text-center">
              <h4 class="text-h4">
                {{ data.connections }}
              </h4>
              <span class="text-body-1">Connections</span>
            </div>
          </div>

          <div class="d-flex justify-center gap-4 mt-5">
            <VBtn
              :prepend-icon="data.isConnected ? 'tabler-user-check' : 'tabler-user-plus'"
              :variant="data.isConnected ? 'elevated' : 'tonal'"
            >
              {{ data.isConnected ? 'connected' : 'connect' }}
            </VBtn>

            <IconBtn
              variant="tonal"
              class="rounded"
            >
              <VIcon
                icon="tabler-mail"
                color="secondary"
              />
            </IconBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.vertical-more {
  position: absolute;
  inset-block-start: 1rem;
  inset-inline-end: 0.5rem;
}
</style>
