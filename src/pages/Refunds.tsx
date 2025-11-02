import { RotateCcw, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Refunds() {
  return (
    <>
      <SEO
        title="سياسة الإرجاع والاستبدال - Cosmed Parfumerie"
        description="تعرف على سياسة الإرجاع والاستبدال في Cosmed Parfumerie - إرجاع المنتجات خلال 7 أيام"
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-28 md:pt-32 py-12">
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
                نحن ملتزمون برضاك التام عن منتجاتنا وخدماتنا
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
                  يمكنك إرجاع أو استبدال المنتجات خلال <strong className="text-amber-700">7 أيام</strong> من تاريخ الاستلام،
                  بشرط أن تكون المنتجات في حالتها الأصلية.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-amber-800 font-medium flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>يبدأ احتساب المدة من تاريخ استلامك للمنتج، وليس من تاريخ الطلب</span>
                  </p>
                </div>
              </div>

              {/* Return Conditions */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  شروط الإرجاع والاستبدال
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  لضمان قبول طلب الإرجاع أو الاستبدال، يجب توفر الشروط التالية:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>المنتج لم يتم فتحه أو استخدامه</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>العبوة الأصلية سليمة ولم تتضرر</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>الغلاف البلاستيكي (السيلوفان) لم يُنزع</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>جميع الملحقات والهدايا المرفقة موجودة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>تقديم فاتورة الشراء أو إثبات الطلب</span>
                  </li>
                </ul>
              </div>

              {/* Non-Returnable Items */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <XCircle className="h-6 w-6" />
                  المنتجات غير القابلة للإرجاع
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نظرًا لطبيعة منتجات العطور ومستحضرات التجميل، لا يمكن إرجاع المنتجات في الحالات التالية:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>المنتجات المفتوحة أو المستخدمة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>المنتجات التي تم نزع الغلاف الواقي عنها</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>المنتجات المخصصة أو الطلبات الخاصة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>المنتجات المتضررة بسبب سوء الاستخدام</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>المنتجات المشتراة من عروض التخفيضات (يُستثنى منها العيوب المصنعية)</span>
                  </li>
                </ul>
              </div>

              {/* Shipping Costs */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <Package className="h-6 w-6" />
                  تكاليف الشحن
                </h2>
                <div className="space-y-4">
                  <div className="border-r-4 border-amber-500 pr-4">
                    <h3 className="font-bold text-gray-800 mb-2">إرجاع عادي (تغيير رأي)</h3>
                    <p className="text-gray-700">
                      يتحمل العميل تكاليف شحن الإرجاع في حالة تغيير الرأي أو عدم الرغبة في المنتج
                    </p>
                  </div>
                  <div className="border-r-4 border-green-500 pr-4">
                    <h3 className="font-bold text-gray-800 mb-2">إرجاع بسبب عيب أو خطأ</h3>
                    <p className="text-gray-700">
                      نتحمل نحن تكاليف الشحن بالكامل في حالة وجود عيب في المنتج أو خطأ في الطلب من طرفنا
                    </p>
                  </div>
                </div>
              </div>

              {/* Return Process */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  كيفية طلب الإرجاع أو الاستبدال
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-800 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">تواصل معنا</h3>
                      <p className="text-gray-700">اتصل بنا عبر الواتساب أو الهاتف خلال مدة الـ 7 أيام</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-800 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">قدم المعلومات</h3>
                      <p className="text-gray-700">قدم رقم الطلب وسبب الإرجاع وصور للمنتج</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-800 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">احصل على الموافقة</h3>
                      <p className="text-gray-700">سنراجع طلبك ونعلمك بقبوله خلال 24 ساعة</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-800 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">أرسل المنتج</h3>
                      <p className="text-gray-700">أعد تغليف المنتج بعناية وأرسله إلى العنوان المحدد</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-800 font-bold">5</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">استلم الاسترداد</h3>
                      <p className="text-gray-700">بعد فحص المنتج، سنقوم باسترداد المبلغ أو إرسال البديل خلال 3-5 أيام عمل</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Defective Products */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 shadow-lg border border-red-200">
                <h2 className="text-2xl font-bold mb-4 text-red-800">
                  المنتجات المعيبة أو التالفة
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  إذا استلمت منتجًا معيبًا أو تالفًا:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>تواصل معنا فورًا (يفضل خلال 48 ساعة من الاستلام)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>قدم صورًا واضحة للعيب أو التلف</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>سنقوم بالاستبدال الفوري أو الاسترداد الكامل دون أي تكاليف إضافية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>نتحمل جميع تكاليف الشحن في هذه الحالة</span>
                  </li>
                </ul>
              </div>

              {/* Refund Method */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  طريقة الاسترداد
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  سيتم استرداد المبلغ بنفس طريقة الدفع الأصلية:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span><strong>الدفع عند الاستلام:</strong> استرداد نقدي أو تحويل بنكي</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span><strong>الدفع الإلكتروني:</strong> استرداد إلى نفس البطاقة/الحساب</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span><strong>مدة الاسترداد:</strong> من 3 إلى 7 أيام عمل بعد استلام المنتج المرتجع</span>
                  </li>
                </ul>
              </div>

              {/* Exchange Policy */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-6 shadow-lg border border-amber-200">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  سياسة الاستبدال
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  يمكنك استبدال المنتج بمنتج آخر بنفس القيمة أو أعلى (مع دفع الفرق):
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>تنطبق نفس شروط الإرجاع على الاستبدال</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>إذا كان المنتج البديل أقل سعرًا، سنسترد الفرق</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>الاستبدال مجاني (بدون تكاليف شحن إضافية) مرة واحدة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>نرسل المنتج البديل بعد استلام المنتج المرتجع وفحصه</span>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 shadow-lg text-white">
                <h2 className="text-2xl font-bold mb-4">
                  هل لديك استفسار؟
                </h2>
                <p className="mb-4">
                  فريق خدمة العملاء لدينا جاهز لمساعدتك في أي وقت
                </p>
                <div className="space-y-2">
                  <p>📱 <strong>واتساب:</strong> متاح 24/7</p>
                  <p>📞 <strong>الهاتف:</strong> من السبت إلى الخميس (9 صباحًا - 6 مساءً)</p>
                  <p>⏰ <strong>وقت الاستجابة:</strong> خلال 24 ساعة كحد أقصى</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
