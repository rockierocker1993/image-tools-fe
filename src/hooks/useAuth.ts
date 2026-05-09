'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/services/api/auth.api';
import { ROUTES } from '@/constants/routes';
import type { LoginRequest, RegisterRequest } from '@/types/api.types';

export const useAuth = () => {
  const router = useRouter();
  const { user, isLoggedIn, setAuth, logout: storeLogout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.refresh();
      router.push(ROUTES.DASHBOARD);
    },
    onError: (err) => {
      console.error('[login error]', err);
      toast.error('Invalid email or password.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Account created successfully!');
      router.push(ROUTES.DASHBOARD);
    },
    onError: () => {
      toast.error('Registration failed. Please try again.');
    },
  });

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout API errors
    } finally {
      storeLogout();
      router.push(ROUTES.LOGIN);
    }
  }, [storeLogout, router]);

  return {
    user,
    isLoggedIn,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
};
