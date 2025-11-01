import { useEffect, useState, useCallback } from 'react';
import { authApi } from '@/lib/api';
import showAdminAlert from '@/lib/swal-admin';

type AdminUser = {
	id: number;
	username: string;
	email: string;
	role: 'admin' | 'super-admin';
};

type LoginResponse = {
	token: string;
	admin: AdminUser;
};

const getTokenExpiryMs = (token: string | null) => {
	if (!token) return null;
	try {
		const parts = token.split('.');
		if (parts.length < 2) return null;
		const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
		return typeof payload?.exp === 'number' ? payload.exp * 1000 : null;
	} catch (error) {
		console.error('[AUTH] Failed to parse token payload', error);
		return null;
	}
};

export function useAuth() {
	const [token, setToken] = useState<string | null>(null);
	const [admin, setAdmin] = useState<AdminUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [verifyTimerId, setVerifyTimerId] = useState<number | null>(null);

	const logout = useCallback(() => {
		localStorage.removeItem('token');
		localStorage.removeItem('admin');
		setToken(null);
		setAdmin(null);
		setVerifyTimerId((previous) => {
			if (previous) {
				window.clearTimeout(previous);
			}
			return null;
		});
	}, []);

	const scheduleLogoutAt = useCallback((expMs: number) => {
		const delay = Math.max(0, expMs - Date.now());
		setVerifyTimerId((previous) => {
			if (previous) {
				window.clearTimeout(previous);
			}
			const id = window.setTimeout(() => {
				console.log('[AUTH] Token expired based on exp claim, logging out');
				showAdminAlert({ title: 'انتهت الجلسة', text: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.', icon: 'error', timer: 3000 });
				logout();
				try {
					window.location.href = '/login';
				} catch (error) {
					console.error('[AUTH] Failed to redirect after logout', error);
				}
			}, delay);
			return id;
		});
	}, [logout]);

	const login = useCallback(async (username: string, password: string) => {
		const data = (await authApi.login(username, password)) as LoginResponse;
		console.log('[AUTH] Login successful:', {
			hasToken: !!data.token,
			tokenLength: data.token?.length,
			admin: data.admin?.username,
		});
		localStorage.setItem('token', data.token);
		localStorage.setItem('admin', JSON.stringify(data.admin));
		setToken(data.token);
		setAdmin(data.admin);
		const expMs = getTokenExpiryMs(data.token);
		if (expMs) scheduleLogoutAt(expMs);
		console.log('[AUTH] Token stored in localStorage');
		return data.admin;
	}, [scheduleLogoutAt]);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedAdmin = localStorage.getItem('admin');
		if (storedToken) setToken(storedToken);
		if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
		setLoading(false);

		// If there's a token on mount, proactively verify it with the backend so
		// that expired/invalidated sessions are logged out immediately.
		// Do this after initial state is set.
		(async () => {
			if (!storedToken) return;
			try {
				await authApi.verify();
				// Schedule automatic logout at token expiry if exp is present
				const expMs = getTokenExpiryMs(storedToken);
				if (expMs) scheduleLogoutAt(expMs);
			} catch (err) {
				// Token is invalid on the server; show an alert and clear local session
				console.log('[AUTH] Stored token invalid, logging out');
				showAdminAlert({ title: 'انتهت الجلسة', text: 'تم إنهاء الجلسة. يرجى تسجيل الدخول مرة أخرى.', icon: 'error', timer: 3500 });
				logout();
				try {
					window.location.href = '/login';
				} catch (error) {
					console.error('[AUTH] Failed to redirect after invalid token', error);
				}
			}
		})();
	}, [logout, scheduleLogoutAt]);

	return { token, admin, loading, login, logout, isAuthenticated: !!token };
}

