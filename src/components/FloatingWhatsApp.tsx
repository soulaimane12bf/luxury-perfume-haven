import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const [phone, setPhone] = useState<string | null>(null);
  const [offsetBottom, setOffsetBottom] = useState<number>(0);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const location = useLocation();
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const p = (location && location.pathname) || (typeof window !== 'undefined' ? window.location.pathname : '');
    // Hide on admin routes and login route
    return p === '/admin' || p.startsWith('/admin/') || p === '/login' || p.startsWith('/login');
  });

  useEffect(() => {
    const checkPagination = () => {
      try {
        const selectors = ['nav[aria-label="pagination"]', '.pagination', '[data-pagination]'];
        const nodes = document.querySelectorAll(selectors.join(','));

        let found: Element | null = null;
        for (const n of Array.from(nodes)) {
          const el = n as Element;
          if (!(el instanceof HTMLElement)) continue;
          if (el.offsetParent === null) continue;
          const r = el.getBoundingClientRect();
          if (r.height <= 0) continue;
          found = el;
          break;
        }

        if (!found) {
          setOffsetBottom(0);
          return;
        }

        const rect = (found as HTMLElement).getBoundingClientRect();
        const gap = 12;
        if (rect.bottom > window.innerHeight - 80) {
          setOffsetBottom(Math.ceil(rect.height + gap));
        } else {
          setOffsetBottom(0);
        }
      } catch (e) {
        setOffsetBottom(0);
      }
    };

    window.addEventListener('resize', checkPagination);
    window.addEventListener('scroll', checkPagination, { passive: true });
    checkPagination();

    return () => {
      window.removeEventListener('resize', checkPagination);
      window.removeEventListener('scroll', checkPagination as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const el = document.createElement('div');
    el.setAttribute('data-floating-whatsapp-portal', 'true');
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      try {
        if (el.parentNode) el.parentNode.removeChild(el);
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  useEffect(() => {
    const pathname = location?.pathname;
    if (!pathname) return;
    setIsAdminRoute(pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/login' || pathname.startsWith('/login'));
  }, [location?.pathname]);

  const fallbackPhone = '212600000000';
  const message = 'مرحباً، أريد الاستفسار عن منتجاتكم';

  const handleClick = () => {
    const targetPhone = phone || fallbackPhone;
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
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

  if (isAdminRoute) return null;

  const popupAlignClass = isMobile ? 'left-0 -translate-x-0' : 'left-20';
  const baseBottom = 24;

  const inner = (
    <div style={{ position: 'fixed', left: 24, bottom: `${baseBottom + offsetBottom}px`, zIndex: 120 }}>
      {/* Luxury Popup Card */}
      {isOpen && (
        <div className={`absolute bottom-24 ${popupAlignClass} w-80 mb-2 animate-in slide-in-from-bottom-4 duration-300`}>
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
          
          {/* Main card */}
          <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-green-500/30 overflow-hidden">
            {/* Gold accent bar */}
            <div className="h-1 bg-gradient-to-r from-yellow-600 via-green-400 to-emerald-500"></div>
            
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق"
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 z-40 hover:rotate-90 hover:scale-110 bg-white/5 rounded-full p-1.5 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header with avatar and status */}
              <div className="flex items-start gap-4 mb-5 pr-8">
                <div className="relative">
                  {/* Avatar with glow */}
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center ring-2 ring-green-400/30 shadow-lg shadow-green-500/50">
                    <svg viewBox="0 0 32 32" className="h-8 w-8 text-white fill-current">
                      <path d="M16.002 0C7.164 0 0 7.162 0 16c0 2.834.74 5.494 2.036 7.8L.698 31.273l7.688-2.018C10.498 30.74 13.158 32 16.002 32c8.836 0 16-7.164 16-16s-7.164-16-16-16zm8.396 22.876c-.34.956-1.998 1.75-2.906 1.87-.752.096-1.732.136-2.792-.176-.644-.19-1.472-.442-2.532-.866-4.43-1.77-7.312-6.222-7.534-6.508-.22-.286-1.804-2.4-1.804-4.58 0-2.18 1.142-3.254 1.548-3.698.406-.444.888-.556 1.184-.556.296 0 .592.002.852.016.272.014.636-.104.996.76.366.878 1.25 3.054 1.36 3.276.11.222.184.48.036.766-.148.286-.222.464-.442.714-.22.25-.462.558-.66.75-.22.212-.448.442-.192.868.256.426 1.14 1.88 2.448 3.046 1.682 1.498 3.098 1.964 3.54 2.186.442.222.7.186.958-.11.258-.296 1.106-1.292 1.402-1.736.296-.444.592-.37.998-.222.406.148 2.586 1.22 3.028 1.442.442.222.736.332.842.518.106.186.106 1.072-.234 2.028z" />
                    </svg>
                  </div>
                  {/* Online indicator with pulse */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    متجر كوزميد
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </h3>
                  <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    متواجدون الآن
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent mb-4"></div>

              {/* Message */}
              <div className="mb-5 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-4 border border-white/10">
                <p className="text-sm text-gray-300 leading-relaxed text-center">
                  هل لديك أي استفسار؟ تواصل معنا عبر واتساب
                  <br />
                  <span className="text-yellow-400 font-medium">وسنكون سعداء بمساعدتك</span>
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleClick} 
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-[1.02] rounded-xl group relative overflow-hidden"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <span className="relative flex items-center justify-center gap-2">
                  <Send className="h-5 w-5" />
                  إرسال رسالة الآن
                </span>
              </Button>

              {/* Footer badge */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 محادثة مشفرة ومؤمنة
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
        
        {/* Button with premium styling */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-700 transition-all duration-300 hover:scale-110 p-0 group ring-2 ring-green-400/50 hover:ring-green-300/70"
          size="icon"
          title="تواصل معنا عبر واتساب"
        >
          {/* Button content */}
          <div className="relative z-10">
            {isOpen ? (
              <X className="h-8 w-8 text-white group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <svg viewBox="0 0 32 32" className="h-8 w-8 text-white fill-current group-hover:scale-110 transition-transform duration-300">
                <path d="M16.002 0C7.164 0 0 7.162 0 16c0 2.834.74 5.494 2.036 7.8L.698 31.273l7.688-2.018C10.498 30.74 13.158 32 16.002 32c8.836 0 16-7.164 16-16s-7.164-16-16-16zm8.396 22.876c-.34.956-1.998 1.75-2.906 1.87-.752.096-1.732.136-2.792-.176-.644-.19-1.472-.442-2.532-.866-4.43-1.77-7.312-6.222-7.534-6.508-.22-.286-1.804-2.4-1.804-4.58 0-2.18 1.142-3.254 1.548-3.698.406-.444.888-.556 1.184-.556.296 0 .592.002.852.016.272.014.636-.104.996.76.366.878 1.25 3.054 1.36 3.276.11.222.184.48.036.766-.148.286-.222.464-.442.714-.22.25-.462.558-.66.75-.22.212-.448.442-.192.868.256.426 1.14 1.88 2.448 3.046 1.682 1.498 3.098 1.964 3.54 2.186.442.222.7.186.958-.11.258-.296 1.106-1.292 1.402-1.736.296-.444.592-.37.998-.222.406.148 2.586 1.22 3.028 1.442.442.222.736.332.842.518.106.186.106 1.072-.234 2.028z" />
              </svg>
            )}
          </div>

          {/* Notification badges */}
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
            1
          </span>

          {/* Sparkle effect on hover */}
          <Sparkles className="absolute top-1 right-1 h-3 w-3 text-yellow-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity" />
        </Button>
      </div>
    </div>
  );

  if (!portalEl) return null;
  return createPortal(inner, portalEl);
}