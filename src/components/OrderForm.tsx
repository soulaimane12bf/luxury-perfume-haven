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
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold" />
            إتمام الطلب
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Product Images - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {items.slice(0, 3).map((item, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-20 sm:h-24 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                  ×{item.quantity}
                </div>
              </div>
            ))}
            {items.length > 3 && (
              <div className="flex items-center justify-center bg-gray-100 rounded-lg text-sm font-semibold text-gray-600">
                +{items.length - 3}
              </div>
            )}
          </div>

          {/* Total - Compact */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">المجموع:</span>
              <span className="text-lg font-bold text-gold">{totalAmount} د.م</span>
            </div>
          </div>

          {/* Customer Name - Compact */}
          <div className="space-y-1">
            <Label htmlFor="customer_name" className="text-sm">
              الاسم الكامل <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customer_name"
              placeholder="أدخل اسمك الكامل"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              className={`h-9 text-sm ${errors.customer_name ? 'border-red-500' : ''}`}
            />
            {errors.customer_name && (
              <p className="text-xs text-red-500">{errors.customer_name}</p>
            )}
          </div>

          {/* Phone - Compact */}
          <div className="space-y-1">
            <Label htmlFor="customer_phone" className="text-sm">
              رقم الهاتف <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              placeholder="06XXXXXXXX"
              value={formData.customer_phone}
              onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              className={`h-9 text-sm ${errors.customer_phone ? 'border-red-500' : ''}`}
            />
            {errors.customer_phone && (
              <p className="text-xs text-red-500">{errors.customer_phone}</p>
            )}
          </div>

          {/* Address - Compact */}
          <div className="space-y-1">
            <Label htmlFor="customer_address" className="text-sm">
              العنوان الكامل <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="customer_address"
              placeholder="المدينة، الحي..."
              value={formData.customer_address}
              onChange={(e) => handleInputChange('customer_address', e.target.value)}
              className={`text-sm ${errors.customer_address ? 'border-red-500' : ''}`}
              rows={2}
            />
            {errors.customer_address && (
              <p className="text-xs text-red-500">{errors.customer_address}</p>
            )}
          </div>

          {/* Notes - Compact */}
          <div className="space-y-1">
            <Label htmlFor="notes" className="text-sm">
              ملاحظات <span className="text-gray-400 text-xs">(اختياري)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="ملاحظات إضافية..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="text-sm"
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 flex-row sm:flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 sm:flex-none h-9 text-sm"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 sm:flex-none min-w-[120px] h-9 text-sm bg-black hover:bg-gray-800"
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-3 w-3 animate-spin" />
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
