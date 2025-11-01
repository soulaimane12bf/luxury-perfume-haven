import { useCallback, useEffect } from 'react';
import showAdminAlert from '@/lib/swal-admin';
import { useAuth } from '@/hooks/use-auth';
import type { AdminTab } from '../types';

type UseAdminAuthGuardParams = {
  navigate: (path: string, options?: { replace?: boolean }) => void;
  closeSidebar: () => void;
  setActiveTab: (tab: AdminTab) => void;
};

export const useAdminAuthGuard = ({ navigate, closeSidebar, setActiveTab }: UseAdminAuthGuardParams) => {
  const { isAuthenticated, token, loading: authLoading, logout } = useAuth();

  const handleLogout = useCallback(() => {
    try {
      if (typeof logout === 'function') logout();
    } catch (e) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
      } catch (err) {
        // ignore storage errors
      }
    }
    setActiveTab('orders');
    closeSidebar();
    showAdminAlert({ title: 'تم تسجيل الخروج', text: 'إلى اللقاء!', icon: 'info', timer: 3000 });
    navigate('/login');
  }, [closeSidebar, logout, navigate, setActiveTab]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !token) {
      showAdminAlert({ title: 'غير مصرح', text: 'يرجى تسجيل الدخول أولاً', icon: 'error', timer: 5000 });
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate, token]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !token) {
      handleLogout();
      return;
    }

    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        showAdminAlert({ title: 'انتهت الجلسة', text: 'يرجى تسجيل الدخول مرة أخرى', icon: 'error', timer: 4000 });
        handleLogout();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [authLoading, handleLogout, isAuthenticated, token]);

  return {
    isAuthenticated,
    token,
    authLoading,
    handleLogout,
  };
};

