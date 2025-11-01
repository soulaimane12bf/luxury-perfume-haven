import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationResponsive from '@/components/PaginationResponsive';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { DeleteTarget, Product } from '../types';

type ProductsTabProps = {
  filteredProducts: Product[];
  productSearchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenProductDialog: (product?: Product) => void;
  onOpenDeleteDialog: (target: DeleteTarget) => void;
  productPage: number;
  productTotalPages: number;
  productTotal: number;
  productLimit: number;
  onPageChange: (page: number) => void;
};

export function ProductsTab({
  filteredProducts,
  productSearchQuery,
  onSearchChange,
  onOpenProductDialog,
  onOpenDeleteDialog,
  productPage,
  productTotalPages,
  productTotal,
  productLimit,
  onPageChange,
}: ProductsTabProps) {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">إدارة المنتجات</CardTitle>
            <CardDescription className="text-xs md:text-sm">عرض وتعديل وحذف المنتجات</CardDescription>
          </div>
          <Button onClick={() => onOpenProductDialog()} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            إضافة منتج
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        <div className="p-4 md:p-6 md:pt-0 border-b">
          <div className="flex-1">
            <Input
              placeholder="البحث في المنتجات..."
              value={productSearchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="md:hidden space-y-3 p-4 overflow-x-hidden">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex gap-3">
                <img
                  src={product.image_urls?.[0] || ''}
                  alt={product.name}
                  className="h-20 w-20 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-sm font-bold text-gold">{product.price} DH</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => onOpenProductDialog(product)} className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onOpenDeleteDialog({ type: 'product', id: product.id, name: product.name })}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filteredProducts.length === 0 && <div className="text-sm text-center text-muted-foreground py-6">لا توجد منتجات</div>}
        </div>

        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>العلامة</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>المخزون</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.image_urls?.[0] || ''} alt={product.name} className="h-12 w-12 rounded object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>{product.price} درهم</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onOpenProductDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenDeleteDialog({ type: 'product', id: product.id, name: product.name })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    لا توجد منتجات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {productTotalPages > 1 && (
          <div className="w-full max-w-full px-2 py-3 bg-white/5 border-t mt-4 overflow-x-auto touch-pan-x scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <PaginationResponsive
              current={productPage || 1}
              total={productTotalPages && productTotalPages > 0 ? productTotalPages : Math.max(1, Math.ceil((productTotal || 0) / (productLimit || 1)))}
              onChange={onPageChange}
              ariaLabel="Products pagination"
            />
            <div className="text-sm text-muted mt-2">إجمالي المنتجات: {productTotal}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
