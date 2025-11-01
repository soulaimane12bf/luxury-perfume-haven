import { Truck, Package, MapPin, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/SEO';

export default function ShippingPolicy() {
  return (
    <>
      <SEO
        title="سياسة التوصيل والشحن - Cosmed Parfumerie"
        description="معلومات عن التوصيل والشحن لجميع مدن المغرب"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-4 shadow-xl">
                    <Truck className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                التوصيل والشحن
              </h1>
              <p className="text-gray-600">
                نوصل إلى جميع مدن المغرب بسرعة وأمان
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Coverage */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <MapPin className="h-6 w-6" />
                  منطقة التغطية
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نقوم بالتوصيل إلى <strong className="text-amber-700">جميع المدن المغربية</strong> من طنجة إلى الداخلة.
                </p>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-amber-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    الدفع عند الاستلام متاح في كل المدن
                  </p>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <Clock className="h-6 w-6" />
                  مدة التوصيل
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <span className="text-green-600 font-bold text-lg">1-2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">المدن الكبرى</p>
                      <p className="text-sm text-gray-600">الدار البيضاء، الرباط، مراكش، فاس، طنجة</p>
                      <p className="text-sm text-green-600 font-semibold">1-2 يوم عمل</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full p-3">
                      <span className="text-amber-600 font-bold text-lg">2-3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">باقي المدن</p>
                      <p className="text-sm text-gray-600">جميع المدن الأخرى في المغرب</p>
                      <p className="text-sm text-amber-600 font-semibold">2-3 أيام عمل</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 <strong>ملاحظة:</strong> المدة تبدأ من تاريخ تأكيد الطلب عبر الواتساب
                  </p>
                </div>
              </div>

              {/* Process */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <Package className="h-6 w-6" />
                  كيف تتم عملية التوصيل؟
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">ضع طلبك</p>
                      <p className="text-sm text-gray-600">عبر الموقع أو مباشرة على الواتساب</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">التأكيد</p>
                      <p className="text-sm text-gray-600">سنتواصل معك لتأكيد الطلب والعنوان</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">التحضير والشحن</p>
                      <p className="text-sm text-gray-600">نحضر طلبك ونرسله عبر شركة شحن موثوقة</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">الاستلام والدفع</p>
                      <p className="text-sm text-gray-600">تستلم طلبك وتدفع المبلغ نقداً للمندوب</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Costs */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <DollarSign className="h-6 w-6" />
                  تكاليف الشحن
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  تختلف تكاليف الشحن حسب المدينة ووزن الطلب:
                </p>
                <div className="space-y-3">
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="font-semibold text-amber-800 mb-1">📦 الطلبات الصغيرة (1-2 منتجات)</p>
                    <p className="text-sm text-gray-600">تكلفة التوصيل: 25-35 درهم حسب المدينة</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="font-semibold text-amber-800 mb-1">📦 الطلبات المتوسطة (3-5 منتجات)</p>
                    <p className="text-sm text-gray-600">تكلفة التوصيل: 30-40 درهم حسب المدينة</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="font-semibold text-green-800 mb-1">🎁 الطلبات الكبيرة (+500 درهم)</p>
                    <p className="text-sm text-green-600">توصيل مجاني أو مخفض (حسب العرض الجاري)</p>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  سيتم إخبارك بتكلفة الشحن الدقيقة عند تأكيد الطلب
                </div>
              </div>

              {/* Tracking */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  تتبع الطلب
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  يمكنك تتبع حالة طلبك بسهولة:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>تواصل معنا على الواتساب بذكر رقم طلبك</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>سنزودك بمعلومات حالة الشحن والوقت المتوقع للوصول</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>في بعض الحالات، سنرسل لك رقم التتبع من شركة الشحن</span>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-6 shadow-lg border border-amber-200">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  هل لديك استفسار؟
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  فريقنا متاح على الواتساب <strong className="text-amber-700">24/7</strong> للإجابة على جميع أسئلتك حول التوصيل والشحن.
                </p>
                <div className="bg-white rounded-lg p-4 border border-amber-300 text-center">
                  <p className="text-amber-800 font-bold text-lg">
                    📱 واتساب: <span dir="ltr">+212 625 073 838</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    متاحون 24 ساعة، 7 أيام في الأسبوع
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
