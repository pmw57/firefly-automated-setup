

// Manually defining `ImportMetaEnv` because the standard `vite/client` types
// were not always being picked up by the TypeScript compiler. This ensures
// Vite's environment variables (e.g., import.meta.env.DEV) are always typed.
interface ImportMetaEnv {
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}