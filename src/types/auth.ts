export interface AuthUser { id: string; email: string; full_name?: string; role: 'admin' | 'seller' | 'viewer'; user_metadata?: { role?: string; full_name?: string }; }
export interface Session { access_token: string; refresh_token: string; expires_at: number; }
export interface LoginCredentials { email: string; password: string; }
export interface RegisterData { email: string; password: string; full_name?: string; }
