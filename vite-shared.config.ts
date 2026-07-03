import { execSync } from "node:child_process";
import pkg from "./package.json";

const buildVersion = process.env.BUILD_VERSION ?? pkg.version;

const buildCommitHash = (() => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
})();

export const alias = {
  "@app": "/src/app",
  "@pages": "/src/pages",
  "@widgets": "/src/widgets",
  "@features": "/src/features",
  "@entities": "/src/entities",
  "@shared": "/src/shared",
};

export const define = {
  __APP_NAME__: JSON.stringify(pkg.name),
  __APP_VERSION__: JSON.stringify(buildVersion),
  __BUILD_COMMIT_HASH__: JSON.stringify(buildCommitHash),
  __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
};
