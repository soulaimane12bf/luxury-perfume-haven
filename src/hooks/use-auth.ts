import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

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

	useEffect(() => {
		const t = localStorage.getItem('token');
		const u = localStorage.getItem('admin');
		if (t) setToken(t);
		if (u) setAdmin(JSON.parse(u));
		setLoading(false);
	}, []);

	const login = async (username: string, password: string) => {
		const data = await authApi.login(username, password);
		localStorage.setItem('token', data.token);
		localStorage.setItem('admin', JSON.stringify(data.admin));
		setToken(data.token);
		setAdmin(data.admin);
		return data.admin;
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('admin');
		setToken(null);
		setAdmin(null);
	};

	return { token, admin, loading, login, logout, isAuthenticated: !!token };
}

