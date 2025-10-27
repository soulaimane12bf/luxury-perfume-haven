import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Payment = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-6">طرق الدفع</h1>
          <p className="text-lg text-foreground/80">محتوى اختبار لطرق الدفع المقبولة: الدفع عند الاستلام، البطاقة البنكية، وتحويل بنكي. استبدل بالمحتوى الحقيقي لاحقاً.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
