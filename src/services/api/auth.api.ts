import { apiClient } from '@/lib/axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/api.types';

// Demo credentials — hardcoded, remove when real backend is ready
const DEMO_EMAIL = 'ikhsan@mail.con';
const DEMO_PASSWORD = 'chelsea80';

const DEMO_RESPONSE: AuthResponse = {
  accessToken: 'demo-access-token',
  refreshToken: 'demo-refresh-token',
  user: {
    id: 'demo-user-1',
    name: 'Ikhsan',
    email: DEMO_EMAIL,
    plan: 'pro',
    createdAt: new Date().toISOString(),
  },
};

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (data.email.trim() === DEMO_EMAIL && data.password === DEMO_PASSWORD) {
      return DEMO_RESPONSE;
    }
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  refresh: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout').catch(() => {});
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
