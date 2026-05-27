export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TOOLS: '/dashboard/tools',
  REMOVE_BACKGROUND: '/dashboard/remove-background',
  UPSCALER: '/dashboard/upscaler',
  VECTOR: '/dashboard/vector',
  HISTORY: '/dashboard/history',
  BILLING: '/dashboard/billing',
  SETTINGS: '/dashboard/settings',

  PUBLIC_REMOVE_BACKGROUND: '/remove-background',
  PUBLIC_UPSCALER: '/upscaler',
  PUBLIC_VECTOR: '/vector',
} as const;

export const DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/remove-background',
  '/dashboard/upscaler',
  '/dashboard/history',
  '/dashboard/billing',
  '/dashboard/settings',
];
