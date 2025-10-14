import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOut, ShoppingBag } from 'lucide-react';

export default function AdminNavbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="border-b bg-white">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-6 w-6" />
          <div>
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
            <p className="text-sm text-muted-foreground">Luxury Perfume Haven</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {admin && (
            <div className="text-sm text-right">
              <div className="font-medium">{admin.username}</div>
              <div className="text-xs text-muted-foreground">{admin.role}</div>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  );
}
