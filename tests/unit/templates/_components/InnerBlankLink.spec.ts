import { describe, expect, it, vi } from 'vitest'
import { useRouter } from 'vue-router'
import InnerBlankLink from '../../../../src/components/templates/_components/InnerBlankLink.vue'
import {
  getWrapperElement,
  setMountComponent,
} from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { copyToClipboard } from '../../../../src/helpers/clipboard'
import { IconsList } from '../../../../src/@model/enums/icons'
import { testOn } from '../shared-tests/test-case-generator'

const mockRouter = {
  resolve: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

vi.spyOn(window, 'open').mockImplementation(() => {})

const getMountInnerBlankLink = setMountComponent(InnerBlankLink)

describe('InnerBlankLink', () => {
  const router = useRouter()

  const value = {
    title: 'Test Link',
    route: { name: 'test-route' },
  }

  const testIdIconLink = 'icon-link'

  it('Renders correctly with default props', () => {
    const wrapper = getMountInnerBlankLink({ value })

    testOn.equalTextValue({ wrapper }, value.title)
    testOn.existElement({ wrapper, testId: testIdIconLink })
  })

  it('Applies correct size class when size is large', () => {
    const wrapper = getMountInnerBlankLink({ value, size: VSizes.Large })

    testOn.existClass({ wrapper }, 'text-h5')
  })

  it('Applies correct size class when size is small', () => {
    const wrapper = getMountInnerBlankLink({ value, size: VSizes.Small })

    testOn.existClass({ wrapper }, 'text-body-2')
  })

  it('Copies text to clipboard when copy icon is clicked', async () => {
    const copyElement = 'Text to copy'
    const wrapper = getMountInnerBlankLink({ value, copyElement })

    await getWrapperElement({ wrapper, testId: 'icon-copy' }).trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith(copyElement)
  })

  it('Does not render copy icon when copyElement is not provided', () => {
    const wrapper = getMountInnerBlankLink({ value })

    testOn.existElement({ wrapper, testId: testIdIconLink })
    testOn.existClass({ wrapper, testId: testIdIconLink }, IconsList.ExternalLinkIcon)
  })

  it('Opens a new tab when link icon is clicked', async () => {
    const link = 'https://example.com'
    const router = useRouter()

    router.resolve = vi.fn().mockReturnValue({ href: link })

    const wrapper = getMountInnerBlankLink({ value })

    await getWrapperElement({ wrapper, testId: testIdIconLink }).trigger('click')

    expect(window.open).toHaveBeenCalledWith(link, '_blank')
  })
})
