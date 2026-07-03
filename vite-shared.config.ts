import { execSync } from "node:child_process";
import pkg from "./package.json";

const buildVersion =
  process.env.BUILD_VERSION ??
  (() => {
    try {
      return execSync("git describe --tags --always").toString().trim();
    } catch {
      return pkg.version;
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
  __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
};
