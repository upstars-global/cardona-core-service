import { describe, expect, it, vi } from 'vitest'
import { useRouter } from 'vue-router'
import InnerBlankLink from '../../../../src/components/templates/_components/InnerBlankLink.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { copyToClipboard } from '../../../../src/helpers/clipboard'
import { IconsList } from '../../../../src/@model/enums/icons'

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

  it('Renders correctly with default props', () => {
    const wrapper = getMountInnerBlankLink({ value })

    expect(wrapper.text()).toContain(value.title)
    expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(true)
  })

  it('Applies correct size class when size is large', () => {
    const wrapper = getMountInnerBlankLink({ value, size: VSizes.Large })

    expect(wrapper.classes()).toContain('text-h4')
  })

  it('Applies correct size class when size is small', () => {
    const wrapper = getMountInnerBlankLink({ value, size: VSizes.Small })

    expect(wrapper.classes()).toContain('text-subtitle-1')
  })

  it('Copies text to clipboard when copy icon is clicked', async () => {
    const copyElement = 'Text to copy'
    const wrapper = getMountInnerBlankLink({ value, copyElement })

    await wrapper.find(getSelectorTestId('icon-copy')).trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith(copyElement)
  })

  it('Does not render copy icon when copyElement is not provided', () => {
    const wrapper = getMountInnerBlankLink({ value })

    const icons = wrapper.find(getSelectorTestId('icon-link'))

    expect(icons.exists).toBeTruthy()
    expect(icons.classes()).toContain(IconsList.ExternalLinkIcon)
  })

  it('Opens a new tab when link icon is clicked', async () => {
    const link = 'https://example.com'
    const router = useRouter()

    router.resolve = vi.fn().mockReturnValue({ href: link })

    const wrapper = getMountInnerBlankLink({ value })

    await wrapper.findComponent({ name: 'VIcon' }).trigger('click')

    expect(window.open).toHaveBeenCalledWith(link, '_blank')
  })
})
