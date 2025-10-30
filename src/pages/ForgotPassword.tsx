import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maskedAdminEmail, setMaskedAdminEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch masked admin email to help users who forget the exact address
    const fetchMasked = async () => {
      try {
        const res = await fetch('/api/auth/masked-admin-email');
        if (!res.ok) return;
        const data = await res.json();
        setMaskedAdminEmail(data.masked || null);
      } catch (e) {
        // ignore
      }
    };
    fetchMasked();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        // If admin not found, suggest the masked admin email to help the user
        if (res.status === 404 && maskedAdminEmail) {
          throw new Error(`${data.message || 'لم يتم العثور على حساب بهذا البريد.'} — هل تقصد: ${maskedAdminEmail}?`);
        }
        throw new Error(data.message || 'حدث خطأ ما');
      }
      setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. تحقق من صندوق الوارد.');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl shadow-2xl border border-white/10 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4 shadow-lg shadow-yellow-500/50">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">استعادة كلمة المرور</h1>
          <p className="text-gray-400 text-sm">أدخل بريدك الإلكتروني لاستلام رابط إعادة تعيين كلمة المرور</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            className="h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
          />
          {maskedAdminEmail && (
            <p className="text-xs text-gray-400">هل نسيت البريد؟ البريد المُسجّل يبدأ بـ: <strong className="text-yellow-400">{maskedAdminEmail}</strong></p>
          )}
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
          <Button type="submit" className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-base shadow-lg shadow-yellow-500/30 transition-all duration-300" disabled={loading || !email}>
            {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
