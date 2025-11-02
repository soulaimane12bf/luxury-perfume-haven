import { Package, ShoppingCart, FolderTree, Star, User, LogOut, LayoutDashboard, TrendingUp, X, Image } from 'lucide-react';
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
    { id: 'sliders', label: 'السلايدر', icon: Image, color: 'text-pink-500' },
    { id: 'categories', label: 'الأقسام', icon: FolderTree, color: 'text-green-600' },
    { id: 'reviews', label: 'التقييمات', icon: Star, color: 'text-yellow-600' },
    { id: 'profile', label: 'الملف الشخصي', icon: User, color: 'text-purple-600' },
  ];

  return (
    <div
      className={cn(
        'relative flex h-full w-64 flex-col bg-gradient-to-b from-white via-amber-50/30 to-white border-r border-amber-200 shadow-lg transition-transform duration-300 ease-out overflow-hidden',
        isMobile ? 'h-full rounded-l-3xl rounded-r-none' : 'h-screen',
        className
      )}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top,#fbbf24_0%,rgba(255,255,255,0)_55%)] blur-3xl" />

      {/* Logo/Header */}
      <div className="relative p-6 border-b border-amber-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-wide">لوحة التحكم</h2>
              <p className="text-xs text-amber-600">نظام الإدارة</p>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 hover:bg-amber-100"
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
                'hover:bg-amber-50 hover:translate-x-1',
                isActive && 'bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-300 shadow-sm',
                !isActive && 'hover:border hover:border-amber-100'
              )}
            >
              <Icon className={cn(
                'w-5 h-5',
                isActive ? 'text-amber-600' : item.color ?? 'text-gray-600'
              )} />
              <span className={cn(
                'text-sm font-medium',
                isActive ? 'text-gray-900' : 'text-gray-700'
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
      <div className="relative p-4 border-t border-amber-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            // Close the mobile sidebar first if provided, then run the logout handler.
            if (isMobile && onClose) {
              try {
                onClose();
              } catch (e) {
                // ignore
              }
            }
            if (typeof onLogout === 'function') {
              onLogout();
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
