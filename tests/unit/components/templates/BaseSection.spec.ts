import '../../mocks/base-section/static'
import { afterEach, describe, it, vi } from 'vitest'
import { PageType } from '../../../../src/@model/templates/baseSection'
import DefaultBaseSection from '../../../../src/components/templates/BaseSection/types/default.vue'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { mountComponent } from '../../mocks/base-section/utils'

vi.mock('vue', async importOriginal => {
  const vue = await importOriginal()

  return {
    ...vue,
    defineAsyncComponent: () => DefaultBaseSection,
  }
})

afterEach(() => {
  // Reset mocks after run each test
  vi.clearAllMocks()
})

describe('BaseSection.vue', () => {
  it('Render is default base section', async () => {
    /// Mount the component with required props
    const wrapper = mountComponent({
      pageType: PageType.Empty,
      withReadAction: false,
    })

    /// Wait for Vue lifecycle hooks to complete
    await wrapper.vm.$nextTick()

    /// Check that the main base section renders successfully
    testOn.existElement({ wrapper, testId: 'base-section-default' })
  })
})
