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
import { Category, CategoryForm } from '../types';

type CategoryDialogProps = {
  open: boolean;
  editingCategory: Category | null;
  categoryForm: CategoryForm;
  setCategoryForm: React.Dispatch<React.SetStateAction<CategoryForm>>;
  onClose: () => void;
  onSave: () => void;
};

export function CategoryDialog({
  open,
  editingCategory,
  categoryForm,
  setCategoryForm,
  onClose,
  onSave,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</DialogTitle>
          <DialogDescription>{editingCategory ? 'تعديل بيانات الفئة' : 'أدخل بيانات الفئة الجديدة'}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">اسم الفئة</Label>
            <Input
              id="category-name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-slug">الرمز (Slug)</Label>
            <Input
              id="category-slug"
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              placeholder="category-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">الوصف</Label>
            <Textarea
              id="category-description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto">
            {editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

