import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // On mount, validate the token with the backend. If invalid/expired, redirect
  // to /forgot-password (or login) and show an error.
  useEffect(() => {
    (async () => {
      if (!token) {
        setError('رمز إعادة التعيين مفقود. يرجى طلب إعادة تعيين كلمة المرور.');
        setTimeout(() => navigate('/forgot-password', { replace: true }), 1800);
        return;
      }
      try {
        const res = await fetch(`/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`);
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d.message || 'رمز إعادة التعيين غير صالح أو منتهي.');
          setTimeout(() => navigate('/forgot-password', { replace: true }), 1800);
        }
      } catch (err) {
        console.error('Failed to validate reset token', err);
        setError('فشل التحقق من الرمز. حاول مرة أخرى.');
        setTimeout(() => navigate('/forgot-password', { replace: true }), 1800);
      }
    })();
  }, [token, navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'حدث خطأ ما');
      setSuccess('تم تعيين كلمة مرور جديدة بنجاح. سيتم تحويلك إلى صفحة تسجيل الدخول.');
      try {
        sessionStorage.setItem(`reset_used:${token}`, '1');
      } catch (storageError) {
        console.error('Failed to persist reset token usage', storageError);
      }
      setTimeout(() => navigate('/login', { replace: true }), 1600);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ ما';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl shadow-2xl border border-white/10 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4 shadow-lg shadow-yellow-500/50">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">تعيين كلمة مرور جديدة</h1>
          <p className="text-gray-400 text-sm">أدخل كلمة مرور جديدة لحسابك</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            type="password"
            placeholder="كلمة المرور الجديدة"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            className="h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
          />
          {error && (
            <Alert className="bg-red-500/10 border-red-500/50 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-500/10 border-green-500/50 text-green-400 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{success}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-base shadow-lg shadow-yellow-500/30 transition-all duration-300" disabled={loading || !password}>
            {loading ? 'جاري التعيين...' : 'تعيين كلمة المرور'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
