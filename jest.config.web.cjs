module.exports = {
  displayName: 'web',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^react-native-web$': 'react-native-web',
    '\\.(css)$': '<rootDir>/test/styleMock.cjs',
  },
  testMatch: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  testPathIgnorePatterns: ['\\.native\\.test\\.[tj]sx?$', '/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.jest.cjs' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-native-web)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};
