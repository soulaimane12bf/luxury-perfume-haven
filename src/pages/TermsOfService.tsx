import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <>
      <SEO
        title="شروط الاستخدام - Cosmed Parfumerie"
        description="تعرف على شروط وأحكام استخدام موقع Cosmed Parfumerie"
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
                    <FileText className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                شروط الاستخدام
              </h1>
              <p className="text-gray-600">
                يرجى قراءة هذه الشروط بعناية قبل استخدام الموقع
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Acceptance */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  قبول الشروط
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  باستخدامك لموقع <strong className="text-amber-700">Cosmed Parfumerie</strong>، فإنك توافق على الالتزام بجميع الشروط والأحكام المذكورة في هذه الصفحة.
                  إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
                </p>
              </div>

              {/* Product Information */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  معلومات المنتجات
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>جميع المنتجات المعروضة على الموقع أصلية 100٪</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>نحتفظ بالحق في تعديل الأسعار دون إشعار مسبق</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>الصور المعروضة قد تختلف قليلاً عن المنتج الفعلي</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>التوفر غير مضمون ويخضع للمخزون المتاح</span>
                  </li>
                </ul>
              </div>

              {/* Orders */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  الطلبات والدفع
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>يتم تأكيد جميع الطلبات عبر الهاتف أو الواتساب</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>الدفع عند الاستلام متاح لجميع مدن المغرب</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>يجب دفع كامل المبلغ عند استلام الطلب</span>
                  </li>
                </ul>
              </div>

              {/* User Responsibilities */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6" />
                  مسؤوليات العميل
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>تقديم معلومات اتصال وعنوان صحيحة ودقيقة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>التواجد في العنوان المحدد وقت التوصيل</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>فحص المنتجات عند الاستلام والتأكد من سلامتها</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>عدم استخدام الموقع لأغراض غير قانونية</span>
                  </li>
                </ul>
              </div>

              {/* Liability */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <XCircle className="h-6 w-6" />
                  إخلاء المسؤولية
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>لا نتحمل مسؤولية التأخير في التوصيل بسبب ظروف خارجة عن إرادتنا</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>نحن غير مسؤولين عن سوء الاستخدام أو الاستعمال غير الصحيح للمنتجات</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>لا نضمن توفر المنتجات بشكل دائم</span>
                  </li>
                </ul>
              </div>

              {/* Changes */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-6 shadow-lg border border-amber-200">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  التعديلات على الشروط
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة.
                  استمرارك في استخدام الموقع بعد التعديلات يعني موافقتك على الشروط الجديدة.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  للاستفسارات، تواصل معنا عبر الواتساب: <strong className="text-amber-700" dir="ltr">+212 625 073 838</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
