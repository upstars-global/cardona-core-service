module.exports = {
  moduleNameMapper: {
    '^@model/(.*)$': '<rootDir>/src/@model/$1',
    '^@core/(.*)$': '<rootDir>/src/@core/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@axios$': '<rootDir>/src/libs/axios',
    '@themeConfig': '<rootDir>/themeConfig',
    '@productConfig': '<rootDir>/src/configs/productConfig',
    '@permissions': '<rootDir>/src/configs/permissions',
    '@filterConfig': '<rootDir>/src/@model/filterConfig',
  },
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['./src/testSetup/globalPlugins.ts'],
}
