import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Faq = () => {
  const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/faq';
  const title = 'الأسئلة المتكررة | Cosmed Stores';
  const description = 'الأسئلة الشائعة حول الطلبات، الشحن، والدفع في متجر Cosmed Stores.';
  return (
    <>
      <SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }} />
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-6">الأسئلة المتكررة</h1>
          <div className="space-y-4 text-foreground/80">
            <div>
              <h3 className="font-semibold">هل يوجد توصيل دولي؟</h3>
              <p>هذا نص تجريبي — عدّل الإجابات حسب سياسات المتجر.</p>
            </div>
            <div>
              <h3 className="font-semibold">ما هي طرق الدفع المتاحة؟</h3>
              <p>الدفع عند الاستلام، البطاقة البنكية، وخيارات إلكترونية أخرى.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Faq;
