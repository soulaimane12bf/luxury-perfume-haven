import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import showAdminAlert from '@/lib/swal-admin';

type AdminUser = {
	id: number;
	username: string;
	email: string;
	role: 'admin' | 'super-admin';
};

export function useAuth() {
	const [token, setToken] = useState<string | null>(null);
	const [admin, setAdmin] = useState<AdminUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [verifyTimerId, setVerifyTimerId] = useState<number | null>(null);

	useEffect(() => {
		const t = localStorage.getItem('token');
		const u = localStorage.getItem('admin');
		if (t) setToken(t);
		if (u) setAdmin(JSON.parse(u));
		setLoading(false);

		// If there's a token on mount, proactively verify it with the backend so
		// that expired/invalidated sessions are logged out immediately.
		// Do this after initial state is set.
		(async () => {
			if (!t) return;
			try {
				await authApi.verify();
				// Schedule automatic logout at token expiry if exp is present
				const expMs = getTokenExpiryMs(t);
				if (expMs) scheduleLogoutAt(expMs);
			} catch (err) {
				// Token is invalid on the server; show an alert and clear local session
				console.log('[AUTH] Stored token invalid, logging out');
				try {
					showAdminAlert({ title: 'انتهت الجلسة', text: 'تم إنهاء الجلسة. يرجى تسجيل الدخول مرة أخرى.', icon: 'error', timer: 3500 });
				} catch (e) {}
				logout();
				try { window.location.href = '/login'; } catch (e) {}
			}
		})();
	}, []);

	const login = async (username: string, password: string) => {
		const data = await authApi.login(username, password) as { token: string; admin: AdminUser };
		console.log('[AUTH] Login successful:', {
			hasToken: !!data.token,
			tokenLength: data.token?.length,
			admin: data.admin?.username,
		});
		localStorage.setItem('token', data.token);
		localStorage.setItem('admin', JSON.stringify(data.admin));
		setToken(data.token);
		setAdmin(data.admin);
		// After login, schedule logout at token expiry if possible
		const expMs = getTokenExpiryMs(data.token);
		if (expMs) scheduleLogoutAt(expMs);
		console.log('[AUTH] Token stored in localStorage');
		return data.admin;
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('admin');
		setToken(null);
		setAdmin(null);
		// Clear any scheduled verification/logout timer
		if (verifyTimerId) {
			window.clearTimeout(verifyTimerId);
			setVerifyTimerId(null);
		}
	};

	// Helper: parse JWT and return expiration time in ms (or null)
	const getTokenExpiryMs = (tkn: string | null) => {
		if (!tkn) return null;
		try {
			const parts = tkn.split('.');
			if (parts.length < 2) return null;
			const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
			if (payload && payload.exp) {
				return payload.exp * 1000;
			}
			return null;
		} catch (err) {
			return null;
		}
	};

	// Schedule a logout when the token expires (at expMs). Returns timer id.
	const scheduleLogoutAt = (expMs: number) => {
		const now = Date.now();
		const delay = Math.max(0, expMs - now);
		// Clear previous timer
		if (verifyTimerId) {
			window.clearTimeout(verifyTimerId);
		}
		const id = window.setTimeout(() => {
			console.log('[AUTH] Token expired based on exp claim, logging out');
			try {
				showAdminAlert({ title: 'انتهت الجلسة', text: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.', icon: 'error', timer: 3000 });
			} catch (e) {}
			logout();
			// force a page navigation to login if app is still on admin
			try { window.location.href = '/login'; } catch {};
		}, delay);
		setVerifyTimerId(id);
		return id;
	};

	return { token, admin, loading, login, logout, isAuthenticated: !!token };
}

