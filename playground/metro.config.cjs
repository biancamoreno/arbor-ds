const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.platforms = ['ios', 'android', 'web'];

config.resolver.sourceExts = [
  'web.ts',
  'web.tsx',
  'web.js',
  'web.jsx',
  ...config.resolver.sourceExts,
];

module.exports = config;
