import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const About = () => {
  const canonical = (typeof window !== 'undefined') ? window.location.href : 'https://www.cosmedstores.com/about';
  const title = 'عن المتجر | Cosmed Stores';
  const description = 'تعرف على Cosmed Stores، مهمتنا وقيمنا في تقديم أفضل العطور الفاخرة.';
  return (
    <>
      <SEO title={title} description={description} canonical={canonical} jsonLd={{ '@context': 'https://schema.org', '@type': 'AboutPage', name: title, description }} />
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-6">عن المتجر</h1>
          <p className="text-lg text-foreground/80">هذه صفحة اختبارية بمحتوى افتراضي يشرح المتجر، رؤيته، وقيمه. يمكنك تعديل هذا المحتوى من لوحة الإدارة أو استبداله لاحقاً.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
