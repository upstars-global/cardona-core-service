<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconsList } from '../@model/enums/icons'
import { VColors, VVariants } from '../@model/vuetify'
import { isSessionBootstrapEnabled } from '../configs/identity'
import { useIdentityStore } from '../stores/identity'

/*
 * What a freshly provisioned operator sees on the no-access page (ADR-026):
 * the account exists, nobody has given it rights yet, and here is the
 * reference an administrator can look up. Nothing to press: the next step
 * is somebody else's.
 */
const { t } = useI18n()

// Nothing while the branch is off: instantiating the store would be the
// one trace of it left.
const identityStore = isSessionBootstrapEnabled() ? useIdentityStore() : null

const TEST_ID = 'provisioned-notice'

const provisioned = computed(() => identityStore?.provisioned ?? null)
</script>

<template>
  <VAlert
    v-if="provisioned"
    :color="VColors.Info"
    :icon="IconsList.InfoCircleIcon"
    :variant="VVariants.Tonal"
    :data-test-id="TEST_ID"
  >
    <VAlertTitle :data-test-id="`${TEST_ID}-title`">
      {{ t('component.provisionedNotice.title') }}
    </VAlertTitle>

    <div :data-test-id="`${TEST_ID}-text`">
      {{ t('component.provisionedNotice.text') }}
    </div>

    <div
      v-if="provisioned.requestId"
      class="text-caption mt-1"
      :data-test-id="`${TEST_ID}-request-id`"
    >
      {{ t('component.provisionedNotice.requestId', { id: provisioned.requestId }) }}
    </div>
  </VAlert>
</template>
