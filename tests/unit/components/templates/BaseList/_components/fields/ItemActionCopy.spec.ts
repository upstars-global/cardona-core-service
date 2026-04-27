import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemActionCopy from '../../../../../../../src/components/templates/BaseList/_components/fields/ItemActionCopy.vue'
import { clickTrigger, setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../../../../src/plugins/i18n'

const pushMock = vi.fn()
const resolveMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: pushMock,
    resolve: resolveMock,
  })),
}))

const selectedProject = {
  id: 'proj-1',
  alias: 'project-1',
  name: 'Project One',
}

const anotherProject = {
  id: 'proj-2',
  alias: 'project-2',
  name: 'Project Two',
}

const mockConfig = {
  verifiedProjects: [selectedProject, anotherProject],
}

vi.mock('../../../../../../../src/stores/user', () => ({
  useUserStore: () => ({
    getSelectedProject: selectedProject,
  }),
}))

vi.mock('../../../../../../../src/stores/appConfigCore', () => ({
  useAppConfigCoreStore: () => ({
    get verifiedProjects() {
      return mockConfig.verifiedProjects
    },
  }),
}))

vi.spyOn(window, 'open').mockImplementation(() => null)

const getMountItemActionCopy = setMountComponent(ItemActionCopy)

/// Stub VMenu to render both slots directly — avoids teleport/hover complexity
/// when testing the VList content and click handlers inside VMenu
const getMountWithOpenMenu = (propsArg) => mount(ItemActionCopy, {
  props: propsArg,
  global: {
    stubs: {
      VMenu: {
        template: '<div><slot name="activator" :props="{}" :is-active="true" /><slot /></div>',
      },
    },
  },
})

const defaultProps = {
  item: { id: '123' },
  createPageName: 'EntityCreate',
}

let props

describe('ItemActionCopy.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
    pushMock.mockClear()
    resolveMock.mockReset()
    vi.mocked(window.open).mockClear()
    mockConfig.verifiedProjects = [selectedProject, anotherProject]
  })

  describe('Simple mode (copyForAllProjects = false)', () => {
    it('Renders simple copy item', () => {
      const wrapper = getMountItemActionCopy(props)

      testOn.existElement({ wrapper, testId: 'copy' })
    })

    it('Does not render VMenu', () => {
      const wrapper = getMountItemActionCopy(props)

      expect(wrapper.findComponent({ name: 'VMenu' }).exists()).toBe(false)
    })

    it('Renders correct text on copy item', () => {
      const wrapper = getMountItemActionCopy(props)

      testOn.existTextValue({ wrapper, testId: 'copy' }, i18n.t('action.makeCopy'))
    })

    it('Calls router.push with correct params on click', async () => {
      const wrapper = getMountItemActionCopy(props)

      await clickTrigger({ wrapper, testId: 'copy' })

      expect(pushMock).toHaveBeenCalledWith({
        name: props.createPageName,
        params: { id: props.item.id },
      })
    })
  })

  describe('Simple mode (copyForAllProjects = true, single project)', () => {
    beforeEach(() => {
      mockConfig.verifiedProjects = [selectedProject]
      props = { ...props, copyForAllProjects: true }
    })

    it('Renders simple copy item when only one project exists', () => {
      const wrapper = getMountItemActionCopy(props)

      testOn.existElement({ wrapper, testId: 'copy' })
    })

    it('Does not render VMenu when only one project exists', () => {
      const wrapper = getMountItemActionCopy(props)

      expect(wrapper.findComponent({ name: 'VMenu' }).exists()).toBe(false)
    })
  })

  describe('Multi-project mode (copyForAllProjects = true, multiple projects)', () => {
    beforeEach(() => {
      props = { ...props, copyForAllProjects: true }
    })

    it('Renders VMenu', () => {
      const wrapper = getMountItemActionCopy(props)

      expect(wrapper.findComponent({ name: 'VMenu' }).exists()).toBe(true)
    })

    it('Does not render simple copy item', () => {
      const wrapper = getMountItemActionCopy(props)

      testOn.notExistElement({ wrapper, testId: 'copy' })
    })

    it('Renders all projects in the list', () => {
      const wrapper = getMountWithOpenMenu(props)

      const listItems = wrapper.findAll('.item-list--hover')

      expect(listItems).toHaveLength(mockConfig.verifiedProjects.length)
    })

    it('Renders project titles in the list', () => {
      const wrapper = getMountWithOpenMenu(props)

      const listItems = wrapper.findAll('.item-list--hover')

      listItems.forEach((item, index) => {
        testOn.existTextValue({ wrapper: item }, mockConfig.verifiedProjects[index].name)
      })
    })

    it('Shows "(current)" label only for the selected project', () => {
      const wrapper = getMountWithOpenMenu(props)

      const listItems = wrapper.findAll('.item-list--hover')
      const currentLabel = i18n.t('common.current')

      testOn.existTextValue({ wrapper: listItems[0] }, currentLabel)
      testOn.notExistTextValue({ wrapper: listItems[1] }, currentLabel)
    })

    it('Calls window.open with forProject/fromProject query for non-current project', async () => {
      const href = '/create/copy/123/project-2'
      resolveMock.mockReturnValue({ href })

      const wrapper = getMountWithOpenMenu(props)

      await wrapper.findAll('.item-list--hover')[1].trigger('click')

      expect(resolveMock).toHaveBeenCalledWith({
        name: props.createPageName,
        params: { type: 'copy', id: props.item.id, project: anotherProject.alias },
        query: { forProject: anotherProject.alias, fromProject: selectedProject.alias },
      })

      expect(window.open).toHaveBeenCalledWith(href, '_blank')
    })

    it('Calls window.open with empty query for current (selected) project', async () => {
      const href = '/create/copy/123/project-1'
      resolveMock.mockReturnValue({ href })

      const wrapper = getMountWithOpenMenu(props)

      await wrapper.findAll('.item-list--hover')[0].trigger('click')

      expect(resolveMock).toHaveBeenCalledWith({
        name: props.createPageName,
        params: { type: 'copy', id: props.item.id, project: selectedProject.alias },
        query: {},
      })

      expect(window.open).toHaveBeenCalledWith(href, '_blank')
    })
  })
})
