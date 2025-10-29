import { useState, useEffect } from 'react';
import { profileApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import showAdminAlert from '@/lib/swal-admin';
import { Loader2, User, Mail, Phone, Lock, Save, Instagram, Facebook } from 'lucide-react';

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
    instagram: '',
    facebook: '',
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
        instagram: data.instagram || '',
        facebook: data.facebook || '',
      });
    } catch (error: any) {
      showAdminAlert({
        title: 'خطأ',
        text: error.message || 'فشل في جلب البيانات',
        icon: 'error',
        timer: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.username.trim() || !profile.email.trim()) {
      showAdminAlert({ title: 'خطأ', text: 'الاسم والبريد الإلكتروني مطلوبان', icon: 'error', timer: 5000 });
      return;
    }

    try {
      setUpdating(true);
      
      // Only send SMTP password if it was actually changed (not empty)
      const updateData = {
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        smtp_email: profile.smtp_email,
        // Only include smtp_password if user entered a new one
        ...(profile.smtp_password.trim() ? { smtp_password: profile.smtp_password } : {})
        ,
        instagram: profile.instagram,
        facebook: profile.facebook,
      };
      
      await profileApi.updateProfile(updateData);
      showAdminAlert({ title: 'تم التحديث', text: 'تم تحديث الملف الشخصي بنجاح', icon: 'success', timer: 3000 });
      fetchProfile(); // Refresh profile
    } catch (error: any) {
      showAdminAlert({ title: 'خطأ', text: error.message || 'فشل في تحديث الملف الشخصي', icon: 'error', timer: 5000 });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showAdminAlert({ title: 'خطأ', text: 'جميع حقول كلمة المرور مطلوبة', icon: 'error', timer: 5000 });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showAdminAlert({ title: 'خطأ', text: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', icon: 'error', timer: 5000 });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAdminAlert({ title: 'خطأ', text: 'كلمة المرور الجديدة وتأكيدها غير متطابقين', icon: 'error', timer: 5000 });
      return;
    }

    try {
      setChangingPassword(true);
      await profileApi.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      showAdminAlert({ title: 'تم التغيير', text: 'تم تغيير كلمة المرور بنجاح', icon: 'success', timer: 3000 });
      // Clear password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      showAdminAlert({ title: 'خطأ', text: error.message || 'فشل في تغيير كلمة المرور', icon: 'error', timer: 5000 });
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
              <Label htmlFor="email" className="flex items-center gap-2">
                البريد الإلكتروني المستقبل *
                <span className="text-xs font-normal text-muted-foreground">(إلى أين تصل الطلبات)</span>
              </Label>
              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                📬 سيتم إرسال إشعارات الطلبات الجديدة إلى هذا البريد الإلكتروني
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

            <div className="space-y-2">
              <Label htmlFor="instagram">انستاغرام</Label>
              <div className="flex gap-2 items-center">
                <Instagram className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  type="text"
                  value={profile.instagram}
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  placeholder="https://instagram.com/yourprofile أو @handle"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">رابط أو مُعرّف حساب انستاغرام ليظهر في الفوتر</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">فيسبوك</Label>
              <div className="flex gap-2 items-center">
                <Facebook className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="facebook"
                  type="text"
                  value={profile.facebook}
                  onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">رابط صفحة فيسبوك لإظهاره في الفوتر</p>
            </div>

            {/* Removed SMTP email and app password section: now handled by Resend only */}

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
