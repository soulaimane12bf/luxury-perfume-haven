import { Shield, Lock, Eye, UserCheck } from 'lucide-react';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="سياسة الخصوصية - Cosmed Parfumerie"
        description="تعرف على كيفية حماية بياناتك الشخصية في Cosmed Parfumerie"
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
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                سياسة الخصوصية
              </h1>
              <p className="text-gray-600">
                نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Commitment */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <Lock className="h-6 w-6" />
                  التزامنا
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  نلتزم في <strong className="text-amber-700">Cosmed Parfumerie</strong> بحماية بيانات عملائنا وعدم مشاركتها مع أي طرف ثالث.
                  خصوصيتك وأمان معلوماتك هي أولويتنا القصوى.
                </p>
              </div>

              {/* Data Collection */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <Eye className="h-6 w-6" />
                  ما هي البيانات التي نجمعها؟
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span><strong>الاسم الكامل:</strong> لتوجيه الطلب إليك بشكل صحيح</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span><strong>رقم الهاتف:</strong> للتواصل معك لتأكيد الطلب والتوصيل</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span><strong>العنوان:</strong> لتوصيل طلبك إلى موقعك</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span><strong>تفاصيل الطلب:</strong> المنتجات والكميات المطلوبة</span>
                  </li>
                </ul>
              </div>

              {/* Data Usage */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <UserCheck className="h-6 w-6" />
                  كيف نستخدم بياناتك؟
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  تُستخدم معلومات الاتصال <strong className="text-amber-700">فقط</strong> للأغراض التالية:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    <span>تأكيد الطلبات عبر الهاتف أو الواتساب</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    <span>ترتيب وتنسيق عملية التوصيل</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    <span>متابعة حالة الطلب وحل أي مشاكل</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    <span>إرسال عروض خاصة (فقط إذا وافقت على ذلك)</span>
                  </li>
                </ul>
              </div>

              {/* Data Protection */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  حماية البيانات
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">🔒</span>
                    <span>لا نحتفظ ببيانات الدفع بعد إتمام الطلب</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">🔒</span>
                    <span>لا نشارك معلوماتك مع أي طرف ثالث أو شركات إعلانية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">🔒</span>
                    <span>جميع البيانات محمية بتقنيات تشفير حديثة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">🔒</span>
                    <span>فقط الموظفون المصرح لهم يمكنهم الوصول إلى معلوماتك</span>
                  </li>
                </ul>
              </div>

              {/* Your Rights */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-6 shadow-lg border border-amber-200">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">
                  حقوقك
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  يمكنك في أي وقت:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>طلب الاطلاع على بياناتك الشخصية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>طلب تحديث أو تصحيح معلوماتك</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>طلب حذف بياناتك من نظامنا</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>إلغاء الاشتراك في الرسائل التسويقية</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  للاستفسارات حول خصوصيتك، تواصل معنا عبر الواتساب: <strong className="text-amber-700" dir="ltr">+212 625 073 838</strong>
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
