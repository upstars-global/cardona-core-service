<template>
  <base-list
    ref="allGamesList"
    class="all-games-list"
    :config="allGamesListConfig"
    :use-list="useAllGames"
  >
    <template #right-search-btn>
      <b-button v-b-modal.slugs-modal variant="outline-secondary" class="btn-icon ml-1" size="sm">
        <feather-icon icon="LayersIcon" />
      </b-button>
    </template>

    <template #table-info="{ selectedItems, total }">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h5 class="m-0 py-50">
          {{ $t('title.game.all') }}
        </h5>

        <div v-if="selectedItems.isNotEmpty" class="d-flex align-items-center">
          <div class="border-right px-1 mr-1">
            {{
              $t('page.games.selectedCounter', {
                items: selectedItems.length,
                total,
              })
            }}
          </div>

          <b-button variant="outline-secondary" size="sm" @click="addToCategory(selectedItems)">
            {{ $t('action.add') }}
          </b-button>
        </div>

        <b-button v-else-if="total" variant="outline-secondary" size="sm" @click="onClickAddAll">
          {{ $t('action.addAll', { total }) }}
        </b-button>
      </div>
    </template>
  </base-list>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseList from '../BaseList/index.vue'
import { BaseListConfig } from '../BaseList/model'
import { useAllGames } from './useGameCard'
import {
  GamesListItem,
  IGamesFilters,
  GamesSectionGamesItem,
  GameActionType,
} from '../../../@model/games'
import store from '../../../store'
import { useUtils as useI18nUtils } from '../../../@core/libs/i18n'
import { ConfirmModal, useModal } from '../../../helpers/bvModal'
import { FilterType } from '../../../@model/filter'

export default defineComponent({
  name: 'AllGamesCard',
  components: {
    BaseList,
  },

  props: {
    entityName: {
      type: String,
      required: true,
    },

    disabledFilter: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['updateCategory'],

  setup(props, { emit }) {
    const { t } = useI18nUtils()
    const { confirmationModal } = useModal()
    const allGamesList: any = ref(null)
    const allGamesListConfig = new BaseListConfig({
      selectable: true,
      selectMode: 'multi',
      small: true,
      defaultPerPage: 50,
      skeletonColumns: 1,
      skeletonRows: 30,
      filterList: props.disabledFilter
        ? []
        : [
            {
              type: FilterType.GamesType,
              key: 'type',
            },
            {
              type: FilterType.GamesProducers,
              key: 'producerNames',
            },
            {
              type: FilterType.GamesCategories,
              key: 'categoryNames',
            },
          ],
      withSearch: true,
      searchPlaceholder: t('placeholder.search.nameIdSlug'),
      withIndependentPagination: true,
      withCustomModuleName: true,
    })

    // TODO: Game deactivation logic will be completed later
    // const deactivateGames = () => {
    //   const enabledGamesIds: Array<string> = store.getters['gamesCategoriesGames/enabledGames'].map(
    //     ({ id }) => id
    //   )
    //   const baseList: HTMLElement | null = document.querySelector('.all-games-list')
    //   const allSelected = baseList!.querySelectorAll('.b-table-row-selected')
    //
    //   allSelected.forEach((element) => {
    //     const checkbox: HTMLElement | null = element.querySelector('.table-checkbox')
    //     const id: string | null = checkbox!.getAttribute('id')
    //
    //     if (enabledGamesIds.includes(String(id))) {
    //       element.classList.add('pointer-events-none')
    //     } else {
    //       element.classList.remove('pointer-events-none')
    //
    //       const index: string | undefined = checkbox?.dataset.index
    //
    //       index && allGamesList.value?.onChangeSelected(false, Number(index))
    //     }
    //   })
    // }

    // onMounted(() => {
    //   watch(() => store.getters['gamesCategoriesGames/enabledGames'], deactivateGames, {
    //     deep: true,
    //     immediate: true,
    //   })
    // })

    const addToCategory = (games: Array<GamesListItem>) => {
      const transformedGames: Array<GamesSectionGamesItem> = games.map(
        ({ id }) =>
          ({
            id,
            type: GameActionType.Add,
          } as GamesSectionGamesItem)
      )

      emit('updateCategory', transformedGames)
    }

    const onClickAddAll = async () => {
      const isConfirmed: boolean = await confirmationModal('addAllGames', ConfirmModal.Add)

      if (!isConfirmed) return

      const perPage: number = store.getters['games/totalGames']
      const filter: IGamesFilters = store.getters['games/appliedFilters']

      const { list } = await store.dispatch(`games/fetchGamesList`, { data: { perPage, filter } })

      addToCategory(list)
    }

    return {
      allGamesList,
      allGamesListConfig,
      useAllGames,
      addToCategory,
      onClickAddAll,
    }
  },
})
</script>
