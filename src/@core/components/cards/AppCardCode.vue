<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';

import { ref, computed } from 'vue';

import { COOKIE_MAX_AGE_1_YEAR } from '../../../utils/constants';

import { useCookie } from '../../composable/useCookie';

import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import Prism from 'vue-prism-component'

type CodeLanguages = 'ts' | 'js'

interface Props {
  title: string
  code: CodeProp
  codeLanguage?: string
  noPadding?: boolean
}

type CodeProp = Record<CodeLanguages, string>

const props = withDefaults(defineProps<Props>(), {
  codeLanguage: 'markup',
  noPadding: false,
})

const preferredCodeLanguage = useCookie<CodeLanguages>('preferredCodeLanguage', {
  default: () => 'ts',
  maxAge: COOKIE_MAX_AGE_1_YEAR,
})

const isCodeShown = ref(false)

const { copy, copied } = useClipboard({ source: computed(() => props.code[preferredCodeLanguage.value]) })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>{{ props.title }}</VCardTitle>
      <template #append>
        <IconBtn
          size="small"
          :color="isCodeShown ? 'primary' : 'default'"
          :class="isCodeShown ? '' : 'text-disabled'"
          @click="isCodeShown = !isCodeShown"
        >
          <VIcon
            size="20"
            icon="tabler-code"
          />
        </IconBtn>
      </template>
    </VCardItem>
    <slot v-if="noPadding" />
    <VCardText v-else>
      <slot />
    </VCardText>
    <VExpandTransition>
      <div v-show="isCodeShown">
        <VDivider />

        <VCardText class="d-flex gap-y-3 flex-column">
          <div class="d-flex justify-end">
            <VBtnToggle
              v-model="preferredCodeLanguage"
              mandatory
              variant="outlined"
              density="compact"
            >
              <VBtn
                value="ts"
                :color="preferredCodeLanguage === 'ts' ? 'primary' : 'default'"
              >
                <VIcon
                  icon="custom-typescript"
                  :color="preferredCodeLanguage === 'ts' ? 'primary' : 'secondary'"
                />
              </VBtn>

              <VBtn
                value="js"
                :color="preferredCodeLanguage === 'js' ? 'primary' : 'default'"
              >
                <VIcon
                  icon="custom-javascript"
                  :color="preferredCodeLanguage === 'js' ? 'primary' : 'secondary'"
                />
              </VBtn>
            </VBtnToggle>
          </div>

          <div class="position-relative">
            <Prism
              :key="props.code[preferredCodeLanguage]"
              :language="props.codeLanguage"
              :style="$vuetify.locale.isRtl ? 'text-align: right' : 'text-align: left'"
            >
              {{ props.code[preferredCodeLanguage] }}
            </Prism>
            <IconBtn
              class="position-absolute app-card-code-copy-icon"
              color="white"
              @click="() => { copy() }"
            >
              <VIcon
                :icon="copied ? 'tabler-check' : 'tabler-copy'"
                size="20"
              />
            </IconBtn>
          </div>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>
</template>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
  border-radius: vuetify.$card-border-radius;
}

.app-card-code-copy-icon {
  inset-block-start: 1.2em;
  inset-inline-end: 0.8em;
}
</style>
