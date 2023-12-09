module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', 'utils/config/load/index.ts', 'utils/translate/check/index.ts', 'utils/param/index.ts', 'utils/console/clear/index.ts', 'utils/console/index.ts'],
  transform: {
    '^.+\\.(js|ts)$': ['@swc/jest']
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
  moduleNameMapper: {
    'lodash-es': 'lodash',
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
