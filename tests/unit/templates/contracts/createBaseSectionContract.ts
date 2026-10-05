import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import type { UseEntityType } from '../../../../src/@model/templates/baseSection'
import { PageType } from '../../../../src/@model/templates/baseSection'
import { BaseSectionConfig } from '../../../../src/@model/templates/baseList'
import DefaultBaseSection from '../../../../src/components/templates/BaseSection/types/default.vue'
import { setMountComponent, withSetup } from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'
import { mockModal } from '../../mocks/modal-provide-config'
import { basePermissionsMock, mockBaseStoreCore, router } from '../../mocks/base-section/utils'

type ActionMock = ReturnType<typeof vi.fn>

const FieldGeneratorStub = { template: '<div class="field-generator-stub" />' }

export interface FormVariant {

  /**
   * Raw data fed into `new EntityFormClass(input)` — mirrors new EntityFormClass(receivedEntity)
   * in BaseSection/types/default.vue. `new` on a factory function that returns an object (e.g.
   * gifts' GiftType dispatcher) resolves to that returned object, same as production code.
   */
  input: Record<string, unknown>
  description?: string
}

export type SelectFieldCheck =
  | { key: string; source: 'static' }
  | { key: string; source: 'fetchOptionsAction' }

export interface BaseSectionContractConfig {

  /** The real production composable — entityName/EntityFormClass/useStore are derived from it. */
  useEntity: () => UseEntityType<unknown>
  formVariants: FormVariant[]

  /** A representative instance to drive the CRUD/select-field checks (first formVariants entry works for most sections). */
  sampleEntityData?: Record<string, unknown>
  entityId?: string
  actions?: {
    create?: { expect: 'createEntity' }
    update?: { expect: 'updateEntity' }
    read?: { expect: 'readEntity'; triggersOnReceiveEntity?: boolean }
  }

  /**
   * Same constraint as BaseList's customStoreMock — vi.mock is static/hoisted per spec file, so the
   * calling spec must vi.mock the real custom store module and pass the resulting mock here.
   */
  customStoreMock?: Record<string, ActionMock>
  selectFields?: SelectFieldCheck[]
  sectionConfig?: ConstructorParameters<typeof BaseSectionConfig>[0]
}

export function createBaseSectionContract(config: BaseSectionContractConfig) {
  const mountComponent = setMountComponent(DefaultBaseSection)
  const { entityName, EntityFormClass, useStore } = withSetup(config.useEntity)

  if (useStore && !config.customStoreMock) {
    throw new Error(
      '[createBaseSectionContract] useEntity() wires a custom store (useStore) — pass `customStoreMock` '
      + 'matching the real store shape, and vi.mock the real store module in the spec file before '
      + 'calling this contract.',
    )
  }

  const sampleData = config.sampleEntityData ?? config.formVariants[0]?.input ?? {}
  const entityId = config.entityId ?? sampleData.id ?? '1'

  const global = {
    plugins: [router],
    provide: { modal: mockModal },
    components: { FieldGenerator: FieldGeneratorStub },
  }

  const slots = {
    default: `<template #default="{ form }">
                <FieldGenerator :form="form" />
              </template>`,
  }

  const mount = (props: Record<string, unknown>) =>
    mountComponent({
      config: new BaseSectionConfig(config.sectionConfig ?? {}),
      useEntity: config.useEntity,
      ...props,
    }, global, slots)

  describe(`[contract] BaseSection: ${entityName}`, () => {
    beforeEach(() => {
      mockBaseStoreCore.createEntity.mockReset()
      mockBaseStoreCore.updateEntity.mockReset()
      mockBaseStoreCore.readEntity.mockReset().mockResolvedValue(sampleData)
      mockBaseStoreCore.deleteEntity.mockReset()
      basePermissionsMock.reset()
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    describe('model structural integrity', () => {
      it.each(config.formVariants.map((v, i) => [v.description ?? `variant ${i}`, v] as const))(
        'initializes EntityFormClass without throwing for "%s"',
        (_label, variant) => {
          expect(() => new EntityFormClass(variant.input)).not.toThrow()

          const instance = new EntityFormClass(variant.input)

          expect(instance).toBeTruthy()
        },
      )
    })

    if (config.selectFields?.length) {
      describe('select fields', () => {
        const instance = new EntityFormClass(sampleData)

        config.selectFields.forEach(({ key, source }) => {
          it(`field "${key}" sources options via ${source}`, () => {
            const field = instance[key]

            expect(field).toBeTruthy()

            if (source === 'static')
              expect(Array.isArray(field.options) && field.options.length).toBeTruthy()
            else
              expect(typeof field.fetchOptionsAction).toBe('function')
          })
        })
      })
    }

    describe('CRUD actions', () => {
      if (config.actions?.create) {
        it('calls createEntity on submit from the create page', async () => {
          const wrapper = mount({ pageType: PageType.Create, withReadAction: false })

          await flushPromises()

          await wrapper.vm.onSubmit(false)
          await flushPromises()

          const action = config.customStoreMock?.createEntity ?? mockBaseStoreCore.createEntity

          expect(action).toHaveBeenCalledWith(expect.objectContaining({ type: entityName }))
        })
      }

      if (config.actions?.update) {
        it('calls updateEntity on submit from the update page', async () => {
          const wrapper = mount({ pageType: PageType.Update, entityId, withReadAction: false })

          await flushPromises()

          await wrapper.vm.onSubmit(false)
          await flushPromises()

          const action = config.customStoreMock?.updateEntity ?? mockBaseStoreCore.updateEntity

          expect(action).toHaveBeenCalledWith(expect.objectContaining({ type: entityName }))
        })
      }

      if (config.actions?.read) {
        const readConfig = config.actions.read

        it('calls readEntity when mounted with an entityId', async () => {
          mount({ pageType: PageType.Update, entityId, withReadAction: true })

          await flushPromises()

          const action = config.customStoreMock?.readEntity ?? mockBaseStoreCore.readEntity

          expect(action).toHaveBeenCalledWith(
            expect.objectContaining({ type: entityName, id: entityId }),
          )
        })

        if (readConfig.triggersOnReceiveEntity) {
          it('passes the read response through onReceiveEntity', async () => {
            const { onReceiveEntity } = withSetup(config.useEntity)

            mount({ pageType: PageType.Update, entityId, withReadAction: true })

            await flushPromises()

            expect(onReceiveEntity).toHaveBeenCalled()
          })
        }
      }
    })

    if (config.actions?.update) {
      describe('permission-gated actions', () => {
        it('renders the save button when canUpdate is true', async () => {
          basePermissionsMock.setPermissions({ canUpdate: true, canUpdateSeo: false })

          const wrapper = mount({ pageType: PageType.Update, entityId, withReadAction: false })

          await flushPromises()

          testOn.existElement({ wrapper, testId: 'saveAndExit-button' })
        })

        it('hides the save button when canUpdate and canUpdateSeo are both false', async () => {
          basePermissionsMock.setPermissions({ canUpdate: false, canUpdateSeo: false })

          const wrapper = mount({ pageType: PageType.Update, entityId, withReadAction: false })

          await flushPromises()

          testOn.notExistElement({ wrapper, testId: 'saveAndExit-button' })
        })
      })
    }
  })
}
