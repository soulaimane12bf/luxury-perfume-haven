import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Login: React.FC = () => {
	const { login } = useAuth()
	const navigate = useNavigate()
		const location = useLocation() as { state?: { from?: { pathname?: string } } }
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const from = location.state?.from?.pathname || '/admin'

		const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			await login(username, password)
			navigate(from, { replace: true })
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Login failed'
				setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-sm border rounded-lg p-6 shadow-sm bg-white">
				<h1 className="text-xl font-semibold mb-4">Admin Login</h1>
				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? 'Signing in…' : 'Sign in'}
					</Button>
					<p className="text-xs text-muted-foreground">Default: admin / admin123</p>
				</form>
			</div>
		</div>
	)
}

export default Login
