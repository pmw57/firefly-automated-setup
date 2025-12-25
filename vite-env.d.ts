// FIX: Manually define types for import.meta.env as a workaround for
// the "Cannot find type definition file for 'vite/client'" error. This provides
// type safety for the environment variables used in the application.
interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
