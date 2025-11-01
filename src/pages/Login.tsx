import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, Lock, User, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import SEO from '@/components/SEO';

type FocusedField = 'username' | 'password' | null;

type LocationState = {
	from?: {
		pathname?: string;
	};
};

const Login = () => {

	const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/login';
	const title = 'تسجيل الدخول | Cosmed Stores';
	const description = 'تسجيل الدخول إلى حسابك في Cosmed Stores للوصول إلى الطلبات والخصومات.';
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [focusedField, setFocusedField] = useState<FocusedField>(null)

	const navigate = useNavigate()
	const location = useLocation()

	const { login, isAuthenticated, loading: authLoading } = useAuth()

	const from = ((location.state as LocationState | undefined)?.from?.pathname) || '/admin'

	useEffect(() => {
		// if the auth hook finished and user is authenticated, redirect away from login
		if (!authLoading && isAuthenticated) {
			navigate(from, { replace: true })
		}
	}, [authLoading, isAuthenticated, navigate, from])

	useEffect(() => {
		// Clear inline error only when the user edits the username or password.
		// Previously this effect also depended on `error` which immediately
		// cleared the error after it was set, preventing the alert from
		// remaining visible. Keep the dependency list to username/password
		// so the alert stays until the user changes the inputs.
		if (error) {
			setError(null)
		}
	}, [username, password, error])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			await login(username, password)
			// login sets auth state in hook; navigate will happen in the effect above
		} catch (err) {
			let message = 'اسم المستخدم أو كلمة المرور غير صحيحة'
			if (err instanceof Error) {
				const apiError = err as Error & { status?: number }
				if (apiError.status === 401) {
					message = 'اسم المستخدم أو كلمة المرور غير صحيحة'
				} else {
					message = err.message || message
				}
			} else if (typeof err === 'string') {
				message = err
			}
			// Set the error and move focus to the alert for accessibility
			setError(message)
			setTimeout(() => {
				const el = document.getElementById('login-error-alert')
				if (el) {
					el.focus()
				}
			}, 50)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
			<SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }} />
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-20 left-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-yellow-600/5 to-yellow-500/5 rounded-full blur-3xl"></div>
			</div>

			{/* Top Navigation Bar */}
			<div className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
				<div className="container mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/50">
							<span className="text-black font-bold text-xl">C</span>
						</div>
						<div className="hidden sm:block">
							<span className="text-white font-bold text-lg tracking-wide">COSMED</span>
							<p className="text-yellow-400/80 text-xs tracking-widest">متجر العطور الفاخرة</p>
						</div>
					</div>
					<Link 
						to="/" 
						className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-500/30 hover:border-yellow-500/60 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300"
					>
						<span className="text-yellow-400 text-sm font-medium">عودة للموقع</span>
						<ArrowRight className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
					</Link>
				</div>
			</div>

			{/* Main Content */}
			<div className="relative z-10 min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
				<div className="w-full max-w-md">
					{/* Login Card */}
					<div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
						{/* Gold accent bar */}
						<div className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
						
						<div className="p-8 sm:p-10">
							{/* Header */}
							<div className="text-center mb-8">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4 shadow-lg shadow-yellow-500/50">
									<Lock className="w-8 h-8 text-black" />
								</div>
								<h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
									لوحة التحكم
								</h1>
								<p className="text-gray-400 text-sm">
									تسجيل الدخول للمشرفين فقط
								</p>
								<div className="mt-4 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
							</div>

							{/* Form */}
							<form onSubmit={onSubmit} className="space-y-6">
								{/* Username Field */}
								<div className="space-y-2">
									<Label 
										htmlFor="username" 
										className="text-sm font-medium text-gray-300 flex items-center gap-2"
									>
										<User className="w-4 h-4 text-yellow-400" />
										اسم المستخدم أو البريد الإلكتروني
									</Label>
									<div className="relative">
										<Input 
											id="username"
											type="text"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											onFocus={() => setFocusedField('username')}
											onBlur={() => setFocusedField(null)}
											placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
											required
											disabled={loading}
											className={`h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300 ${
												focusedField === 'username' ? 'shadow-lg shadow-yellow-500/10' : ''
											}`}
											autoFocus
										/>
									</div>

												</div>

												{/* Password Field */}
												<div className="space-y-2">
													<Label 
														htmlFor="password" 
														className="text-sm font-medium text-gray-300 flex items-center gap-2"
													>
														<Lock className="w-4 h-4 text-yellow-400" />
														كلمة المرور
													</Label>
													<div className="relative">
														<Input 
															id="password"
															type="password"
															value={password}
															onChange={(e) => setPassword(e.target.value)}
															onFocus={() => setFocusedField('password')}
															onBlur={() => setFocusedField(null)}
															placeholder="أدخل كلمة المرور"
															required
															disabled={loading}
															className={`h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300 ${
																focusedField === 'password' ? 'shadow-lg shadow-yellow-500/10' : ''
															}`}
														/>
													</div>
													<div className="mt-2 text-right">
														<Link to="/forgot-password" className="text-xs text-yellow-400 hover:underline">نسيت كلمة المرور؟</Link>
													</div>
												</div>

								{/* Error Alert */}
								{error && (
									<Alert id="login-error-alert" tabIndex={-1} role="alert" aria-live="assertive" className="bg-red-500/10 border-red-500/50 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription className="text-sm">{error}</AlertDescription>
									</Alert>
								)}

								{/* Submit Button */}
								<Button 
									type="submit" 
									className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold text-base shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
									disabled={loading || !username || !password}
								>
									{loading ? (
										<span className="flex items-center justify-center gap-2">
											<Loader2 className="h-5 w-5 animate-spin" />
											جاري التحقق...
										</span>
									) : (
										<span className="flex items-center justify-center gap-2">
											تسجيل الدخول
											<ArrowRight className="w-5 h-5" />
										</span>
									)}
								</Button>
							</form>

							{/* Footer Note */}
							<div className="mt-8 pt-6 border-t border-gray-800">
								<p className="text-center text-xs text-gray-500">
									<Lock className="w-3 h-3 inline mr-1" />
									اتصال مُشفّر وآمن
								</p>
							</div>
						</div>
					</div>

					{/* Bottom Info */}
					<div className="mt-6 text-center">
						<p className="text-gray-500 text-xs">
							© 2025 Cosmedstores · جميع الحقوق محفوظة
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
