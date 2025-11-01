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
import { Slider } from '../types';

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
  onClose,
  onSave,
}: SliderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingSlider ? 'تعديل شريحة' : 'إضافة شريحة جديدة'}</DialogTitle>
          <DialogDescription>أضف صورة وعنوان ونص للشريحة التي ستظهر في الصفحة الرئيسية</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="slider-image">صورة السلايدر</Label>
            <Input
              id="slider-image"
              type="file"
              accept="image/*"
              onChange={(e) => setSliderImage(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">سيتم ضغط الصور الكبيرة تلقائياً. الحد الأقصى: 10MB</p>
            {(sliderForm.image_url || sliderImage) && (
              <img
                src={sliderImage ? URL.createObjectURL(sliderImage) : sliderForm.image_url}
                alt="Preview"
                className="mt-2 h-32 w-full object-cover rounded"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slider-title">العنوان الرئيسي</Label>
            <Input
              id="slider-title"
              placeholder="مثال: عروض خاصة على العطور الفاخرة"
              value={sliderForm.title}
              onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slider-subtitle">النص الفرعي</Label>
            <Textarea
              id="slider-subtitle"
              placeholder="وصف قصير للعرض أو المحتوى"
              value={sliderForm.subtitle}
              onChange={(e) => setSliderForm({ ...sliderForm, subtitle: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slider-button-text">نص الزر (اختياري)</Label>
              <Input
                id="slider-button-text"
                placeholder="تسوق الآن"
                value={sliderForm.button_text}
                onChange={(e) => setSliderForm({ ...sliderForm, button_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slider-button-link">رابط الزر (اختياري)</Label>
              <Input
                id="slider-button-link"
                placeholder="/collection/parfums"
                value={sliderForm.button_link}
                onChange={(e) => setSliderForm({ ...sliderForm, button_link: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slider-order">ترتيب العرض</Label>
              <Input
                id="slider-order"
                type="number"
                value={sliderForm.order}
                onChange={(e) => setSliderForm({ ...sliderForm, order: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="space-y-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="slider-active"
                checked={sliderForm.active}
                onChange={(e) => setSliderForm({ ...sliderForm, active: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="slider-active">نشط</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={onSave}>{editingSlider ? 'تحديث' : 'إضافة'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

