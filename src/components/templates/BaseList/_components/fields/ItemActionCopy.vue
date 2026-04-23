<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { IconsList } from '../../../../../@model/enums/icons'
import { useAppConfigCoreStore } from '../../../../../stores/appConfigCore'
import { useUserStore } from '../../../../../stores/user'
import type { OptionsItem } from '../../../../../@model'

defineOptions({
  name: 'ItemActionCopy',
})

const props = withDefaults(defineProps<Props>(), {
  copyForAllProjects: false,
})

interface Props {
  copyForAllProjects?: boolean
  item: any
  createPageName: string
}

const userStore = useUserStore()
const appConfigCoreStore = useAppConfigCoreStore()
const router = useRouter()
const isSelectedProject = (project: string) => userStore.getSelectedProject?.name === project

const userProjects = computed((): OptionsItem & { alias: string }[] => appConfigCoreStore.verifiedProjects.map(item => ({
  id: item.id,
  alias: item.alias,
  title: item.name,
})))

const onCreateCopy = () => router.push({ name: props.createPageName, params: { id: props.item.id } })

const onCreateCopyForAnotherProject = ({ id, project }: { id: string; project: string }, isSelectedProject?: boolean): void => {
  const query = isSelectedProject ? {} : { forProject: project, fromProject: userStore.getSelectedProject.alias }

  const routeData = router.resolve({ name: props.createPageName, params: { type: 'copy', id, project }, query })

  window.open(routeData.href, '_blank')
}
</script>

<template>
  <VMenu
    v-if="copyForAllProjects && userProjects.length > 1"
    activator="parent"
    location="start"
    open-on-hover
  >
    <template #activator="{ props, isActive }">
      <VListItem
        class="cursor-pointer"
        v-bind="props"
        active-class="text-base-color bg-primary"
        :class="{ 'bg-grey-100': isActive }"
      >
        <template #prepend>
          <VIcon :icon="IconsList.CopyPlusIcon" />
        </template>
        <VListItemTitle>
          {{ $t('action.makeCopy') }}
        </VListItemTitle>
        <template #append>
          <VIcon :icon="IconsList.ChevronRightIcon" />
        </template>
      </VListItem>
    </template>

    <VList class="actions-list">
      <VListItem
        v-for="project in userProjects"
        :key="project.id"
        class="cursor-pointer item-list--hover"
        @click="onCreateCopyForAnotherProject(
          { id: item.id, project: project.alias },
          isSelectedProject(project.title))"
      >
        <VListItemTitle class="item-list--title">
          {{ project.title }} <span v-if="isSelectedProject(project.title)">{{ $t('common.current') }}</span>
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
  <VListItem
    v-else
    data-test-id="copy"
    @click="onCreateCopy"
  >
    <template #prepend>
      <VIcon :icon="IconsList.CopyPlusIcon" />
    </template>
    <VListItemTitle>
      {{ $t('action.makeCopy') }}
    </VListItemTitle>
  </VListItem>
</template>
