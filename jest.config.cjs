module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^react-native-web$': 'react-native-web',
  },
  testMatch: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.jest.cjs' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-native-web)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/index.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};
