import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <>
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
