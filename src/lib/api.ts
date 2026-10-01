import type { AuthUser, Session, LoginCredentials, RegisterData } from '../types/auth';
import type { Ticket, Lottery, SellTicketRequest } from '../types/lottery';

const API_BASE = '/api';

async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(url, { 
      headers: { 'Content-Type': 'application/json', ...options.headers }, 
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

export const authApi = {
  async login(credentials: LoginCredentials) { return fetchApi<{ user: AuthUser; session: Session }>(`${API_BASE}/auth/login`, { method: 'POST', body: JSON.stringify(credentials) }); },
  async register(data: RegisterData) { return fetchApi<{ user: AuthUser; session: Session }>(`${API_BASE}/auth/register`, { method: 'POST', body: JSON.stringify(data) }); },
  async logout() { return fetchApi<void>(`${API_BASE}/auth/logout`, { method: 'POST' }); },
  async refresh() { return fetchApi<{ user: AuthUser; session: Session }>(`${API_BASE}/auth/refresh`, { method: 'POST' }); },
  async getCurrentUser() { return fetchApi<AuthUser>(`${API_BASE}/auth/me`); },
};

export const ticketApi = {
  async getAll() { return fetchApi<Ticket[]>(`${API_BASE}/tickets`); },
  async getById(id: string) { return fetchApi<Ticket>(`${API_BASE}/tickets/${id}`); },
  async sell(data: SellTicketRequest) { return fetchApi<Ticket>(`${API_BASE}/tickets`, { method: 'POST', body: JSON.stringify(data) }); },
  async verify(ticketNumber: string) { return fetchApi<Ticket>(`${API_BASE}/tickets/verify/${ticketNumber}`); },
  async cancel(id: string) { return fetchApi<Ticket>(`${API_BASE}/tickets/${id}`, { method: 'PATCH' }); },
};

export const lotteryApi = {
  async getAll() { return fetchApi<Lottery[]>(`${API_BASE}/lotteries`); },
  async getById(id: string) { return fetchApi<Lottery>(`${API_BASE}/lotteries/${id}`); },
};

export const reportsApi = { getSalesSummary: () => fetchApi<unknown>(`${API_BASE}/reports/sales-summary`) };
export const userApi = { getAllSellers: () => fetchApi<AuthUser[]>(`${API_BASE}/users/sellers`) };