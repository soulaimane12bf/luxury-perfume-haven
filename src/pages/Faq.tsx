import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/faq';
  const title = 'الأسئلة الشائعة | Cosmed Stores';
  const description = 'إجابات على الأسئلة الأكثر شيوعاً حول الطلب والتوصيل والمنتجات في Cosmed Parfumerie';

  const faqs = [
    {
      category: 'الطلبات والشراء',
      questions: [
        {
          q: 'كيف أقوم بالطلب؟',
          a: 'يمكنك الطلب بطريقتين: 1) أضف المنتجات إلى السلة واملأ نموذج الطلب على الموقع. 2) تواصل معنا مباشرة عبر الواتساب (+212 625 073 838) وأخبرنا بالمنتجات التي تريدها.'
        },
        {
          q: 'هل يمكنني تعديل أو إلغاء طلبي؟',
          a: 'نعم، يمكنك تعديل أو إلغاء الطلب قبل شحنه. تواصل معنا فوراً عبر الواتساب لإجراء التعديلات.'
        },
        {
          q: 'كم من الوقت يستغرق تأكيد الطلب؟',
          a: 'عادةً نقوم بالتواصل معك لتأكيد الطلب خلال ساعات قليلة من وضع الطلب، خلال أوقات العمل.'
        }
      ]
    },
    {
      category: 'الدفع',
      questions: [
        {
          q: 'ما هي طرق الدفع المتاحة؟',
          a: 'حالياً نقبل الدفع عند الاستلام (Cash on Delivery) لجميع مدن المغرب. تدفع المبلغ نقداً للمندوب عند استلام طلبك.'
        },
        {
          q: 'هل يمكنني الدفع بالبطاقة البنكية؟',
          a: 'نعمل على توفير خدمة الدفع الإلكتروني قريباً. حالياً الدفع متاح فقط عند الاستلام.'
        },
        {
          q: 'هل تقبلون الشيكات البنكية؟',
          a: 'لا، نقبل فقط الدفع النقدي عند الاستلام حالياً.'
        }
      ]
    },
    {
      category: 'التوصيل',
      questions: [
        {
          q: 'كم تستغرق مدة التوصيل؟',
          a: 'المدن الكبرى (الدار البيضاء، الرباط، مراكش، فاس، طنجة): 1-2 يوم عمل. باقي المدن: 2-3 أيام عمل.'
        },
        {
          q: 'كم تكلفة التوصيل؟',
          a: 'تتراوح بين 25-40 درهم حسب المدينة ووزن الطلب. للطلبات الكبيرة (+500 درهم) قد يكون التوصيل مجانياً أو مخفضاً.'
        },
        {
          q: 'هل توصلون إلى مدينتي؟',
          a: 'نعم! نوصل إلى جميع مدن المغرب من طنجة إلى الداخلة.'
        },
        {
          q: 'كيف أتتبع طلبي؟',
          a: 'تواصل معنا على الواتساب (+212 625 073 838) واذكر رقم طلبك، وسنزودك بمعلومات حالة الشحن.'
        }
      ]
    },
    {
      category: 'المنتجات',
      questions: [
        {
          q: 'هل المنتجات أصلية؟',
          a: 'نعم، جميع منتجاتنا أصلية 100٪ ومضمونة. نستورد من موردين معتمدين فقط ونضمن لك الجودة.'
        },
        {
          q: 'كيف أتأكد من أصالة المنتج؟',
          a: 'جميع منتجاتنا تأتي في عبوتها الأصلية المغلقة مع ختم الأصالة. يمكنك فحص المنتج عند الاستلام.'
        },
        {
          q: 'هل لديكم عينات مجانية؟',
          a: 'نقدم عينات مع بعض الطلبات الكبيرة كهدية. للاستفسار عن عينة معينة، تواصل معنا.'
        },
        {
          q: 'ماذا لو نفذ المنتج من المخزون؟',
          a: 'سنخبرك فوراً عند تأكيد الطلب. يمكنك الانتظار حتى يتوفر أو اختيار بديل مشابه.'
        }
      ]
    },
    {
      category: 'الإرجاع والاستبدال',
      questions: [
        {
          q: 'ما هي سياسة الإرجاع؟',
          a: 'يمكن إرجاع المنتجات غير المفتوحة خلال 7 أيام من الاستلام. المنتجات المعيبة يمكن إرجاعها في أي وقت.'
        },
        {
          q: 'من يتحمل تكاليف إرجاع المنتج؟',
          a: 'إذا كان المنتج معيباً أو خطأ في الطلب، نتحمل نحن التكاليف. إذا كان بسبب تغيير رأيك، تتحمل أنت تكاليف الإرجاع.'
        },
        {
          q: 'هل يمكن استبدال منتج بآخر؟',
          a: 'نعم، يمكنك استبدال المنتج بآخر بنفس القيمة أو أكثر (مع دفع الفرق) خلال 7 أيام.'
        },
        {
          q: 'متى أستلم المبلغ المسترجع؟',
          a: 'بعد استلام المنتج المرتجع والتحقق من حالته، سيتم إرجاع المبلغ خلال 3-5 أيام عمل.'
        }
      ]
    },
    {
      category: 'الحساب والخصوصية',
      questions: [
        {
          q: 'هل أحتاج إلى إنشاء حساب للطلب؟',
          a: 'لا، يمكنك الطلب كضيف عبر نموذج الطلب أو مباشرة عبر الواتساب دون الحاجة لحساب.'
        },
        {
          q: 'هل بياناتي آمنة؟',
          a: 'نعم، نحن ملتزمون بحماية بياناتك الشخصية ولا نشاركها مع أي طرف ثالث. تُستخدم معلوماتك فقط لتوصيل طلبك.'
        },
        {
          q: 'هل تحتفظون برقم بطاقتي البنكية؟',
          a: 'لا، حالياً نقبل فقط الدفع عند الاستلام، ولا نطلب أو نحتفظ ببيانات بطاقات بنكية.'
        }
      ]
    }
  ];

  return (
    <>
      <SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.flatMap(cat => cat.questions.map(q => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } }))) }} />
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-4 shadow-xl">
                  <HelpCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              الأسئلة الشائعة
            </h1>
            <p className="text-gray-600">
              إجابات على الأسئلة الأكثر شيوعاً
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((category, catIndex) => (
              <div key={catIndex} className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-2xl font-bold mb-6 text-amber-800">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const index = catIndex * 100 + faqIndex;
                    const isOpen = openIndex === index;
                    
                    return (
                      <div 
                        key={faqIndex}
                        className="border border-amber-100 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          className="w-full flex items-center justify-between p-4 text-right hover:bg-amber-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-800 pr-4">
                            {faq.q}
                          </span>
                          <ChevronDown 
                            className={`h-5 w-5 text-amber-600 flex-shrink-0 transition-transform ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 bg-amber-50 border-t border-amber-100">
                            <p className="text-gray-700 leading-relaxed pt-4">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-8 shadow-lg border border-amber-200 text-center">
            <h2 className="text-2xl font-bold mb-4 text-amber-800">
              لم تجد إجابة لسؤالك؟
            </h2>
            <p className="text-gray-700 mb-6">
              فريقنا متاح على الواتساب 24/7 للإجابة على جميع استفساراتك
            </p>
            <div className="bg-white rounded-lg p-4 border border-amber-300 inline-block">
              <p className="text-amber-800 font-bold text-lg">
                📱 واتساب: +212 625 073 838
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Faq;
