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
import Swal from 'sweetalert2';
import { Loader2, ShoppingBag, Sparkles, User, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';

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
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'خطأ في البيانات',
        text: 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
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

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '✅ تم إرسال الطلب بنجاح',
        text: 'سنتواصل معك قريباً لتأكيد الطلب عبر الهاتف.',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
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
    } catch (error) {
      console.error('Error creating order:', error);
      const message = error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى';
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'فشل إرسال الطلب',
        text: message,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
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
      <DialogContent 
        className="max-w-2xl max-h-[95vh] flex flex-col p-4 sm:p-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold">
            إتمام الطلب
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            املأ البيانات التالية لإتمام طلبك
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Images Grid - Better mobile display */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border-2 border-amber-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {items.map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="relative rounded-lg overflow-hidden border-2 border-white shadow-md aspect-square">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-contain bg-white p-1 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1 right-1 bg-black/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                        ×{item.quantity}
                      </div>
                    </div>
                    <p className="text-xs text-center mt-1 truncate text-gray-700 font-medium">{item.name}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-white rounded-lg p-3 border-2 border-amber-300 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    المجموع الكلي
                  </span>
                  <span className="text-xl font-bold text-amber-600">
                    {totalAmount} د.م
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customer_name" className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-amber-600" />
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_name"
                placeholder="أدخل اسمك الكامل"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className={`text-sm ${errors.customer_name ? 'border-red-400' : ''}`}
                autoFocus={false}
                autoComplete="off"
              />
              {errors.customer_name && (
                <p className="text-xs text-red-500">{errors.customer_name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="customer_phone" className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-600" />
                رقم الهاتف <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_phone"
                type="tel"
                placeholder="06XXXXXXXX"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className={`text-sm ${errors.customer_phone ? 'border-red-400' : ''}`}
                autoFocus={false}
                autoComplete="off"
              />
              {errors.customer_phone && (
                <p className="text-xs text-red-500">{errors.customer_phone}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="customer_address" className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                العنوان <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="customer_address"
                placeholder="المدينة، الحي..."
                value={formData.customer_address}
                onChange={(e) => handleInputChange('customer_address', e.target.value)}
                className={`text-sm resize-none ${errors.customer_address ? 'border-red-400' : ''}`}
                rows={3}
              />
              {errors.customer_address && (
                <p className="text-xs text-red-500">{errors.customer_address}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-600" />
                ملاحظات <span className="text-gray-400 text-xs font-normal">(اختياري)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="ملاحظات إضافية..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs text-center text-green-700 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">معلوماتك محمية ومؤمنة</span>
              </p>
            </div>
          </form>
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 flex-row justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            إلغاء
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            onClick={handleSubmit}
            className="w-full sm:w-auto min-w-[120px] bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الإرسال...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                تأكيد الطلب
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
