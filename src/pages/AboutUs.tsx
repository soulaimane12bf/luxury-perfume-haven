import { Store, Heart, Shield, Sparkles, MapPin, Package, Award } from 'lucide-react';
import SEO from '@/components/SEO';

export default function AboutUs() {
  return (
    <>
      <SEO
        title="من نحن - Cosmed Parfumerie"
        description="تعرف على Cosmed Parfumerie، متجرك الموثوق للعطور ومستحضرات التجميل الأصلية في المغرب"
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
                    <Store className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                من نحن
              </h1>
              <p className="text-xl text-gray-600">
                Cosmed Parfumerie
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Story Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  قصتنا
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نحن <strong className="text-amber-700">Cosmed Parfumerie</strong>، متجر مغربي متخصص في العطور، مستحضرات التجميل والعناية بالبشرة.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  نقدم منتجات أصلية <strong className="text-amber-700">100٪</strong> مع خدمة توصيل إلى جميع مدن المغرب والدفع عند الاستلام.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  مقرنا الرئيسي في <strong className="text-amber-700">سوكوما 2، مراكش</strong>، ونخدم عملاءنا في جميع أنحاء المملكة المغربية.
                </p>
              </div>

              {/* Mission Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <Heart className="h-6 w-6" />
                  رؤيتنا ورسالتنا
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  رؤيتنا هي <strong className="text-amber-700">جعل الجمال في متناول الجميع</strong> بثقة وجودة عالية.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  نسعى لتقديم تجربة تسوق سهلة وآمنة، مع التزامنا بتوفير منتجات أصلية فقط من أفضل العلامات التجارية العالمية والمحلية.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-amber-100 rounded-full p-4">
                      <Shield className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-amber-800">منتجات أصلية 100٪</h3>
                  <p className="text-gray-600 text-sm">
                    جميع منتجاتنا أصلية ومضمونة من موردين معتمدين
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-amber-100 rounded-full p-4">
                      <Package className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-amber-800">توصيل سريع</h3>
                  <p className="text-gray-600 text-sm">
                    نوصل إلى جميع مدن المغرب خلال 1-3 أيام
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-100 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-amber-100 rounded-full p-4">
                      <Award className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-amber-800">خدمة عملاء ممتازة</h3>
                  <p className="text-gray-600 text-sm">
                    فريقنا متاح 24/7 للإجابة على استفساراتكم
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-8 shadow-lg border border-amber-200">
                <h2 className="text-2xl font-bold mb-4 text-amber-800 flex items-center gap-3">
                  <MapPin className="h-6 w-6" />
                  موقعنا
                </h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  📍 <strong>العنوان:</strong> سوكوما 2، مراكش، المغرب
                </p>
                <p className="text-gray-700 leading-relaxed mb-2">
                  📱 <strong>الهاتف/واتساب:</strong> +212 625 073 838
                </p>
                <p className="text-gray-700 leading-relaxed">
                  🕒 <strong>ساعات العمل:</strong> متاحون على الواتساب 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
