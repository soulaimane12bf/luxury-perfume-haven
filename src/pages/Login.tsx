import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
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

	// Clear error when user starts typing
	useEffect(() => {
		if (error) {
			setError(null)
		}
	}, [username, password])

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		
		try {
			await login(username, password)
			navigate(from, { replace: true })
		} catch (err) {
			const message = err instanceof Error ? err.message : 'فشل تسجيل الدخول'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			{/* Simple login navbar */}
			<div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<img 
							src={cosmedLogo} 
							alt="Cosmed Logo" 
							className="h-8 w-auto object-contain" 
						/>
						<span className="text-sm text-foreground/70 hidden sm:inline">
							متجر العطور
						</span>
					</div>
					<Link 
						to="/" 
						className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50 transition-colors"
					>
						عودة للموقع
					</Link>
				</div>
			</div>

			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-lg shadow-lg border p-8">
						<div className="mb-6 text-center">
							<h1 className="text-2xl font-semibold text-gray-900">
								تسجيل دخول المشرف
							</h1>
							<p className="text-sm text-gray-500 mt-2">
								الرجاء إدخال بيانات الدخول
							</p>
						</div>

						<form onSubmit={onSubmit} className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor="username" className="text-sm font-medium">
									اسم المستخدم
								</Label>
								<Input 
									id="username"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="أدخل اسم المستخدم"
									required
									disabled={loading}
									className="h-10"
									autoFocus
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium">
									كلمة المرور
								</Label>
								<Input 
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="أدخل كلمة المرور"
									required
									disabled={loading}
									className="h-10"
								/>
							</div>

							{error && (
								<Alert variant="destructive" className="py-3">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Button 
								type="submit" 
								className="w-full h-10" 
								disabled={loading || !username || !password}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										جاري تسجيل الدخول...
									</>
								) : (
									'تسجيل الدخول'
								)}
							</Button>
						</form>
					</div>

					<p className="text-center text-xs text-gray-500 mt-4">
						محمي ومُشفّر · Cosmed Admin Panel
					</p>
				</div>
			</div>
		</>
	)
}

export default Login