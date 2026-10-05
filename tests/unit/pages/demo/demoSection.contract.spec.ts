import { vi } from 'vitest'
import '../../mocks/base-section/static'
import { createStoreMockFactory } from '../../mocks/shared/createStoreMockFactory'
import { createBaseSectionContract } from '../../templates/contracts/createBaseSectionContract'
import { useDemoSection } from '../../../../src/pages/demo/useDemo'

// useDemoSection wires a real custom store (useDemoStore) — vi.mock is static/hoisted per
// file, so the generator can't mock it itself; this spec file owns that, same as production
// code would need to if it swapped the store.
const demoStoreMockFactory = createStoreMockFactory([
  'fetchEntityList',
  'fetchOptions',
  'readEntity',
  'updateEntity',
  'deleteEntity',
] as const)

vi.mock('../../../../src/stores/demo', () => ({
  useDemoStore: () => demoStoreMockFactory.mock,
}))

// DemoForm builds its SEO/translation fields from the active project's locales
// (src/@model/translations.ts reads useUserStore().getSelectedProject.locales), and
// transformFormData (src/helpers/index.ts) writes fieldTranslations keyed by
// getSelectedProject.mainLocale (defaults to 'ru' if absent) — both must agree, or
// submit throws trying to write into a locale key that was never built.
vi.mock('../../../../src/stores/user', () => ({
  useUserStore: () => ({
    getSelectedProject: { locales: ['ru'], mainLocale: 'ru' },
  }),
}))

const sampleEntityData = {
  id: '1',
  switch: true,
  text: 'hello',
}

createBaseSectionContract({
  useEntity: useDemoSection,
  formVariants: [
    { input: {}, description: 'empty (create)' },
    { input: sampleEntityData, description: 'full (update)' },
  ],
  sampleEntityData,

  // useDemoStore overrides fetchEntityList/fetchOptions/readEntity/updateEntity/deleteEntity
  // but NOT createEntity — createEntity falls back to baseStoreCore, exactly like the
  // per-action independent resolution documented in README.md.
  customStoreMock: demoStoreMockFactory.mock,
  actions: {
    create: { expect: 'createEntity' },
    update: { expect: 'updateEntity' },
    read: { expect: 'readEntity' },
  },
})
