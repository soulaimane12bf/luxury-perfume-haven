import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-6">شروط الاستخدام</h1>
          <p className="text-lg text-foreground/80">نص تجريبي لشروط الاستخدام. استبدل هذا النص بنص الشروط الفعلية للموقع.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
