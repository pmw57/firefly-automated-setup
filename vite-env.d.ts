
// FIX: Manually defining `ImportMetaEnv` because the vite/client types were not being found.
// This provides TypeScript with the necessary definitions for Vite's environment variables like `import.meta.env.DEV`.
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
