import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Footer from '@/components/Footer'
import cosmedLogo from '@/assets/images/cosmed-logo.png'

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
				<>
					{/* Simple login navbar (not the full site Header) */}
					<div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
						<div className="container mx-auto px-4 py-3 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<img src={cosmedLogo} alt="logo" className="h-8 w-auto object-contain" />
								<span className="text-sm text-foreground/70 hidden sm:inline">متجر العطور</span>
							</div>
							<div>
								<Link to="/" className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50">عودة للموقع</Link>
							</div>
						</div>
					</div>

					<div className="min-h-screen bg-background pt-20 flex items-center justify-center p-4">
						<div className="w-full max-w-sm p-6 bg-white">
							<div className="mb-4 flex items-center justify-between">
								<h1 className="text-lg font-medium">Admin Login</h1>
							</div>
							<form onSubmit={onSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="username">Username</Label>
									<Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="off" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="off" />
								</div>
								{error && <p className="text-sm text-red-600">{error}</p>}
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? 'Signing in…' : 'Sign in'}
								</Button>
							</form>
						</div>
					</div>

					<Footer />
				</>
		)
}

export default Login
