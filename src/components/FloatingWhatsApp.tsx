import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const adminPhone = '212600000000'; // Replace with actual admin phone
  const message = 'مرحباً، أريد الاستفسار عن منتجاتكم';

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-64 mb-2">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
          <h3 className="font-semibold mb-2 text-foreground">تواصل معنا</h3>
          <p className="text-sm text-muted-foreground mb-3">هل لديك أي استفسار؟ تواصل معنا عبر واتساب</p>
          <Button onClick={handleClick} className="w-full bg-green-500 hover:bg-green-600 text-white">
            إرسال رسالة
          </Button>
        </div>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full shadow-2xl bg-green-500 hover:bg-green-600 transition-all duration-300 hover:scale-110 p-0"
        size="icon"
        title="تواصل معنا عبر واتساب"
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <svg viewBox="0 0 32 32" className="h-7 w-7 text-white fill-current">
            <path d="M16.002 0C7.164 0 0 7.162 0 16c0 2.834.74 5.494 2.036 7.8L.698 31.273l7.688-2.018C10.498 30.74 13.158 32 16.002 32c8.836 0 16-7.164 16-16s-7.164-16-16-16zm8.396 22.876c-.34.956-1.998 1.75-2.906 1.87-.752.096-1.732.136-2.792-.176-.644-.19-1.472-.442-2.532-.866-4.43-1.77-7.312-6.222-7.534-6.508-.22-.286-1.804-2.4-1.804-4.58 0-2.18 1.142-3.254 1.548-3.698.406-.444.888-.556 1.184-.556.296 0 .592.002.852.016.272.014.636-.104.996.76.366.878 1.25 3.054 1.36 3.276.11.222.184.48.036.766-.148.286-.222.464-.442.714-.22.25-.462.558-.66.75-.22.212-.448.442-.192.868.256.426 1.14 1.88 2.448 3.046 1.682 1.498 3.098 1.964 3.54 2.186.442.222.7.186.958-.11.258-.296 1.106-1.292 1.402-1.736.296-.444.592-.37.998-.222.406.148 2.586 1.22 3.028 1.442.442.222.736.332.842.518.106.186.106 1.072-.234 2.028z" />
          </svg>
        )}
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
      </Button>
    </div>
  );
}
