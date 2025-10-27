import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  // Keep the bubble on the left. Popup alignment differs by viewport:
  // - desktop (>=768px): popup opens to the right of the bubble
  // - mobile (<768px): popup opens to the left of the bubble
  // We compute isMobile at render time and do not toggle side dynamically.
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const [phone, setPhone] = useState<string | null>(null);
  const [offsetBottom, setOffsetBottom] = useState<number>(0);
  // Create portal element state before any early returns so Hooks order is
  // consistent across renders (avoid calling Hooks after an early return).
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  // Hide the floating WhatsApp bubble on admin pages (any path containing
  // /admin). Call hooks unconditionally to preserve hook ordering.
  const location = useLocation();
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    // Prefer the runtime location when available; fall back to window when
    // running in the browser before the router updates.
    const p = (location && location.pathname) || (typeof window !== 'undefined' ? window.location.pathname : '');
    return p === '/admin' || p.startsWith('/admin/');
  });

  useEffect(() => {
  // keep existing pagination detection behavior

    // Also check if pagination is present and adjust bubble bottom so it
    // doesn't overlap page controls (runs on resize / scroll).
    const checkPagination = () => {
      try {
        // Try several common selectors: the shared pagination uses
        // nav[aria-label="pagination"], but some pages/components may use
        // .pagination or a data attribute like [data-pagination].
        const selectors = ['nav[aria-label="pagination"]', '.pagination', '[data-pagination]'];
        const nodes = document.querySelectorAll(selectors.join(','));

        let found: Element | null = null;
        for (const n of Array.from(nodes)) {
          const el = n as Element;
          // ensure element is visible and in the document flow
          if (!(el instanceof HTMLElement)) continue;
          if (el.offsetParent === null) continue; // hidden
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
        const gap = 12; // px
        // If pagination sits near the bottom of the viewport, raise the bubble
        // above it by nav height + small gap. We consider "near bottom" when
        // the bottom is within 80px of the viewport bottom.
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
    // Run once initially
    checkPagination();

    return () => {
      window.removeEventListener('resize', checkPagination);
      window.removeEventListener('scroll', checkPagination as EventListener);
    };
  }, []);

  // Render into a dedicated DOM node attached to document.body so that the
  // fixed positioning is not affected by transformed ancestors (a common
  // cause of 'jumping' when other UI pieces appear). We create the node on
  // mount and clean up on unmount. This effect must run before any early
  // returns so Hooks keep a stable ordering.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const el = document.createElement('div');
    // small identifying attribute for easier debugging
    el.setAttribute('data-floating-whatsapp-portal', 'true');
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      try {
        if (el.parentNode) el.parentNode.removeChild(el);
      } catch (e) {
        // ignore cleanup errors (element may already have been removed)
      }
    };
  }, []);

  // Update admin-route state when the router location changes.
  useEffect(() => {
    const pathname = location?.pathname;
    if (!pathname) return;
    setIsAdminRoute(pathname === '/admin' || pathname.startsWith('/admin/'));
  }, [location?.pathname]);

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

  // Position the bubble on the left. Use a high z-index so it sits above the
  // filter button. Popup alignment:
  // - desktop: place popup to the right of the bubble
  // - mobile: place popup to the left of the bubble
  const popupAlignClass = isMobile ? 'left-0 -translate-x-0' : 'left-16';
  const baseBottom = 24; // base bottom spacing in px

  

  const inner = (
    // Use a z-index that keeps the bubble above regular page content but
    // below overlaying UI like Sheets/Drawers (SheetContent uses z-[200]).
    // This ensures when the cart or mobile sidebar opens the WhatsApp bubble
    // sits underneath them instead of overlapping.
    <div style={{ position: 'fixed', left: 24, bottom: `${baseBottom + offsetBottom}px`, zIndex: 120 }}>
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

    // If portal element isn't ready yet (SSR or mount lag), render nothing.
    if (!portalEl) return null;
    return createPortal(inner, portalEl);

  }
