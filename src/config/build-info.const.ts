/** Build-time metadata (name, version, commit, timestamp) injected by Vite. */
export const BUILD_INFO = {
  appName: __APP_NAME__,
  version: __APP_VERSION__,
  commitHash: __BUILD_COMMIT_HASH__,
  builtAt: __BUILD_TIME__,
} as const;
