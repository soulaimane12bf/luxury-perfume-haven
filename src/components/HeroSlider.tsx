import { useState, useEffect, useCallback, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slidersApi } from '@/lib/api';
import { Button } from './ui/button';

const FALLBACK_IMAGE_DATA_URI =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f1c27d"/><stop offset="100%" stop-color="#8d5524"/></linearGradient></defs><rect width="1200" height="600" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="72">Luxury Perfume Haven</text></svg>'
  );

const createCacheBustedUrl = (url: string) => {
  const cacheBuster = `cacheBust=${Date.now()}`;
  return url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
};

interface Slider {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  button_text?: string;
  button_link?: string;
  order?: number;
  active?: boolean;
}

export function HeroSlider() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const resolveSliderImage = useCallback((url?: string | null) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';

    if (/^data:image\//i.test(trimmed)) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('//')) return `https:${trimmed}`;

    if (typeof window !== 'undefined') {
      const prefix = trimmed.startsWith('/') ? '' : '/';
      return `${window.location.origin}${prefix}${trimmed}`;
    }

    return trimmed;
  }, []);

  const handleImageError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    const originalSrc = target.dataset.originalSrc || '';
    const retries = Number(target.dataset.retryCount || '0');

    console.warn(`❌ Image failed to load: ${originalSrc || target.src}`);

    if (!originalSrc) {
      target.dataset.fallbackApplied = 'true';
      target.src = FALLBACK_IMAGE_DATA_URI;
      return;
    }

    if (retries < 1 && /^https?:\/\//i.test(originalSrc)) {
      target.dataset.retryCount = String(retries + 1);
      target.src = createCacheBustedUrl(originalSrc);
      return;
    }

    target.dataset.fallbackApplied = 'true';
    target.src = FALLBACK_IMAGE_DATA_URI;
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      direction: 'ltr',
      containScroll: 'trimSnaps',
    },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch active sliders
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await slidersApi.getActive();
        const normalized = Array.isArray(data)
          ? (data as Slider[])
              .map((slider) => ({
                ...slider,
                image_url: resolveSliderImage(slider.image_url),
              }))
              .filter((slider) => (slider.active ?? true) && slider.image_url)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : [];
        setSliders(normalized);
      } catch (error) {
        console.error('Failed to fetch sliders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, [resolveSliderImage]);

  // Update selected index on slide change
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || sliders.length === 0) return;
    // Ensure Embla recalculates slides after async data load.
    const raf = requestAnimationFrame(() => {
      emblaApi.reInit();
      emblaApi.scrollTo(0);
      autoplayRef.current?.play();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
    return () => cancelAnimationFrame(raf);
  }, [emblaApi, sliders.length]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (loading) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-r from-amber-50 to-amber-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (sliders.length === 0) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
            مرحباً بك في متجرنا
          </h2>
          <p className="text-xl md:text-2xl text-amber-700">
            اكتشف عالم العطور الفاخرة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gray-900">
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {sliders.map((slider, index) => {
            return (
              <div
                key={slider.id}
                className="embla__slide relative flex-shrink-0 flex-grow-0 w-full h-full"
                style={{ flex: '0 0 100%' }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${sliders.length}`}
              >
                {/* Background Image */}
                <img
                  src={slider.image_url}
                  alt={slider.title}
                  data-original-src={slider.image_url}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onLoad={(event) => {
                    event.currentTarget.dataset.retryCount = '0';
                    console.log(`✅ Slide ${index} image loaded -> ${event.currentTarget.currentSrc}`);
                  }}
                  onError={handleImageError}
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="text-center text-white px-4 max-w-5xl">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 drop-shadow-2xl animate-fade-in leading-tight">
                    {slider.title}
                  </h1>
                  <p className="text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-10 drop-shadow-lg animate-fade-in-delayed font-medium">
                    {slider.subtitle}
                  </p>
                  <Button 
                    size="lg"
                    onClick={() => {
                      if (slider.button_link) {
                        window.location.href = slider.button_link;
                      } else {
                        window.location.href = '/collection';
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-8 text-xl md:text-2xl animate-fade-in-delayed-more shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    {slider.button_text || 'تسوق الآن'}
                  </Button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-amber-900 rounded-full p-4 md:p-5 shadow-2xl transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-amber-900 rounded-full p-4 md:p-5 shadow-2xl transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {sliders.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all ${
                index === selectedIndex
                  ? 'w-16 bg-amber-600'
                  : 'w-4 bg-white/60 hover:bg-white/80'
              } h-4 rounded-full shadow-lg`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
