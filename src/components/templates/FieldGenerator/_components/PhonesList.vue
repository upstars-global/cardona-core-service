<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import store from '../../../../store'
import { IconsList } from '../../../../@model/enums/icons'
import { IPhonesListValue } from '../../../../@model/baseField/phones-list'
import PhoneField from '../../../../components/templates/FieldGenerator/_components/PhoneField.vue'
import SelectField from '../../../../components/templates/FieldGenerator/_components/SelectField.vue'

const countries = computed(() => store.getters['localeCore/countries'])

const itemsData: Ref<IPhonesListValue> = ref([{ phone: '+380', country: 'Ukraine' }])

const addItem = () => {
  itemsData.value = [...itemsData.value, { phone: '+', country: '' }]
}

const removeItem = (index: number) => {
  itemsData.value = itemsData.value.filter((_, itemIndex) => itemIndex !== index)
}
</script>

<template>
  <div>
    <div>Phone list</div>
    <div class="items">
      <b-row v-for="(data, key) in itemsData" :key="key" class="items__field">
        <b-col><phone-field v-model="data.phone" :field="{}" /></b-col>
        <b-col><select-field v-model="data.country" :field="{ options: countries }" /></b-col>
        <b-col
          ><b-button variant="flat-danger" class="btn-icon" @click="removeItem(key)"
            ><feather-icon :icon="IconsList.Trash2Icon" /></b-button
        ></b-col>
      </b-row>
    </div>
    <div>
      <div class="action">
        <b-button variant="outline-secondary" size="sm" class="py-50 px-1" @click="addItem">
          <feather-icon :icon="IconsList.PlusIcon" /> Add</b-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.items__field + .items__field {
  margin-top: 1.5rem;
}

.items__field:last-child {
  margin-bottom: 1.5rem;
}
</style>