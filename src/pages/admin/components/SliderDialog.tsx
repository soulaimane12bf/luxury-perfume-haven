import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider, Category } from '../types';

type SliderDialogProps = {
  open: boolean;
  editingSlider: Slider | null;
  sliderForm: {
    image_url: string;
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    order: number;
    active: boolean;
  };
  setSliderForm: React.Dispatch<
    React.SetStateAction<{
      image_url: string;
      title: string;
      subtitle: string;
      button_text: string;
      button_link: string;
      order: number;
      active: boolean;
    }>
  >;
  sliderImage: File | null;
  setSliderImage: React.Dispatch<React.SetStateAction<File | null>>;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
};

export function SliderDialog({
  open,
  editingSlider,
  sliderForm,
  setSliderForm,
  sliderImage,
  setSliderImage,
  categories,
  onClose,
  onSave,
}: SliderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent className="max-w-2xl max-h-[95vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">{editingSlider ? 'تعديل شريحة' : 'إضافة شريحة جديدة'}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">أضف صورة وعنوان ونص للشريحة التي ستظهر في الصفحة الرئيسية</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="slider-image" className="text-sm">صورة السلايدر</Label>
              <Input
                id="slider-image"
                type="file"
                accept="image/*"
                onChange={(e) => setSliderImage(e.target.files?.[0] || null)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">سيتم ضغط الصور الكبيرة تلقائياً. الحد الأقصى: 10MB</p>
              {(sliderForm.image_url || sliderImage) && (
                <img
                  src={sliderImage ? URL.createObjectURL(sliderImage) : sliderForm.image_url}
                  alt="Preview"
                  className="mt-2 h-32 sm:h-40 w-full object-cover rounded border-2 border-amber-200"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slider-title" className="text-sm">العنوان الرئيسي</Label>
              <Input
                id="slider-title"
                placeholder="مثال: عروض خاصة على العطور الفاخرة"
                value={sliderForm.title}
                onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value })}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slider-subtitle" className="text-sm">النص الفرعي</Label>
              <Textarea
                id="slider-subtitle"
                placeholder="وصف قصير للعرض أو المحتوى"
                value={sliderForm.subtitle}
                onChange={(e) => setSliderForm({ ...sliderForm, subtitle: e.target.value })}
                className="text-sm min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slider-button-text" className="text-sm">نص الزر (اختياري)</Label>
                <Input
                  id="slider-button-text"
                  placeholder="تسوق الآن"
                  value={sliderForm.button_text}
                  onChange={(e) => setSliderForm({ ...sliderForm, button_text: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slider-button-link" className="text-sm">وجهة الزر (اختياري)</Label>
                <Select
                  value={sliderForm.button_link}
                  onValueChange={(value) => setSliderForm({ ...sliderForm, button_link: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="اختر وجهة الزر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/products">جميع المنتجات</SelectItem>
                    <SelectItem value="/products?bestsellers=true">الأكثر مبيعاً</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={`/collection/${category.slug || category.name}`}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slider-order" className="text-sm">ترتيب العرض</Label>
                <Input
                  id="slider-order"
                  type="number"
                  placeholder="مثال: 1"
                  value={sliderForm.order || ''}
                  onChange={(e) => setSliderForm({ ...sliderForm, order: parseInt(e.target.value, 10) || 0 })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">الحالة</Label>
                <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                  <input
                    type="checkbox"
                    id="slider-active"
                    checked={sliderForm.active}
                    onChange={(e) => setSliderForm({ ...sliderForm, active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="slider-active" className="cursor-pointer text-sm font-normal">نشط</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 flex-col-reverse sm:flex-row gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700">
            {editingSlider ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

