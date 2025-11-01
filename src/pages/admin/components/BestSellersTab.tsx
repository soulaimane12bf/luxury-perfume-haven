import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BestSellingToggle } from '@/components/BestSellingToggle';
import PaginationResponsive from '@/components/PaginationResponsive';
import { Product } from '../types';

type BestSellersTabProps = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onToggleBestSelling: (productId: string) => void;
};

export function BestSellersTab({
  products,
  total,
  page,
  totalPages,
  limit,
  onPageChange,
  onToggleBestSelling,
}: BestSellersTabProps) {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">الأكثر مبيعاً</CardTitle>
            <CardDescription className="text-xs md:text-sm">إدارة حالة المنتجات الأكثر مبيعاً</CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            إجمالي المنتجات الأكثر مبيعاً: <span className="font-semibold text-primary">{total}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0 space-y-4">
        <div className="md:hidden space-y-3 p-4">
          {products.map((product) => {
            const toggleId = `best-selling-toggle-mobile-${product.id}`;
            const labelId = `${toggleId}-label`;
            return (
              <Card key={product.id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <p className="text-sm font-bold text-gold mt-1">{product.price} درهم</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span id={labelId} className="text-xs text-muted-foreground whitespace-nowrap">
                      الأكثر مبيعاً
                    </span>
                    <BestSellingToggle
                      id={toggleId}
                      ariaLabelledBy={labelId}
                      checked={product.best_selling}
                      onChange={() => onToggleBestSelling(product.id)}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
          {products.length === 0 && <div className="text-sm text-center text-muted-foreground py-6">لا توجد منتجات</div>}
        </div>

        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>العلامة</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead className="text-center">الأكثر مبيعاً</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const toggleId = `best-selling-toggle-desktop-${product.id}`;
                const labelId = `${toggleId}-label`;
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.price} درهم</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <span id={labelId} className="sr-only">
                          الأكثر مبيعاً
                        </span>
                        <BestSellingToggle
                          id={toggleId}
                          ariaLabelledBy={labelId}
                          checked={product.best_selling}
                          onChange={() => onToggleBestSelling(product.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    لا توجد منتجات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="w-full overflow-x-auto bg-transparent border-t">
            <div className="px-4 py-3 bg-white/5">
              <PaginationResponsive
                current={page || 1}
                total={totalPages || Math.max(1, Math.ceil((total || 0) / (limit || 1)))}
                onChange={onPageChange}
                ariaLabel="Best sellers pagination"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

