export const POSTGREST_CONFIG = {
  url: import.meta.env.POSTGREST_URL || import.meta.env.VITE_POSTGREST_URL || 'http://localhost:3000',
  schema: import.meta.env.POSTGREST_SCHEMA || import.meta.env.VITE_POSTGREST_SCHEMA || 'public',
  apiKey: import.meta.env.POSTGREST_API_KEY || import.meta.env.VITE_POSTGREST_API_KEY || 'dummy_key_for_direct_connection'
};

export const APP_CONFIG = {
  name: import.meta.env.NEXT_PUBLIC_APP_NAME || import.meta.env.VITE_APP_NAME || 'Sistema de Lotería',
  url: import.meta.env.NEXT_PUBLIC_API_URL || import.meta.env.VITE_APP_URL || 'http://localhost:5173'
};