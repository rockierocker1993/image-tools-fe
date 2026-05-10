export const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
  // Also set cookie so middleware (server-side) can read it
  document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax`;
};

export const clearTokens = (): void => {
  localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_KEYS.USER);
  document.cookie = 'accessToken=; path=/; max-age=0';
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const GUEST_TOKEN_KEY = 'guestToken';

export const getOrCreateGuestToken = (): string => {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(GUEST_TOKEN_KEY);
  if (existing) return existing;
  const token = `guest_${crypto.randomUUID()}`;
  localStorage.setItem(GUEST_TOKEN_KEY, token);
  return token;
};

export const clearGuestToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_TOKEN_KEY);
};
