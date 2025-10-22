import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ordersApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingBag } from 'lucide-react';

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OrderItem[];
  totalAmount: number;
  onSuccess?: () => void;
}

export default function OrderForm({ open, onOpenChange, items, totalAmount, onSuccess }: OrderFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'الاسم الكامل مطلوب';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'رقم الهاتف مطلوب';
    } else if (!/^[0-9+\s-]+$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'رقم هاتف غير صحيح';
    }

    if (!formData.customer_address.trim()) {
      newErrors.customer_address = 'العنوان مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_address: formData.customer_address.trim(),
        items,
        total_amount: totalAmount,
        notes: formData.notes.trim() || undefined,
      };

      await ordersApi.create(orderData);

      toast({
        title: '✅ تم إرسال الطلب بنجاح',
        description: 'سنتواصل معك قريباً لتأكيد الطلب عبر الهاتف.',
        className: 'bg-green-50 border-green-200',
      });

      // Reset form
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        notes: '',
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: 'فشل إرسال الطلب',
        description: error.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            إتمام الطلب
          </DialogTitle>
          <DialogDescription>
            يرجى ملء المعلومات التالية لإتمام طلبك
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">ملخص الطلب</h4>
            <div className="space-y-2 text-sm">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">{item.price * item.quantity} درهم</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>المجموع:</span>
                <span className="text-primary">{totalAmount} درهم</span>
              </div>
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer_name">
              الاسم الكامل <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customer_name"
              placeholder="أدخل اسمك الكامل"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              className={errors.customer_name ? 'border-red-500' : ''}
            />
            {errors.customer_name && (
              <p className="text-sm text-red-500">{errors.customer_name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="customer_phone">
              رقم الهاتف <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              placeholder="06XXXXXXXX أو +212XXXXXXXXX"
              value={formData.customer_phone}
              onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              className={errors.customer_phone ? 'border-red-500' : ''}
            />
            {errors.customer_phone && (
              <p className="text-sm text-red-500">{errors.customer_phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="customer_address">
              العنوان الكامل <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="customer_address"
              placeholder="المدينة، الحي، الشارع، رقم المنزل..."
              value={formData.customer_address}
              onChange={(e) => handleInputChange('customer_address', e.target.value)}
              className={errors.customer_address ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.customer_address && (
              <p className="text-sm text-red-500">{errors.customer_address}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              ملاحظات إضافية <span className="text-muted-foreground text-xs">(اختياري)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="أي ملاحظات أو طلبات خاصة..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                'تأكيد الطلب'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
