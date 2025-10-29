import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Privacy = () => {
  const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/privacy';
  const title = 'سياسة الخصوصية | Cosmed Stores';
  const description = 'سياسة الخصوصية لCosmed Stores وتوضيح كيفية التعامل مع البيانات.';
  return (
    <>
      <SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }} />
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-6">سياسة الخصوصية</h1>
          <p className="text-lg text-foreground/80">نص تجريبي لشرح كيفية تعامل المتجر مع بيانات المستخدم وخصوصيتهم. استبدل بمحتوى فعلي عند التوفر.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
