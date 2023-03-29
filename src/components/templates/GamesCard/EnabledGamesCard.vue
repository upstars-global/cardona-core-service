<template>
  <base-list
    ref="enabledGamesList"
    class="enabled-games-list"
    :class="{ 'only-view': onlyView }"
    :config="enabledGamesListConfig"
    :use-list="() => useEnabledGames(entityName)"
    @end="dragChanged"
  >
    <template #table-info="{ selectedItems, total }">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h5 class="m-0 py-50">
          {{ $t('title.game.added') }}
        </h5>

        <template v-if="!onlyView">
          <div v-if="selectedItems.isNotEmpty" class="d-flex align-items-center">
            <div class="border-right px-1 mr-1">
              {{
                $t('page.games.selectedCounter', {
                  items: selectedItems.length,
                  total,
                })
              }}
            </div>

            <b-button
              variant="outline-danger"
              size="sm"
              @click="onClickDeleteSelected(selectedItems)"
            >
              {{ $t('action.removeSelected') }}
            </b-button>
          </div>

          <b-button v-else-if="total" variant="outline-danger" size="sm" @click="onClickDeleteAll">
            {{ $t('action.removeAll', { total }) }}
          </b-button>
        </template>
      </div>
    </template>
  </base-list>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseList from '../../../components/templates/BaseList/index.vue'
import { BaseListConfig } from '../../../components/templates/BaseList/model'
import { useEnabledGames } from './useGameCard'
import { useUtils as useI18nUtils } from '../../../@core/libs/i18n'
import { GameActionType, GamesSectionGamesItem, IGamesSectionGamesFilters } from '../../../@model/games'
import { dispatch, getters } from '../../../store'
import { useModal } from '../../../helpers/bvModal'

export default defineComponent({
  name: 'EnabledGamesCard',
  components: {
    BaseList,
  },

  props: {
    id: {
      type: String,
      required: true,
    },

    onlyView: {
      type: Boolean,
      default: false,
    },

    entityName: {
      type: String,
      required: true,
    },
  },

  emits: ['updateCategory'],

  setup(props, { emit }) {
    const { confirmationModal } = useModal()
    const { t } = useI18nUtils()
    const enabledGamesList: any = ref(null)
    const enabledGamesListConfig = new BaseListConfig({
      selectable: !props.onlyView,
      selectMode: 'multi',
      small: true,
      defaultPerPage: 50,
      skeletonColumns: 1,
      skeletonRows: 30,
      emptyText: t('emptyState.enabledStaticPagesGames'),
      withSearch: !props.onlyView,
      searchPlaceholder: t('placeholder.search.nameIdSlug'),
      withIndependentPagination: true,
      draggable: !props.onlyView,
      saveCountItem: true,
      staticFilters: { id: props.id },
    })

    const reFetchEnabledGamesList = () => {
      enabledGamesList.value?.reFetchList()
    }

    const deleteSelected = (games: Array<GamesSectionGamesItem>) => {
      const transformedGames: Array<GamesSectionGamesItem> = games.map(
        ({ id }) =>
          ({
            id,
            type: GameActionType.Delete,
          } as GamesSectionGamesItem)
      )

      emit('updateCategory', transformedGames)
    }

    const onClickDeleteSelected = async (selectedGames: Array<GamesSectionGamesItem>) => {
      const isConfirmed: boolean = await confirmationModal('deleteGame')

      if (!isConfirmed) return

      deleteSelected(selectedGames)
    }

    const onClickDeleteAll = async () => {
      const isConfirmed: boolean = await confirmationModal('deleteAllGames')

      if (!isConfirmed) return

      const perPage: number = getters['baseStore/totalItem']
      const filter: IGamesSectionGamesFilters = getters['baseStore/appliedFilters']

      const { list } = await dispatch(`baseStore/fetchGamesList`, {
        type: props.entityName,
        data: {
          perPage,
          filter: {
            ...filter,
            id: props.id,
          },
        },
      })

      deleteSelected(list)
    }

    const dragChanged = async (e) => {
      if (e) {
        const localItems: GamesSectionGamesItem[] =
          enabledGamesList?.value?.$refs?.refListTable?.localItems

        if (!localItems) return
        const id: string = localItems[e.oldIndex].id
        const position: number = e.newIndex === 0 ? 1 : Number(localItems[e.newIndex].position) + 1

        emit('updateCategory', [
          {
            id,
            position,
            type: 'upd',
          },
        ] as Array<GamesSectionGamesItem>)
      }
      return true
    }

    return {
      enabledGamesList,
      enabledGamesListConfig,
      useEnabledGames,
      reFetchEnabledGamesList,
      onClickDeleteSelected,
      onClickDeleteAll,
      dragChanged,
    }
  },
})
</script>

<style lang="scss" scoped>
.enabled-games-list::v-deep {
  .our-table {
    th {
      &:last-child {
        width: 40%;
      }
    }
  }

  &.only-view {
    .our-table {
      th {
        &:first-child {
          width: 0;
        }
      }
    }
  }
}
</style>
