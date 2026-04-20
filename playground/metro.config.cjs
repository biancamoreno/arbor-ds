const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.platforms = ['ios', 'android', 'web'];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.unstable_enableSymlinks = true;

config.resolver.sourceExts = [
  'web.ts',
  'web.tsx',
  'web.js',
  'web.jsx',
  ...config.resolver.sourceExts,
];

module.exports = config;
