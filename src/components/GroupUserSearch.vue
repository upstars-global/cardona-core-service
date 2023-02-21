<template>
  <div class="group-user-search">
    <b-row>
      <b-col md="4">
        <b-form-group :label="label" label-for="user-search" class="mb-0">
          <v-select
            value=""
            :placeholder="$t('placeholder.loginOrEmail')"
            :dir="$store.getters['appConfig/dirOption']"
            label="userName"
            :options="notSelectedUsers"
            @search="fetchOptions"
            @input="onChange"
          >
            <template #search="{ attributes, events }">
              <div class="d-flex align-items-center search-select-icon">
                <feather-icon icon="SearchIcon" />
              </div>

              <input class="vs__search" v-bind="attributes" v-on="events" />
            </template>

            <template #no-options="{ loading, search }">
              <div v-if="!search && !loading">
                {{ $t('common.enterSomething') }}
              </div>

              <div v-else>
                {{ $t('common.nothingFound') }}
              </div>
            </template>
          </v-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row v-if="value.isNotEmpty" class="mt-50">
      <b-col v-for="(item, index) in value" :key="index" md="4">
        <b-input-group class="input-group-merge mt-1">
          <b-form-input :value="item.userName" disabled />

          <b-input-group-append class="field-group-disabled" is-text>
            <feather-icon
              class="text-danger cursor-pointer"
              icon="Trash2Icon"
              @click="onRemove(item.id)"
            />
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { fetchUsers } from '@/_@queries/user'
import vSelect from 'vue-select'
import { ref, PropType, defineComponent, computed } from 'vue'
import { UserInfo } from '@model/user'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'GroupUserSearch',
  components: {
    vSelect,
  },

  props: {
    value: {
      type: Array as PropType<UserInfo[]>,
      default: () => [],
    },

    label: {
      type: String,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const userList = ref<UserInfo[]>([])

    const notSelectedUsers = computed(() => {
      const ids = props.value.map(({ id }) => id)

      return userList.value.filter(({ id }) => !ids.includes(id))
    })

    const fetchOptions = debounce(async (search: string, loading: Function) => {
      if (!search) return

      loading(true)

      try {
        const { list } = await fetchUsers({
          perPage: 100,
          filter: {
            search,
          },
        })

        userList.value = list
      } finally {
        loading(false)
      }
    }, 250)

    const onRemove = (id: number) => {
      emit(
        'input',
        props.value.filter((item) => item.id !== id)
      )
    }

    const onChange = (item: UserInfo) => {
      emit('input', [...props.value, item])
    }

    return {
      notSelectedUsers,
      fetchOptions,
      onChange,
      onRemove,
    }
  },
})
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/_include';
@import '~@core/scss/base/components/_include';

.field-group-disabled {
  cursor: pointer;

  .input-group-text {
    background: $custom-select-disabled-bg;
  }
}
</style>
