import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <>
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
