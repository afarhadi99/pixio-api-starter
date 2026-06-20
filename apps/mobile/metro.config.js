// Metro config for an Expo app inside a pnpm monorepo.
// Ported from C:\pixio\apps\mobile\metro.config.js: the resolveRequest hook
// rewrites pnpm `.pnpm` symlink paths to bare specifiers so the native app can
// resolve the JS entry (otherwise it crashes on launch with no JS logs).
// Merged with Node-only module stubs so @supabase/supabase-js bundles on RN.
const path = require('path');
const fs = require('fs');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const moduleResolutionPaths = [projectRoot, workspaceRoot];
const emptyModulePath = path.resolve(projectRoot, 'shims/empty.js');

const config = getDefaultConfig(projectRoot);

// Pin Metro's projectRoot to this app so Expo Router resolves routes from app/.
config.projectRoot = projectRoot;

config.watchFolders = Array.from(new Set([...(config.watchFolders ?? []), workspaceRoot]));
config.resolver.nodeModulesPaths = Array.from(
  new Set([
    ...(config.resolver.nodeModulesPaths ?? []),
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ]),
);

// Enable package exports for pnpm monorepo resolution.
config.resolver.unstable_enablePackageExports = true;

// Node-only modules pulled in by @supabase/supabase-js (server paths). On RN we
// stub them; Supabase Realtime uses the global WebSocket instead.
const nodeOnlyModules = new Set(['ws', 'stream', 'crypto', 'http', 'https', 'net', 'tls', 'zlib']);

// --- pnpm .pnpm path rewriting (from Pixio) ---
const extractBareSpecifierFromNodeModulesPath = (moduleName) => {
  const normalized = moduleName.replace(/\\/g, '/');

  const monorepoMobileMatch = normalized.match(/(?:^|\/)apps\/mobile\/node_modules\/(.+)$/);
  if (monorepoMobileMatch?.[1]) {
    return monorepoMobileMatch[1];
  }

  if (!normalized.includes('node_modules/')) {
    return null;
  }

  const parts = normalized.split('/node_modules/');
  const bareSpecifier = parts[parts.length - 1]?.replace(/^\/+/, '');
  return bareSpecifier || null;
};

const resolveBareModuleToSourceFile = (bareSpecifier) => {
  const [packageName, ...subpathParts] = bareSpecifier.split('/');
  if (!packageName) return null;

  const subpath = subpathParts.join('/');
  const extensions = ['', '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json'];

  for (const nodeModulesRoot of [
    path.join(projectRoot, 'node_modules'),
    path.join(workspaceRoot, 'node_modules'),
  ]) {
    for (const extension of extensions) {
      const candidate = path.join(nodeModulesRoot, packageName, `${subpath}${extension}`);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  for (const basePath of moduleResolutionPaths) {
    try {
      return require.resolve(bareSpecifier, { paths: [basePath] });
    } catch {
      // Try the next resolution root.
    }
  }

  return null;
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolver = originalResolveRequest || context.resolveRequest;
  const isStringSpecifier = typeof moduleName === 'string';

  // Stub Node-only modules before anything else.
  if (isStringSpecifier) {
    if (moduleName.startsWith('node:')) {
      return { type: 'sourceFile', filePath: emptyModulePath };
    }
    if (nodeOnlyModules.has(moduleName)) {
      return { type: 'sourceFile', filePath: emptyModulePath };
    }
  }

  // Keep Metro internals and absolute filesystem paths untouched (important on iOS).
  if (
    isStringSpecifier &&
    (path.isAbsolute(moduleName) || moduleName.startsWith('metro-runtime/'))
  ) {
    return resolver(context, moduleName, platform);
  }

  if (isStringSpecifier) {
    const bareSpecifier = extractBareSpecifierFromNodeModulesPath(moduleName);
    if (bareSpecifier) {
      const resolvedPath = resolveBareModuleToSourceFile(bareSpecifier);
      if (resolvedPath) {
        return { type: 'sourceFile', filePath: resolvedPath };
      }
      return resolver(context, bareSpecifier, platform);
    }
  }

  return resolver(context, moduleName, platform);
};

module.exports = config;
