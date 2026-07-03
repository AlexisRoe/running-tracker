/// <reference types="vite/client" />

declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;
declare const __BUILD_COMMIT_HASH__: string;
declare const __BUILD_TIME__: string;

declare module "*.css" {
  const styles: Record<string, string>;
  export default styles;
}
