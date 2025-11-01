import { RotateCcw, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/SEO';

export default function ReturnPolicy() {
  return (
    <>
      <SEO
        title="سياسة الإرجاع - Cosmed Parfumerie"
        description="تعرف على سياسة الإرجاع والاستبدال في Cosmed Parfumerie"
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
                    <RotateCcw className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                سياسة الإرجاع والاستبدال
              </h1>
              <p className="text-gray-600">
                رضاك عن مشترياتك هو أولويتنا
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Return Period */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <Clock className="h-6 w-6" />
                  مدة الإرجاع
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  يمكن إرجاع أو استبدال المنتجات خلال <strong className="text-amber-700">7 أيام</strong> من تاريخ الاستلام.
                </p>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>
                      يجب تقديم طلب الإرجاع خلال المدة المحددة، وإلا سيتم رفض الطلب
                    </span>
                  </p>
                </div>
              </div>

              {/* Return Conditions */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6" />
                  شروط الإرجاع
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  لقبول طلب الإرجاع، يجب أن تكون المنتجات:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span><strong>غير مفتوحة:</strong> المنتج في عبوته الأصلية المغلقة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span><strong>غير مستخدمة:</strong> لم يتم استعمالها أو تجربتها</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span><strong>بحالة جيدة:</strong> المنتج والتغليف في حالة ممتازة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span><strong>مع الفاتورة:</strong> إرفاق إيصال الشراء أو رقم الطلب</span>
                  </li>
                </ul>
              </div>

              {/* Non-Returnable */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6" />
                  المنتجات غير القابلة للإرجاع
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  لا يمكن إرجاع المنتجات التالية لأسباب صحية وقانونية:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>المنتجات المفتوحة أو المستخدمة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>العطور التي تم فتح غلافها البلاستيكي</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>مستحضرات العناية بالبشرة المفتوحة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>المنتجات المخفضة أو في التصفيات (إلا في حالة العيب)</span>
                  </li>
                </ul>
              </div>

              {/* Defective Products */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  المنتجات المعيبة
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  في حالة استلام منتج معيب أو تالف أو خطأ في الطلب:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>تواصل معنا فوراً عبر الواتساب: <strong>+212 625 073 838</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>التقط صوراً واضحة للمنتج والعيب</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>سنقوم باستبدال المنتج أو استرجاع المبلغ كاملاً</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span><strong>نتحمل نحن</strong> تكاليف الشحن في هذه الحالة</span>
                  </li>
                </ul>
              </div>

              {/* Shipping Costs */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  تكاليف الشحن
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 rounded-full p-2">
                      <span className="text-red-600 font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">إرجاع عادي (تغيير رأي)</p>
                      <p className="text-sm">يتحمل العميل تكاليف الشحن</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">منتج معيب أو خطأ في الطلب</p>
                      <p className="text-sm">نتحمل نحن جميع التكاليف</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Process */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-6 shadow-lg border border-amber-200">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  إجراءات الاسترجاع
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <p>تواصل معنا عبر الواتساب وأخبرنا برغبتك في الإرجاع</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <p>سنراجع طلبك ونؤكد أهليته للإرجاع</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <p>أرسل المنتج إلينا أو سنقوم باستلامه منك</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <p>بعد الفحص، سنقوم بالاستبدال أو الاسترجاع خلال 3-5 أيام</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4 border border-amber-300">
                  <p className="text-amber-800 font-semibold text-center">
                    للاستفسارات: واتساب +212 625 073 838
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
