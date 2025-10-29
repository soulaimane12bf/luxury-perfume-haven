import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Shipping = () => {
  const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/shipping';
  const title = 'الشحن والتوصيل | Cosmed Stores';
  const description = 'تفاصيل الشحن، المواعيد، ومناطق التوصيل لمتجر Cosmed Stores.';
  return (
    <>
      <SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }} />
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-6">الشحن والتسليم</h1>
          <p className="text-lg text-foreground/80">صفحة اختبارية لتفاصيل الشحن: مدة التوصيل، مناطق التوصيل، وسياسة الاسترجاع الخاصة بالشحن.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shipping;
