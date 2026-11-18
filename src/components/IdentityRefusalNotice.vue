<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconsList } from '../@model/enums/icons'
import { VColors, VVariants } from '../@model/vuetify'
import { IdentityRefusal } from '../@model/identity'
import { isSessionBootstrapEnabled } from '../configs/identity'
import { signOutOfSession } from '../libs/identity/sign-out'
import { useIdentityStore } from '../stores/identity'

/*
 * What the operator sees when a session cannot be arranged. The issuer
 * answers most refusals with the same body on purpose, so the code the
 * store recorded picks the wording. There is no password form: the app
 * holds nothing to give up, and the only way back to the provider is a full
 * page navigation the operator presses. Where the account itself was
 * refused, the way out is to sign out and come back as somebody else.
 */
const { t } = useI18n()

// Nothing while the branch is off: instantiating the store would be the
// one trace of it left.
const identityStore = isSessionBootstrapEnabled() ? useIdentityStore() : null

const TEST_ID = 'identity-refusal'

const appearance = {
  [IdentityRefusal.AccessNotConfirmed]: { color: VColors.Warning, icon: IconsList.LockIcon },
  [IdentityRefusal.AccessNotGranted]: { color: VColors.Error, icon: IconsList.AlertTriangleIcon },
  [IdentityRefusal.RegistryUnavailable]: { color: VColors.Info, icon: IconsList.InfoCircleIcon },
  [IdentityRefusal.SessionNotConfigured]: { color: VColors.Error, icon: IconsList.AlertTriangleIcon },
  [IdentityRefusal.ProviderSignInNeeded]: { color: VColors.Warning, icon: IconsList.LockIcon },
  [IdentityRefusal.SignInDidNotHelp]: { color: VColors.Error, icon: IconsList.AlertTriangleIcon },
}

const refusal = computed(() => identityStore?.refusal ?? null)

const look = computed(() => refusal.value ? appearance[refusal.value.code] : undefined)

// Retrying is offered only where it can help, and never on its own.
const isRetryable = computed(() => refusal.value?.code === IdentityRefusal.RegistryUnavailable)

// Only a full page navigation can bring the provider's session back. The
// store performs it itself once its probe has confirmed the provider's
// challenge; this button is for the failure the probe could not explain,
// where the app will not move the page behind the operator's back.
const isSignInOffered = computed(() => refusal.value?.code === IdentityRefusal.ProviderSignInNeeded)

// A blocked or unprovisioned account is not helped by signing in again as
// the same person; what helps is another account, which starts with
// leaving both of the provider's sessions.
const isSignOutOffered = computed(() => refusal.value?.code === IdentityRefusal.AccessNotGranted)

const onRetry = async () => {
  const granted = await identityStore?.retry()

  // Everything this page asked for while the session was refused came back
  // empty and nothing knows to ask again, so "try again" reloads.
  if (granted)
    window.location.reload()
}

const onSignIn = () => identityStore?.goToProvider()

const onSignOut = () => signOutOfSession()
</script>

<template>
  <VAlert
    v-if="refusal && look"
    :color="look.color"
    :icon="look.icon"
    :variant="VVariants.Tonal"
    class="ma-4"
    :data-test-id="TEST_ID"
  >
    <VAlertTitle :data-test-id="`${TEST_ID}-title`">
      {{ t(`component.identityRefusal.${refusal.code}.title`) }}
    </VAlertTitle>

    <div :data-test-id="`${TEST_ID}-text`">
      {{ t(`component.identityRefusal.${refusal.code}.text`, { status: refusal.status ?? '' }) }}
    </div>

    <div
      v-if="refusal.requestId"
      class="text-caption mt-1"
      :data-test-id="`${TEST_ID}-request-id`"
    >
      {{ t('component.identityRefusal.requestId', { id: refusal.requestId }) }}
    </div>

    <template #append>
      <VBtn
        v-if="isRetryable"
        :color="look.color"
        :variant="VVariants.Outlined"
        :data-test-id="`${TEST_ID}-retry`"
        @click="onRetry"
      >
        {{ t('component.identityRefusal.retry') }}
      </VBtn>

      <VBtn
        v-if="isSignInOffered"
        :color="look.color"
        :variant="VVariants.Outlined"
        :data-test-id="`${TEST_ID}-sign-in`"
        @click="onSignIn"
      >
        {{ t('component.identityRefusal.signIn') }}
      </VBtn>

      <VBtn
        v-if="isSignOutOffered"
        :color="look.color"
        :variant="VVariants.Outlined"
        :data-test-id="`${TEST_ID}-sign-out`"
        @click="onSignOut"
      >
        {{ t('component.identityRefusal.signOut') }}
      </VBtn>
    </template>
  </VAlert>
</template>
