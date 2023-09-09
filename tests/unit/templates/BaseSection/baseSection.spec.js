import { createLocalVue, enableAutoDestroy, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import { useDemoSection } from '../../../../src/pages/demo/useDemo';
import BaseSection from '../../../../src/components/templates/BaseSection/index.vue';
import { PageType } from '../../../../src/components/templates/BaseSection/model';
import flushPromises from 'flush-promises';
import { getPermissionKeys } from '../../../../src/helpers';
import { permissionPrefix } from '@productConfig';
import ApiService from '../../../../src/services/api';
enableAutoDestroy(afterEach);
const demoListComponentName = 'DemoList';
const demoUpdateComponentName = 'DemoUpdate';
let localVue;
let router;
// @ts-ignore
ApiService.request = jest.fn(() => {
    return {
        data: {
            id: 'test-id',
        },
    };
});
const createButtonSelector = '[data-testid=create-button]';
const stayButtonSelector = '[data-testid=stay-button]';
const saveButtonSelector = '[data-testid=save-button]';
const cancelButtonSelector = '[data-testid=cancel-button]';
// @ts-ignore
ApiService.request = jest.fn(() => {
    return {
        data: {
            id: 'test-id',
        },
    };
});
describe('BaseSection', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        localVue.use(BootstrapVue);
        router = new VueRouter({
            mode: 'abstract',
            base: process.env.BASE_URL,
            routes: [
                {
                    path: '/demo',
                    name: demoListComponentName,
                    component: {},
                },
                {
                    path: '/demo/update/:id',
                    name: demoUpdateComponentName,
                    component: {},
                },
            ],
        });
    });
    afterEach(() => {
        localVue = null;
        router = null;
    });
    describe('testing pageType props', () => {
        it('without set pageType', () => {
            const wrapper = mount(BaseSection, {
                propsData: {
                    useEntity: useDemoSection,
                },
                router,
                localVue,
            });
            expect(wrapper.find(createButtonSelector).exists()).toBe(false);
            expect(wrapper.find(stayButtonSelector).exists()).toBe(false);
            expect(wrapper.find(saveButtonSelector).exists()).toBe(false);
            expect(wrapper.find(cancelButtonSelector).exists()).toBe(false);
        });
        it('set pageType created', () => {
            const wrapper = mount(BaseSection, {
                propsData: {
                    useEntity: useDemoSection,
                    pageType: PageType.Create,
                },
                router,
                localVue,
            });
            expect(wrapper.find(createButtonSelector).exists()).toBe(true);
            expect(wrapper.find(stayButtonSelector).exists()).toBe(true);
            expect(wrapper.find(saveButtonSelector).exists()).toBe(false);
            expect(wrapper.find(cancelButtonSelector).exists()).toBe(true);
        });
        it('set pageType update', () => {
            const wrapper = mount(BaseSection, {
                propsData: {
                    useEntity: useDemoSection,
                    pageType: PageType.Update,
                },
                router,
                localVue,
            });
            expect(wrapper.find(createButtonSelector).exists()).toBe(false);
            expect(wrapper.find(stayButtonSelector).exists()).toBe(false);
            expect(wrapper.find(saveButtonSelector).exists()).toBe(true);
            expect(wrapper.find(cancelButtonSelector).exists()).toBe(true);
        });
        it('correct routing on cansel click', async () => {
            const wrapper = mount(BaseSection, {
                propsData: {
                    useEntity: useDemoSection,
                    pageType: PageType.Create,
                },
                router,
                localVue,
            });
            await wrapper.find(cancelButtonSelector).trigger('click');
            expect(wrapper.vm.$route.name).toMatch(demoListComponentName);
        });
        it('correct routing on create click', async () => {
            const wrapper = mount(BaseSection, {
                propsData: {
                    useEntity: useDemoSection,
                    pageType: PageType.Create,
                },
                router,
                localVue,
            });
            await wrapper.find(createButtonSelector).trigger('click');
            await flushPromises();
            expect(wrapper.vm.$route.name).toMatch(demoListComponentName);
        });
        it('correct routing on create and stay click', async () => {
            const wrapper = mount(BaseSection, {
                propsData: {
                    useEntity: useDemoSection,
                    pageType: PageType.Create,
                },
                router,
                localVue,
            });
            await wrapper.setData({ form: { id: 'test' } });
            await wrapper.find(stayButtonSelector).trigger('click');
            await flushPromises();
            expect(wrapper.vm.$route.name).toMatch(demoUpdateComponentName);
        });
    });
    describe('testing config settings', () => {
        it('getPermissionKeys without config', () => {
            expect(() => {
                getPermissionKeys({});
            }).toThrow(Error);
        });
        it('getPermissionKeys with default config', () => {
            const permissionKeyExpect = 'demo-demo';
            const permissionKeySeoExpect = 'demo-demo-seo';
            const config = {
                permissionKey: undefined,
                permissionPrefix: permissionPrefix,
                entityNamePermission: useDemoSection().entityName,
            };
            const { permissionKey, permissionKeySeo } = getPermissionKeys(config);
            expect(permissionKey).toMatch(permissionKeyExpect);
            expect(permissionKeySeo).toMatch(permissionKeySeoExpect);
        });
        it('getPermissionKeys with noPermissionPrefix: true', () => {
            const permissionKeyExpect = 'demo';
            const permissionKeySeoExpect = 'demo-seo';
            const config = {
                permissionKey: undefined,
                permissionPrefix: permissionPrefix,
                entityNamePermission: useDemoSection().entityName,
            };
            const { permissionKey, permissionKeySeo } = getPermissionKeys(config);
            expect(permissionKey).toMatch(permissionKeyExpect);
            expect(permissionKeySeo).toMatch(permissionKeySeoExpect);
        });
        it('getPermissionKeys with customPermissionPrefix: prefix', () => {
            const permissionKeyExpect = 'prefix-demo';
            const permissionKeySeoExpect = 'prefix-demo-seo';
            const config = {
                permissionKey: undefined,
                permissionPrefix: 'prefix',
                entityNamePermission: useDemoSection().entityName,
            };
            const { permissionKey, permissionKeySeo } = getPermissionKeys(config);
            expect(permissionKey).toMatch(permissionKeyExpect);
            expect(permissionKeySeo).toMatch(permissionKeySeoExpect);
        });
    });
});
//# sourceMappingURL=baseSection.spec.js.map