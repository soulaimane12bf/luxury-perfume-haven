import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRight, setIsRight] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth < 768; // tailwind md breakpoint
  });
  const [phone, setPhone] = useState<string | null>(null);

  // Hide the floating WhatsApp bubble on admin pages (any path containing /admin)
  // Use React Router location so we react to SPA navigations without a full
  // page refresh. An early return based on window.location prevents updates
  // when the user navigates within the app, causing the behavior you reported.
  const location = typeof window !== 'undefined' ? useLocation() : { pathname: '' };
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const p = typeof window !== 'undefined' ? window.location.pathname : '';
    return p === '/admin' || p.startsWith('/admin/');
  });

  useEffect(() => {
    const onResize = () => setIsRight(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Update admin-route state when the router location changes.
  useEffect(() => {
    if (!location || !location.pathname) return;
    const p = location.pathname;
    setIsAdminRoute(p === '/admin' || p.startsWith('/admin/'));
  }, [location && location.pathname]);

  const fallbackPhone = '212600000000'; // used if contact endpoint is unavailable
  const message = 'مرحباً، أريد الاستفسار عن منتجاتكم';

  const handleClick = () => {
    const targetPhone = phone || fallbackPhone;
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    // Fetch the public contact phone from the backend. If this fails,
    // we'll continue to use the fallbackPhone so the feature remains usable.
    if (typeof window === 'undefined') return;
    let mounted = true;
    const formatPhoneClient = (raw) => {
      if (!raw) return null;
      let s = String(raw).trim();
      s = s.replace(/[^0-9+]/g, '');
      if (s.startsWith('+')) s = s.slice(1);
      if (s.startsWith('00')) s = s.slice(2);
      if (s.startsWith('212')) return s;
      if (s.startsWith('0')) {
        s = s.slice(1);
        return `212${s}`;
      }
      if (/^[67]/.test(s)) return `212${s}`;
      return s;
    };

    fetch('/api/contact')
      .then((res) => {
        if (!res.ok) throw new Error('no-contact');
        return res.json();
      })
      .then((data) => {
        if (mounted && data && data.phone) {
          const normalized = formatPhoneClient(data.phone);
          setPhone(normalized);
        }
      })
      .catch(() => {
        // ignore; fallback will be used
      });

    return () => {
      mounted = false;
    };
  }, []);

  // If we're on an admin route, render nothing. This uses state derived from
  // the router location so it updates immediately on SPA navigation.
  if (isAdminRoute) return null;

  // container position depends on isRight
  const containerClass = isRight ? 'fixed bottom-6 right-6 z-50' : 'fixed bottom-6 left-6 z-50';
  // popup alignment: when bubble is on the right, popup aligns right (and grows leftwards);
  // when bubble is on the left, popup aligns left (and grows rightwards).
  const popupAlignClass = isRight ? 'right-0' : 'left-0';

  return (
    <div className={containerClass}>
      {isOpen && (
        <div className={`absolute bottom-20 ${popupAlignClass} bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 w-80 mb-2 border border-gold/10 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300`}>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="إغلاق"
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors z-40"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-3 pr-10">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center ring-2 ring-white/40 shadow-md">
              <svg viewBox="0 0 32 32" className="h-7 w-7 text-white fill-current">
                <path d="M16.002 0C7.164 0 0 7.162 0 16c0 2.834.74 5.494 2.036 7.8L.698 31.273l7.688-2.018C10.498 30.74 13.158 32 16.002 32c8.836 0 16-7.164 16-16s-7.164-16-16-16zm8.396 22.876c-.34.956-1.998 1.75-2.906 1.87-.752.096-1.732.136-2.792-.176-.644-.19-1.472-.442-2.532-.866-4.43-1.77-7.312-6.222-7.534-6.508-.22-.286-1.804-2.4-1.804-4.58 0-2.18 1.142-3.254 1.548-3.698.406-.444.888-.556 1.184-.556.296 0 .592.002.852.016.272.014.636-.104.996.76.366.878 1.25 3.054 1.36 3.276.11.222.184.48.036.766-.148.286-.222.464-.442.714-.22.25-.462.558-.66.75-.22.212-.448.442-.192.868.256.426 1.14 1.88 2.448 3.046 1.682 1.498 3.098 1.964 3.54 2.186.442.222.7.186.958-.11.258-.296 1.106-1.292 1.402-1.736.296-.444.592-.37.998-.222.406.148 2.586 1.22 3.028 1.442.442.222.736.332.842.518.106.186.106 1.072-.234 2.028z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-foreground">تواصل معنا</h3>
              <p className="text-xs text-green-600 dark:text-green-400">متواجدون الآن</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 pr-10">هل لديك أي استفسار؟ تواصل معنا عبر واتساب وسنكون سعداء بمساعدتك</p>
          <Button onClick={handleClick} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300">
            📱 إرسال رسالة
          </Button>
        </div>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 p-0 relative group ring-1 ring-white/10"
        size="icon"
        title="تواصل معنا عبر واتساب"
      >
        {isOpen ? (
          <X className="h-8 w-8 text-white" />
        ) : (
          <svg viewBox="0 0 32 32" className="h-8 w-8 text-white fill-current group-hover:scale-110 transition-transform">
            <path d="M16.002 0C7.164 0 0 7.162 0 16c0 2.834.74 5.494 2.036 7.8L.698 31.273l7.688-2.018C10.498 30.74 13.158 32 16.002 32c8.836 0 16-7.164 16-16s-7.164-16-16-16zm8.396 22.876c-.34.956-1.998 1.75-2.906 1.87-.752.096-1.732.136-2.792-.176-.644-.19-1.472-.442-2.532-.866-4.43-1.77-7.312-6.222-7.534-6.508-.22-.286-1.804-2.4-1.804-4.58 0-2.18 1.142-3.254 1.548-3.698.406-.444.888-.556 1.184-.556.296 0 .592.002.852.016.272.014.636-.104.996.76.366.878 1.25 3.054 1.36 3.276.11.222.184.48.036.766-.148.286-.222.464-.442.714-.22.25-.462.558-.66.75-.22.212-.448.442-.192.868.256.426 1.14 1.88 2.448 3.046 1.682 1.498 3.098 1.964 3.54 2.186.442.222.7.186.958-.11.258-.296 1.106-1.292 1.402-1.736.296-.444.592-.37.998-.222.406.148 2.586 1.22 3.028 1.442.442.222.736.332.842.518.106.186.106 1.072-.234 2.028z" />
          </svg>
        )}
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"></span>
      </Button>
    </div>
  );
}
