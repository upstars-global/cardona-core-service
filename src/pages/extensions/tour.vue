<script setup lang="ts">
import { useShepherd } from 'vue-shepherd'

const route = useRoute()

// 👉 Hotkey
// eslint-disable-next-line camelcase
const { ctrl_k, meta_k } = useMagicKeys()

// 👉 Tour initialization
let tour: any = null

// 👉 watch command palette and route change
/* eslint-disable camelcase */
watch([
  ctrl_k,
  meta_k,
  () => route.path,
], () => {
  if (tour.isActive())
    tour.cancel()
})
/* eslint-enable */

onMounted(() => {
  const navbar = document.querySelector('.layout-navbar')

  tour = useShepherd({
    useModalOverlay: true,
    stepsContainer: document.querySelector('.layout-wrapper'),
    modelContainer: document.querySelector('.layout-wrapper'),
    defaultStepOptions: {
      cancelIcon: {
        enabled: true,
      },
      modalOverlayOpeningPadding: 2,
      modalOverlayOpeningRadius: 5,
    },
  })

  //  👉 Tour steps
  tour.addSteps([
    {
      id: 'welcome',
      title: 'Welcome',
      arrow: true,
      attachTo: { element: navbar, on: 'bottom' },
      text: 'Welcome to our tour page, Guide users to the key features of the product.',
      buttons: [
        {
          action: tour.cancel,
          classes: 'backBtnClass',
          text: 'Back',
        },
        {
          action: tour.next,
          text: 'Next',
          classes: 'nextBtnClass',
        },
      ],
    },
    {
      id: 'notification',
      title: 'Notifications',
      arrow: true,
      attachTo: { element: document.querySelector('#notification-btn'), on: 'bottom' },
      text: 'Manage your notifications and stay up-to-date with latest updates.',
      buttons: [
        {
          label: 'Back',
          text: 'Back',
          action: tour.back,
          classes: 'backBtnClass',
        },
        {
          label: 'Next',
          text: 'Next',
          action: tour.next,
          classes: 'nextBtnClass',
        },
      ],
    },
    {
      id: 'footer',
      title: 'Footer',
      arrow: true,
      attachTo: { element: document.querySelector('.layout-footer'), on: 'bottom' },
      text: 'Footer section of the page.',
      buttons: [
        {
          label: 'Back',
          text: 'Back',
          action: tour.back,
          classes: 'backBtnClass',
        },
        {
          label: 'Finish',
          text: 'Finish',
          action: tour.complete,
          classes: 'nextBtnClass',
        },
      ],
    },

  ])
})
</script>

<template>
  <div>
    <VCard title="Tour">
      <VCardText>
        <VBtn
          variant="elevated"
          @click="() => { tour && tour.start() }"
        >
          Start Tour
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/shepherd.scss";
</style>
