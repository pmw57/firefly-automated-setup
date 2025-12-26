// FIX: Manually define types for import.meta.env as a workaround for
// the "Cannot find type definition file for 'vite/client'" error. This provides
// type safety for the environment variables used in the application.
interface ImportMetaEnv {
  BASE_URL: string;
  DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}