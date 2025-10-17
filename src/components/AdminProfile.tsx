import { useState, useEffect } from 'react';
import { profileApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Phone, Lock, Save } from 'lucide-react';

export default function AdminProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    smtp_email: '',
    smtp_password: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch admin profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data: any = await profileApi.getProfile();
      setProfile({
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        smtp_email: data.smtp_email || '',
        smtp_password: '', // Never load password from server
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في جلب البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.username.trim() || !profile.email.trim()) {
      toast({
        title: 'خطأ',
        description: 'الاسم والبريد الإلكتروني مطلوبان',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdating(true);
      await profileApi.updateProfile(profile);
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الملف الشخصي بنجاح',
        className: 'bg-green-50 border-green-200',
      });
      fetchProfile(); // Refresh profile
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في تحديث الملف الشخصي',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast({
        title: 'خطأ',
        description: 'جميع حقول كلمة المرور مطلوبة',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور الجديدة وتأكيدها غير متطابقين',
        variant: 'destructive',
      });
      return;
    }

    try {
      setChangingPassword(true);
      await profileApi.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast({
        title: 'تم التغيير',
        description: 'تم تغيير كلمة المرور بنجاح',
        className: 'bg-green-50 border-green-200',
      });
      // Clear password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في تغيير كلمة المرور',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            معلومات الحساب
          </CardTitle>
          <CardDescription>
            قم بتحديث اسم المستخدم، البريد الإلكتروني، ورقم الهاتف الخاص بك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم *</Label>
              <div className="flex gap-2 items-center">
                <User className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="أدخل اسم المستخدم"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                سيتم إرسال إشعارات الطلبات الجديدة إلى هذا البريد
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف (واتساب)</Label>
              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="212600000000"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                رقم واتساب لتلقي إشعارات الطلبات (مع رمز الدولة، بدون +)
              </p>
            </div>

            <Separator className="my-4" />
            
            <div className="space-y-4 rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                إعدادات إرسال البريد (SMTP)
              </h4>
              <p className="text-xs text-muted-foreground">
                حساب Gmail المستخدم لإرسال إشعارات الطلبات. يمكنك تحديثه دون تعديل الكود.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="smtp_email">البريد الإلكتروني للإرسال (Gmail)</Label>
                <Input
                  id="smtp_email"
                  type="email"
                  value={profile.smtp_email}
                  onChange={(e) => setProfile({ ...profile, smtp_email: e.target.value })}
                  placeholder="your-email@gmail.com"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp_password">App Password (كلمة مرور التطبيق)</Label>
                <Input
                  id="smtp_password"
                  type="password"
                  value={profile.smtp_password}
                  onChange={(e) => setProfile({ ...profile, smtp_password: e.target.value })}
                  placeholder="xxxx xxxx xxxx xxxx (16 حرف)"
                  dir="ltr"
                />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠️ استخدم App Password وليس كلمة المرور العادية. 
                  <a 
                    href="https://myaccount.google.com/apppasswords" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline mr-1"
                  >
                    احصل عليها من هنا
                  </a>
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={updating}
              className="w-full sm:w-auto"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            تغيير كلمة المرور
          </CardTitle>
          <CardDescription>
            قم بتحديث كلمة المرور الخاصة بك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">كلمة المرور الحالية *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => 
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder="أدخل كلمة المرور الحالية"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">كلمة المرور الجديدة *</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => 
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => 
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="أعد إدخال كلمة المرور الجديدة"
                minLength={6}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={changingPassword}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري التغيير...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  تغيير كلمة المرور
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
