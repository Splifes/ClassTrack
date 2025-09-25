/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_APP_ENV: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_FEATURE_NOTIFICATIONS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
