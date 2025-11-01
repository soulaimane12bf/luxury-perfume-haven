import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Category, Product } from '../types';

type ProductDialogProps = {
  open: boolean;
  editingProduct: Product | null;
  productForm: {
    id: string;
    name: string;
    brand: string;
    price: string;
    old_price: string;
    category: string;
    type: string;
    size: string;
    description: string;
    stock: string | number;
  };
  setProductForm: React.Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
      brand: string;
      price: string;
      old_price: string;
      category: string;
      type: string;
      size: string;
      description: string;
      stock: string | number;
    }>
  >;
  categories: Category[];
  productImages: File[];
  setProductImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImageUrls: string[];
  setExistingImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
  onSave: () => void;
};

export function ProductDialog({
  open,
  editingProduct,
  productForm,
  setProductForm,
  categories,
  productImages,
  setProductImages,
  existingImageUrls,
  setExistingImageUrls,
  onClose,
  onSave,
}: ProductDialogProps) {
  useEffect(() => {
    if (!open || !productForm.category || categories.length === 0) return;
    const hasSlug = categories.some((category) => category.slug === productForm.category);
    if (hasSlug) return;
    const matching = categories.find((category) => category.id === productForm.category);
    if (matching) {
      setProductForm((prev) => ({ ...prev, category: matching.slug }));
    }
  }, [categories, open, productForm.category, setProductForm]);

  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
          <DialogDescription>{editingProduct ? 'تعديل بيانات المنتج' : 'أدخل بيانات المنتج الجديد'}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">اسم المنتج</Label>
            <Input id="product-name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-brand">العلامة التجارية</Label>
              <Input id="product-brand" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-price">السعر الحالي (درهم)</Label>
              <Input
                id="product-price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-old-price">السعر القديم (اختياري)</Label>
              <Input
                id="product-old-price"
                type="number"
                placeholder="للتخفيضات فقط"
                value={productForm.old_price}
                onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">إذا كان هناك تخفيض، أدخل السعر القديم هنا</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-category">الفئة</Label>
              <select
                id="product-category"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">اختر الفئة</option>
                {categories.length === 0 ? (
                  <option disabled>جاري تحميل الفئات...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-stock">المخزون</Label>
              <Input
                id="product-stock"
                type="number"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    stock: e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">الوصف</Label>
            <Textarea
              id="product-description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-images">صور المنتج</Label>
            <Input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setProductImages(files);
              }}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">يمكنك اختيار صور متعددة</p>

            {existingImageUrls.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">الصور الحالية:</p>
                <div className="flex flex-wrap gap-2">
                  {existingImageUrls.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img src={url} alt={`Product ${idx + 1}`} className="h-20 w-20 object-cover rounded border" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => setExistingImageUrls(existingImageUrls.filter((_, i) => i !== idx))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {productImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">الصور الجديدة:</p>
                <div className="flex flex-wrap gap-2">
                  {productImages.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`New ${idx + 1}`} className="h-20 w-20 object-cover rounded border" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => setProductImages(productImages.filter((_, i) => i !== idx))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto">
            {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
