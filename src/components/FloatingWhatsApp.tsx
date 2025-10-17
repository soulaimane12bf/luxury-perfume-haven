import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingWhatsApp() {
  const adminPhone = '212600000000'; // Replace with actual admin phone
  const message = 'مرحباً، أريد الاستفسار عن منتجاتكم';

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-2xl bg-green-500 hover:bg-green-600 transition-all duration-300 hover:scale-110 animate-bounce-slow"
      size="icon"
      title="تواصل معنا عبر واتساب"
    >
      <MessageCircle className="h-7 w-7 text-white" />
      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
    </Button>
  );
}
