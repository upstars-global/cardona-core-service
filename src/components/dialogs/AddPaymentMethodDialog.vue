<script setup lang="ts">
import americanExDark from '@images/icons/payments/img/ae-dark.png'
import americanExLight from '@images/icons/payments/img/american-express.png'
import dcDark from '@images/icons/payments/img/dc-dark.png'
import dcLight from '@images/icons/payments/img/dc-light.png'
import jcbDark from '@images/icons/payments/img/jcb-dark.png'
import jcbLight from '@images/icons/payments/img/jcb-light.png'
import masterCardDark from '@images/icons/payments/img/master-dark.png'
import masterCardLight from '@images/icons/payments/img/mastercard.png'
import visaDark from '@images/icons/payments/img/visa-dark.png'
import visaLight from '@images/icons/payments/img/visa-light.png'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const visa = useGenerateImageVariant(visaLight, visaDark)
const masterCard = useGenerateImageVariant(masterCardLight, masterCardDark)
const americanEx = useGenerateImageVariant(americanExLight, americanExDark)
const jcb = useGenerateImageVariant(jcbLight, jcbDark)
const dc = useGenerateImageVariant(dcLight, dcDark)

interface Props {
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', val: boolean): void
}

const dialogVisibleUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const paymentMethodsData = [
  {
    title: 'Visa',
    type: 'Credit Card',
    img: visa,
  },
  {
    title: 'American Express',
    type: 'Credit Card',
    img: americanEx,
  },
  {
    title: 'Mastercard',
    type: 'Credit Card',
    img: masterCard,
  },
  {
    title: 'JCB',
    type: 'Credit Card',
    img: jcb,
  },
  {
    title: 'Diners Club',
    type: 'Credit Card',
    img: dc,
  },

]
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="900"
    @update:model-value="dialogVisibleUpdate"
  >
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn @click="emit('update:isDialogVisible', false)" />

    <VCard class="refer-and-earn-dialog">
      <VCardText class="pa-5 pa-sm-16">
        <h3 class="text-h3 text-center mb-2">
          Add payment methods
        </h3>
        <p class="text-sm-body-1 text-center text-disabled">
          Supported payment methods
        </p>

        <div
          v-for="(item, index) in paymentMethodsData"
          :key="index"
        >
          <div class="d-flex justify-space-between align-center py-4 text-high-emphasis font-weight-medium gap-x-4">
            <div class="d-flex align-center">
              <VImg
                :src="item.img.value"
                height="30"
                width="50"
                class="me-3"
              />
              <div>{{ item.title }}</div>
            </div>
            <div class="d-none d-sm-block">
              {{ item.type }}
            </div>
          </div>
          <VDivider />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.refer-link-input {
  .v-field--appended {
    padding-inline-end: 0;
  }

  .v-field__append-inner {
    padding-block-start: 0.125rem;
  }
}
</style>
