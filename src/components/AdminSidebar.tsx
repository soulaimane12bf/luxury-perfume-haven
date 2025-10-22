import { Package, ShoppingCart, FolderTree, Star, User, LogOut, LayoutDashboard, TrendingUp, X, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onClose?: () => void;
  className?: string;
  isMobile?: boolean;
}

export default function AdminSidebar({ activeTab, onTabChange, onLogout, onClose, className, isMobile = false }: AdminSidebarProps) {
  const menuItems = [
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart, color: 'text-amber-600' },
    { id: 'products', label: 'المنتجات', icon: Package, color: 'text-blue-600' },
    { id: 'bestsellers', label: 'الأكثر مبيعاً', icon: TrendingUp, color: 'text-emerald-500' },
    { id: 'categories', label: 'الأقسام', icon: FolderTree, color: 'text-green-600' },
    { id: 'reviews', label: 'التقييمات', icon: Star, color: 'text-yellow-600' },
    { id: 'sliders', label: 'الصور المتحركة', icon: Images, color: 'text-pink-600' },
    { id: 'profile', label: 'الملف الشخصي', icon: User, color: 'text-purple-600' },
  ];

  return (
    <div
      className={cn(
        'relative flex h-full w-64 flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black border-r border-amber-500/30 shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-transform duration-300 ease-out overflow-hidden',
        isMobile ? 'h-full rounded-r-3xl rounded-l-none' : 'h-screen',
        className
      )}
    >
      <div className="absolute inset-0 opacity-60 pointer-events-none bg-[radial-gradient(circle_at_top,#facc15_0%,rgba(0,0,0,0)_55%)] blur-3xl" />

      {/* Logo/Header */}
      <div className="relative p-6 border-b border-amber-500/20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.35)]">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">لوحة التحكم</h2>
              <p className="text-xs text-amber-400/80">نظام الإدارة</p>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-amber-200 hover:text-amber-100 hover:bg-amber-500/10"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (isMobile && onClose) {
                  onClose();
                }
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-gray-800/50 hover:translate-x-1',
                isActive && 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30',
                !isActive && 'hover:border hover:border-gray-700'
              )}
            >
              <Icon className={cn(
                'w-5 h-5',
                isActive ? 'text-amber-400' : item.color ?? 'text-gray-400'
              )} />
              <span className={cn(
                'text-sm font-medium',
                isActive ? 'text-white' : 'text-gray-300'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="mr-auto w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="relative p-4 border-t border-amber-500/20">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClickCapture={() => {
            if (isMobile && onClose) {
              onClose();
            }
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );
}
