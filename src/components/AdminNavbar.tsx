import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, ShoppingBag, Store } from 'lucide-react';

interface AdminNavbarProps {
  showMenuButton?: boolean;
  onToggleSidebar?: () => void;
}

export default function AdminNavbar({ showMenuButton = false, onToggleSidebar }: AdminNavbarProps) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="border-b bg-background/95 dark:bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-sm">
      <div className="container py-3 md:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="md:hidden text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
          <div>
            <h1 className="text-base md:text-xl font-bold">لوحة التحكم</h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Cosmed Stores</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {admin && (
            <div className="text-xs md:text-sm text-right hidden md:block">
              <div className="font-medium">{admin.username}</div>
              <div className="text-xs text-muted-foreground">{admin.role}</div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="hidden sm:flex border-amber-300/40 text-amber-500 hover:text-amber-400 hover:border-amber-400/60"
          >
            <Store className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">العودة للمتجر</span>
            <span className="md:hidden">المتجر</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="sm:hidden border-amber-300/40 text-amber-500 hover:text-amber-400 hover:border-amber-400/60"
          >
            <Store className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="hidden sm:flex border-red-300/40 text-red-500 hover:text-red-400 hover:border-red-400/60"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">تسجيل الخروج</span>
            <span className="md:hidden">خروج</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="sm:hidden border-red-300/40 text-red-500 hover:text-red-400 hover:border-red-400/60"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
