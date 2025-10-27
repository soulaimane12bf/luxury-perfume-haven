import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Refunds = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-6">سياسة الاستبدال</h1>
          <p className="text-lg text-foreground/80">نص تجريبي لسياسة الاستبدال والاسترجاع. عدّل هذه الصفحة لتتناسب مع سياسات المتجر.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Refunds;
