const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ─── Web: stub unresolvable react-native internals ───────────────────────────
// Packages like react-native-gesture-handler import react-native sub-paths
// (e.g. react-native/Libraries/Utilities/codegenNativeComponent) that have no
// web equivalents. Metro can't find them and returns a 500 JSON error instead
// of a JS bundle. We intercept those failed resolutions and return an empty
// stub so the bundle compiles. At runtime, these are native-only code paths
// that are never executed on web anyway.
const EMPTY_STUB = path.resolve(__dirname, 'web-stubs/empty.js');

// react-native-web provides Platform, redirect react-native internal references
// to it so Platform.OS / Platform.select() work correctly on web.
const RNW_PLATFORM = require.resolve(
  'react-native-web/dist/exports/Platform/index.js'
);

const originalResolveRequest = config.resolver?.resolveRequest;

config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (platform === 'web') {
      const fromRN = context.originModulePath.includes(
        '/node_modules/react-native/Libraries/'
      );

      // Redirect all Platform imports that originate inside react-native
      // (both relative ../../Utilities/Platform and absolute sub-paths).
      if (
        fromRN &&
        (moduleName.endsWith('/Platform') ||
          moduleName === '../../Utilities/Platform' ||
          moduleName === '../Utilities/Platform')
      ) {
        return { filePath: RNW_PLATFORM, type: 'sourceFile' };
      }

      // For any other import originating inside react-native/Libraries/,
      // try normal resolution first; if it fails (no .web.js variant exists),
      // return an empty stub rather than crashing the entire bundle.
      if (fromRN) {
        try {
          return context.resolveRequest(context, moduleName, platform);
        } catch (_) {
          return { filePath: EMPTY_STUB, type: 'sourceFile' };
        }
      }

      // Stub out react-native sub-path imports from third-party packages
      // (e.g. gesture-handler's specs) that import native-only internal APIs.
      const isAbsoluteRNSubPath =
        !moduleName.startsWith('.') &&
        moduleName.startsWith('react-native/Libraries/');
      if (isAbsoluteRNSubPath) {
        return { filePath: EMPTY_STUB, type: 'sourceFile' };
      }
    }

    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
