// Metro config for an Expo app inside a pnpm monorepo.
const path = require('path');
const fs = require('fs');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const emptyModulePath = path.resolve(projectRoot, 'shims/empty.js');

const config = getDefaultConfig(projectRoot);

config.projectRoot = projectRoot;
config.watchFolders = Array.from(
  new Set([...(config.watchFolders ?? []), workspaceRoot]),
);
config.resolver.nodeModulesPaths = Array.from(
  new Set([
    ...(config.resolver.nodeModulesPaths ?? []),
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ]),
);
config.resolver.unstable_enableSymlinks = true;
config.resolver.disableHierarchicalLookup = false;
config.resolver.unstable_enablePackageExports = true;

const nodeOnlyModules = new Set(['ws', 'stream', 'crypto', 'http', 'https', 'net', 'tls', 'zlib']);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolver = originalResolveRequest ?? context.resolveRequest;

  if (typeof moduleName === 'string') {
    if (moduleName.startsWith('node:')) {
      return { type: 'sourceFile', filePath: emptyModulePath };
    }

    if (nodeOnlyModules.has(moduleName)) {
      return { type: 'sourceFile', filePath: emptyModulePath };
    }
  }

  return resolver(context, moduleName, platform);
};

module.exports = config;
