module.exports = {
  displayName: 'native',
  preset: 'jest-expo',
  testMatch: ['**/*.native.test.{ts,tsx}'],
  moduleFileExtensions: ['native.ts', 'native.tsx', 'ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.native.cjs'],
};
