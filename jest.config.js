module.exports = {
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    '^.+\\.svg$': 'jest-transform-stub',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^@model/(.*)$': '<rootDir>/src/@model/$1',
    '^@core/(.*)$': '<rootDir>/src/@core/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@axios$': '<rootDir>/src/libs/axios',
    '@themeConfig': '<rootDir>/themeConfig',
    '@configs': '<rootDir>/configs',
  },
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFiles: ['./src/testSetup/globalPlugins.ts'],
}
