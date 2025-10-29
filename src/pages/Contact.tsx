import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Contact = () => {
  const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/contact';
  const title = 'اتصل بنا | Cosmed Stores';
  const description = 'تواصل مع فريق Cosmed Stores لدعم الطلبات والاستفسارات.';
  return (
    <>
      <SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'ContactPage', name: title, description }} />
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-6">اتصل بنا</h1>
          <p className="text-lg text-foreground/80">هذه صفحة الاتصال. يمكنك إضافة نموذج اتصال أو بيانات التواصل هنا. هذه نسخة اختبارية.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
