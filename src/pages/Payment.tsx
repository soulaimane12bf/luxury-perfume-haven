import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Banknote, CreditCard, Wallet, CheckCircle2, Clock } from 'lucide-react';

const Payment = () => {
  const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/payment';
  const title = 'طرق الدفع | Cosmed Stores';
  const description = 'تعرف على طرق الدفع المتاحة في Cosmed Parfumerie - الدفع عند الاستلام لجميع مدن المغرب';
  
  return (
    <>
      <SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }} />
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-4 shadow-xl">
                  <Wallet className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              طرق الدفع
            </h1>
            <p className="text-gray-600">
              اختر طريقة الدفع التي تناسبك
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Cash on Delivery - Active */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-4">
                  <Banknote className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-amber-800">الدفع عند الاستلام</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      متاح الآن
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    الطريقة الأكثر شيوعاً والأكثر أماناً للدفع في المغرب
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">ادفع نقداً عند استلام طلبك</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">افحص المنتج قبل الدفع</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">متاح لجميع مدن المغرب</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">لا حاجة لبطاقة بنكية أو حساب بنكي</span>
                    </div>
                  </div>

                  <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>كيف يعمل؟</strong> عند وصول المندوب إليك، تفحص المنتجات وتتأكد من مطابقتها لطلبك، ثم تدفع المبلغ الكامل نقداً.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Card - Coming Soon */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 opacity-75">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 rounded-full p-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-600">البطاقة البنكية</h2>
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      قريباً
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    نعمل على توفير الدفع الإلكتروني عبر البطاقة البنكية
                  </p>
                  
                  <div className="space-y-2 opacity-60">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">• الدفع الآمن عبر الإنترنت</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">• قبول جميع البطاقات البنكية المغربية</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">• تأكيد فوري للطلب</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">🔒 الأمان والخصوصية</h3>
              <div className="space-y-2 text-blue-800">
                <p>• جميع معاملاتك محمية ومشفرة</p>
                <p>• لا نحتفظ بأي بيانات بطاقات بنكية</p>
                <p>• معلوماتك الشخصية سرية وآمنة 100٪</p>
                <p>• نستخدم أفضل الممارسات الأمنية في الصناعة</p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-6 shadow-lg border border-amber-200 text-center">
              <h3 className="text-xl font-bold mb-3 text-amber-800">
                لديك سؤال حول طرق الدفع؟
              </h3>
              <p className="text-gray-700 mb-4">
                تواصل معنا على الواتساب ونحن سعداء بمساعدتك
              </p>
              <div className="bg-white rounded-lg p-4 border border-amber-300 inline-block">
                <p className="text-amber-800 font-bold text-lg">
                  📱 واتساب: <span dir="ltr">+212 625 073 838</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
