const Faq = () => {
  return (
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
  );
};

export default Faq;
