import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderTree, TrendingUp, Star } from 'lucide-react';

type StatsCardsProps = {
  stats: {
    totalProducts: number;
    totalCategories: number;
    bestSellers: number;
    pendingReviews: number;
  };
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
      <Card className="border-l-4 border-l-amber-500 bg-white/80 dark:bg-gray-900/60 backdrop-blur hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-amber-100">إجمالي المنتجات</CardTitle>
          <Package className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-400">{stats.totalProducts}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500 bg-white/80 dark:bg-gray-900/60 backdrop-blur hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-amber-100">الفئات</CardTitle>
          <FolderTree className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">{stats.totalCategories}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 bg-white/80 dark:bg-gray-900/60 backdrop-blur hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-amber-100">الأكثر مبيعاً</CardTitle>
          <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-400">{stats.bestSellers}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500 bg-white/80 dark:bg-gray-900/60 backdrop-blur hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-amber-100">تقييمات معلقة</CardTitle>
          <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-yellow-900 dark:text-yellow-400">{stats.pendingReviews}</div>
        </CardContent>
      </Card>
    </div>
  );
}

