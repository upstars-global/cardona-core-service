<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <b-card-title>
          {{ $t('title.game.listOfGames') }}
        </b-card-title>
      </b-card-header>

      <b-card-body>
        <b-row>
          <b-col v-if="!onlyView" md="6">
            <all-games-card
              :entity-name="entityName"
              :disabled-filter="disabledFilter"
              @updateCategory="onUpdateCategory"
            />
          </b-col>

          <b-col md="6">
            <enabled-games-card
              :id="id"
              ref="enabledGamesCard"
              :entity-name="entityName"
              :only-view="onlyView"
              @updateCategory="onUpdateCategory"
            />
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <adding-games-by-slugs-modal @updateCategory="onUpdateCategory" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dispatch } from '../../../store'
import AllGamesCard from './AllGamesCard.vue'
import EnabledGamesCard from './EnabledGamesCard.vue'
import { GamesSectionGamesItem } from '../../../@model/games'
import AddingGamesBySlugsModal from './AddingGamesBySlugsModal.vue'

export default defineComponent({
  name: 'GamesCard',
  components: {
    AddingGamesBySlugsModal,
    AllGamesCard,
    EnabledGamesCard,
  },

  props: {
    id: {
      type: String,
      default: '',
    },

    onlyView: {
      type: Boolean,
      default: false,
    },

    entityName: {
      type: String,
      required: true,
    },

    disabledFilter: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const enabledGamesCard = ref<InstanceType<typeof EnabledGamesCard> | null>(null)

    const onUpdateCategory = async (games: Array<GamesSectionGamesItem>) => {
      const id: string = props.id
      await dispatch(`baseStoreCore/updateEntity`, {
        type: props.entityName,
        data: {
          form: {
            id,
            games,
          },
        },
      })

      enabledGamesCard.value!.reFetchEnabledGamesList()
    }

    return {
      enabledGamesCard,
      onUpdateCategory,
    }
  },
})
</script>
