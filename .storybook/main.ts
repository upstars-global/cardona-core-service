import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import type { StorybookConfig } from '@storybook/vue3-vite'

const r = (rel: string) => fileURLToPath(new URL(rel, import.meta.url))

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/vue3-vite',

  viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': r('../src'),
          '@themeConfig': r('../themeConfig.ts'),
          '@core': r('../src/@core'),
          '@layouts': r('../src/@layouts'),
          '@images': r('../src/assets/images/'),
          '@styles': r('../src/assets/styles/'),
          '@configured-variables': r('../src/assets/styles/variables/_template.scss'),
          '@productConfig': r('../src/configs/productConfig.ts'),
          '@filterConfig': r('../src/@model/filterConfig.ts'),
          '@permissions': r('../src/configs/permissions.ts'),
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            // Lets Sass resolve  @import "@core/..."  and  @use "@layouts/..."
            // inside .scss files without relying solely on Vite's importer bridge.
            loadPaths: [r('../src')],
          },
        },
      },
    })
  },
}

export default config
