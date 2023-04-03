<template>
  <b-modal
    id="slugs-modal"
    header-class="px-2"
    :title="$t('page.games.slugsModal.title')"
    body-class="p-2"
    centered
  >
    <b-alert variant="danger" :show="errorSlugList.isNotEmpty">
      <h4 class="alert-heading">
        {{ $t('page.games.slugsModal.error.title', { value: errorSlugList.length }) }}
      </h4>

      <div class="alert-body">
        <span>
          {{ $t('page.games.slugsModal.error.description') }}
        </span>

        <ul class="errors-list">
          <li v-for="(slug, index) in errorSlugList" :key="index">
            {{ slug }}
          </li>
        </ul>
      </div>
    </b-alert>

    <b-form-group
      class="m-0"
      :label="$t('page.games.slugsModal.slugList')"
      label-for="slugs-textarea"
    >
      <b-form-textarea
        id="slugs-textarea"
        v-model="slugsValue"
        :placeholder="$t('page.games.slugsModal.placeholder')"
        no-resize
        rows="4"
      />

      <small>
        {{ $t('page.games.slugsModal.prompt') }}
      </small>
    </b-form-group>

    <template #modal-footer="{ hide }">
      <b-button variant="outline-secondary" @click="hide">
        {{ $t('action.cancel') }}
      </b-button>

      <b-button
        class="ml-2 d-flex"
        variant="primary"
        :disabled="!slugsValue || isLoadingCheckSlugsList"
        @click="onClickEnableGames(hide)"
      >
        <template v-if="isLoadingCheckSlugsList">
          <b-spinner small class="mr-50" />

          <span>
            {{ $t('common.loading') }}
          </span>
        </template>

        <span v-else>
          {{ $t('page.games.slugsModal.enableGames') }}
        </span>
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { getters, dispatch } from '../../../store'
import { GameActionType, GamesSectionGamesItem } from '../../../@model/games'
import { GamesListItem } from '../../../@model/games'
import { ListData } from '../../../@model'

export default defineComponent({
  name: 'AddingGamesBySlugsModal',

  emits: ['updateCategory'],

  setup(_, { emit }) {
    const slugsValue = ref('')
    const errorSlugList = ref([])

    const isLoadingCheckSlugsList = computed(() => getters.isLoadingEndpoint('games/list/by-slugs'))

    const onClickEnableGames = async (hide: Function) => {
      const slugsList: Array<string> = slugsValue.value
        .split(/[\n|,]+/)
        .map((slug: string) => slug.trim())
        .filter((slug: string) => slug)

      try {
        const { list }: ListData<GamesListItem> = await dispatch('games/checkSlugsList', slugsList)
        const gamesData: Array<GamesSectionGamesItem> = list.map(
          ({ id }: GamesListItem) =>
            ({
              id,
              type: GameActionType.Add,
            } as GamesSectionGamesItem)
        )

        emit('updateCategory', gamesData)

        hide()

        slugsValue.value = ''
        errorSlugList.value = []
      } catch (error: any) {
        if (error?.slugs?.isNotEmpty) errorSlugList.value = error.slugs
      }
    }

    return {
      slugsValue,
      errorSlugList,
      isLoadingCheckSlugsList,
      onClickEnableGames,
    }
  },
})
</script>

<style scoped lang="scss">
.errors-list {
  margin-bottom: 0;
  max-height: 15.5rem;
  overflow: scroll;
}
</style>
