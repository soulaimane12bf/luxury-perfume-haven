import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react';

const Contact = () => {
  const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/contact';
  const title = 'اتصل بنا | Cosmed Stores';
  const description = 'تواصل مع فريق Cosmed Parfumerie - نحن هنا لمساعدتك في أي استفسار';
  
  const whatsappNumber = '+212625073838';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن...')}`;
  
  return (
    <>
      <SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'ContactPage', name: title, description }} />
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-4 shadow-xl">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              اتصل بنا
            </h1>
            <p className="text-gray-600 text-lg">
              نحن هنا للإجابة على جميع استفساراتك
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                {/* WhatsApp - Primary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border-2 border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500 rounded-full p-3">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-green-900 mb-2">واتساب (الأسرع)</h3>
                      <p className="text-green-800 mb-3">تواصل معنا مباشرة على الواتساب</p>
                      <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        <Send className="h-5 w-5" />
                        أرسل رسالة الآن
                      </a>
                      <p className="text-sm text-green-700 mt-3 font-mono" dir="ltr">
                        +212 625 073 838
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full p-3">
                      <Phone className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-amber-800 mb-2">الهاتف</h3>
                      <p className="text-gray-700 mb-2">للطلبات والاستفسارات</p>
                      <a 
                        href={`tel:${whatsappNumber}`}
                        className="text-amber-700 font-mono text-lg hover:text-amber-900"
                        dir="ltr"
                      >
                        +212 625 073 838
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full p-3">
                      <Mail className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-amber-800 mb-2">البريد الإلكتروني</h3>
                      <p className="text-gray-700 mb-2">للاستفسارات العامة</p>
                      <a 
                        href="mailto:contact@cosmedstores.com"
                        className="text-amber-700 hover:text-amber-900 break-all"
                      >
                        contact@cosmedstores.com
                      </a>
                      <p className="text-sm text-gray-500 mt-2">
                        (سنرد خلال 24 ساعة)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full p-3">
                      <MapPin className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-amber-800 mb-2">موقعنا</h3>
                      <p className="text-gray-700">
                        سوكوما 2، مراكش<br />
                        المغرب
                      </p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full p-3">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-amber-800 mb-2">ساعات العمل</h3>
                      <div className="space-y-1 text-gray-700">
                        <p className="flex items-center gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>واتساب: متاح 24/7</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>الهاتف: 9 صباحاً - 10 مساءً</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Message Form */}
              <div className="bg-white rounded-xl p-8 shadow-xl border border-amber-100">
                <h3 className="text-2xl font-bold text-amber-800 mb-6">أو استخدم الواتساب مباشرة</h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-3">الطرق السريعة للتواصل:</h4>
                    <div className="space-y-3">
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أريد الطلب')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white hover:bg-amber-50 p-4 rounded-lg border border-amber-200 transition-colors"
                      >
                        <p className="font-semibold text-amber-800 mb-1">📦 طلب منتج</p>
                        <p className="text-sm text-gray-600">اطلب منتجاتك مباشرة عبر الواتساب</p>
                      </a>
                      
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أريد تتبع طلبي رقم:')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white hover:bg-amber-50 p-4 rounded-lg border border-amber-200 transition-colors"
                      >
                        <p className="font-semibold text-amber-800 mb-1">📍 تتبع الطلب</p>
                        <p className="text-sm text-gray-600">استفسر عن حالة طلبك</p>
                      </a>
                      
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، لدي سؤال حول المنتجات')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white hover:bg-amber-50 p-4 rounded-lg border border-amber-200 transition-colors"
                      >
                        <p className="font-semibold text-amber-800 mb-1">❓ استفسار عام</p>
                        <p className="text-sm text-gray-600">أي سؤال آخر نحن هنا للمساعدة</p>
                      </a>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-800">
                      💡 <strong>نصيحة:</strong> الواتساب هو أسرع طريقة للحصول على رد فوري من فريقنا!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
