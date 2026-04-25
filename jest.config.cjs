module.exports = {
  projects: [
    '<rootDir>/jest.config.web.cjs',
    '<rootDir>/jest.config.native.cjs',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
