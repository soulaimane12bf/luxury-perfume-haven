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
    } catch (error) {
      console.error('Error creating order:', error);
      const message = error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى';
      toast({
        title: 'فشل إرسال الطلب',
        description: message,
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
      <DialogContent className="sm:max-w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto p-0 z-[250] bg-gradient-to-br from-white to-gray-50 border-none shadow-2xl">
        {/* Gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
        
        <div className="p-4 sm:p-6">
          <DialogHeader className="space-y-2 mb-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-2 shadow-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-xl sm:text-2xl text-center font-bold text-gray-900">
              إتمام الطلب
            </DialogTitle>
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Product Images - Compact */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-2">
                {items.slice(0, 4).map((item, index) => (
                  <div key={index} className="relative flex-1 group">
                    <div className="relative rounded-lg overflow-hidden border-2 border-white shadow-md">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-16 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ×{item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
                {items.length > 4 && (
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200 text-sm font-bold text-yellow-700 h-16">
                    +{items.length - 4}
                  </div>
                )}
              </div>

              {/* Total - Compact */}
              <div className="bg-white rounded-lg p-2.5 border border-gray-200/50 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    المجموع
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                    {totalAmount} د.م
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Name - Compact */}
            <div className="space-y-1.5">
              <Label htmlFor="customer_name" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-yellow-600" />
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_name"
                placeholder="أدخل اسمك الكامل"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className={`h-9 text-sm bg-white border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all ${errors.customer_name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.customer_name && (
                <p className="text-[10px] text-red-500">{errors.customer_name}</p>
              )}
            </div>

            {/* Phone - Compact */}
            <div className="space-y-1.5">
              <Label htmlFor="customer_phone" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-yellow-600" />
                رقم الهاتف <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_phone"
                type="tel"
                placeholder="06XXXXXXXX"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className={`h-9 text-sm bg-white border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all ${errors.customer_phone ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.customer_phone && (
                <p className="text-[10px] text-red-500">{errors.customer_phone}</p>
              )}
            </div>

            {/* Address - Compact */}
            <div className="space-y-1.5">
              <Label htmlFor="customer_address" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-yellow-600" />
                العنوان <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="customer_address"
                placeholder="المدينة، الحي..."
                value={formData.customer_address}
                onChange={(e) => handleInputChange('customer_address', e.target.value)}
                className={`text-sm bg-white border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none ${errors.customer_address ? 'border-red-400' : 'border-gray-200'}`}
                rows={2}
              />
              {errors.customer_address && (
                <p className="text-[10px] text-red-500">{errors.customer_address}</p>
              )}
            </div>

            {/* Notes - Compact */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-yellow-600" />
                ملاحظات <span className="text-gray-400 text-[10px] font-normal">(اختياري)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="ملاحظات إضافية..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="text-sm bg-white border-2 border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none"
                rows={2}
              />
            </div>

            {/* Security Badge - Compact */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200/50">
              <p className="text-[10px] text-center text-green-700 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                <span className="font-medium">معلوماتك محمية ومؤمنة</span>
              </p>
            </div>

            <DialogFooter className="gap-2 flex-row justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="flex-1 sm:flex-none h-9 text-sm border-2 hover:bg-gray-50 transition-all"
              >
                إلغاء
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 sm:flex-none min-w-[120px] h-9 text-sm bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    جاري الإرسال...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    تأكيد الطلب
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
