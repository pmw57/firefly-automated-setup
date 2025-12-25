// FIX: The triple-slash directive to "vite/client" was not resolving correctly.
// Manually defining the ImportMeta interface and its `env` property with the specific
// variables used in the project (DEV, BASE_URL) resolves the TypeScript errors in App.tsx.
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
