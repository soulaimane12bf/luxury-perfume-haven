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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
    },
    [autoplayRef.current]
  );

  // Normalize image URL to handle different formats
  const normalizeImageUrl = useCallback((url: string | null | undefined): string => {
    if (!url || url.trim() === '') {
      console.warn('⚠️ Empty or null image URL provided');
      return FALLBACK_IMAGE_DATA_URI;
    }

    const trimmedUrl = url.trim();

    // Already a data URI (base64 image)
    if (trimmedUrl.startsWith('data:image/')) {
      return trimmedUrl;
    }

    // Full HTTP/HTTPS URL
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }

    // Protocol-relative URL
    if (trimmedUrl.startsWith('//')) {
      return `https:${trimmedUrl}`;
    }

    // Relative URL - convert to absolute
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const path = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
      return `${origin}${path}`;
    }

    console.warn(`⚠️ Could not normalize URL: ${trimmedUrl}`);
    return FALLBACK_IMAGE_DATA_URI;
  }, []);

  // Handle image loading errors with retry logic
  const handleImageError = useCallback(
    (event: SyntheticEvent<HTMLImageElement>, sliderId: string) => {
      const img = event.currentTarget;
      const currentAttempt = parseInt(img.dataset.attempt || '0', 10);

      console.error(`❌ Image load failed for slider ${sliderId}, attempt ${currentAttempt + 1}`);

      // Try fallback after first failure
      if (currentAttempt === 0) {
        img.dataset.attempt = '1';
        // Force browser to re-evaluate the image
        img.src = FALLBACK_IMAGE_DATA_URI;
      }
    },
    []
  );

  // Handle successful image load
  const handleImageLoad = useCallback(
    (sliderId: string) => {
      console.log(`✅ Image loaded successfully for slider: ${sliderId}`);
      setImagesLoaded((prev) => new Set(prev).add(sliderId));
    },
    []
  );

  // Fetch active sliders from API
  useEffect(() => {
    let isMounted = true;

    const fetchSliders = async () => {
      try {
        console.log('🔄 Fetching sliders...');
        const data = await slidersApi.getActive();
        
        if (!isMounted) return;

        // Validate and normalize slider data
        const validSliders = (Array.isArray(data) ? data : [])
          .filter((slider: Slider) => {
            const isValid = slider && slider.id && slider.image_url;
            if (!isValid) {
              console.warn('⚠️ Invalid slider data:', slider);
            }
            return isValid;
          })
          .map((slider: Slider) => ({
            ...slider,
            image_url: normalizeImageUrl(slider.image_url),
            title: slider.title || 'عنوان الشريحة',
            subtitle: slider.subtitle || '',
            button_text: slider.button_text || 'تسوق الآن',
            button_link: slider.button_link || '/collection',
            order: slider.order ?? 0,
            active: slider.active ?? true,
          }))
          .sort((a, b) => a.order - b.order);

        console.log(`✅ Loaded ${validSliders.length} valid sliders`);
        setSliders(validSliders);
      } catch (error) {
        console.error('❌ Failed to fetch sliders:', error);
        // Set empty array on error
        if (isMounted) {
          setSliders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSliders();

    return () => {
      isMounted = false;
    };
  }, [normalizeImageUrl]);

  // Handle carousel selection changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    console.log(`📍 Carousel moved to slide ${index + 1}/${sliders.length}`);
  }, [emblaApi, sliders.length]);

  // Setup carousel event listeners
  useEffect(() => {
    if (!emblaApi) return;

    onSelect(); // Set initial selection
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Re-initialize carousel when sliders data changes
  useEffect(() => {
    if (!emblaApi || sliders.length === 0) return;

    console.log('🔄 Re-initializing carousel with', sliders.length, 'slides');
    
    // Use setTimeout to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      emblaApi.reInit();
      emblaApi.scrollTo(0, true); // true = instant, no animation
      setSelectedIndex(0);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [emblaApi, sliders.length]);

  // Carousel navigation functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  // Handle button click navigation
  const handleButtonClick = useCallback((link?: string) => {
    const targetLink = link || '/collection';
    window.location.href = targetLink;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-700 text-lg font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Empty state (no sliders)
  if (sliders.length === 0) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-amber-900 mb-6 leading-tight">
            مرحباً بك في متجر العطور الفاخرة
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-amber-700 mb-8">
            اكتشف عالم الروائح الفاخرة والعطور المميزة
          </p>
          <Button
            size="lg"
            onClick={() => handleButtonClick('/collection')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-6 text-lg md:text-xl shadow-xl hover:scale-105 transition-transform"
          >
            استكشف المجموعة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gray-900">
      {/* Embla Carousel Container */}
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {sliders.map((slider, index) => (
            <div
              key={slider.id}
              className="embla__slide relative min-w-full h-full flex-shrink-0"
              style={{ flex: '0 0 100%' }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slider.image_url}
                  alt={slider.title}
                  data-attempt="0"
                  data-slider-id={slider.id}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onLoad={() => handleImageLoad(slider.id)}
                  onError={(e) => handleImageError(e, slider.id)}
                />
                
                {/* Loading indicator for image */}
                {!imagesLoaded.has(slider.id) && (
                  <div className="absolute inset-0 bg-amber-100 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30 flex items-center justify-center z-10">
                <div className="text-center text-white px-6 md:px-8 max-w-6xl">
                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 drop-shadow-2xl leading-tight animate-fade-in">
                    {slider.title}
                  </h1>
                  
                  {/* Subtitle */}
                  {slider.subtitle && (
                    <p className="text-xl md:text-2xl lg:text-4xl mb-6 md:mb-8 drop-shadow-lg font-medium animate-fade-in-delayed opacity-95">
                      {slider.subtitle}
                    </p>
                  )}
                  
                  {/* CTA Button */}
                  <Button
                    size="lg"
                    onClick={() => handleButtonClick(slider.button_link)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl shadow-2xl hover:scale-110 transition-all duration-300 animate-fade-in-delayed-more font-semibold"
                  >
                    {slider.button_text}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (only show if multiple slides) */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-amber-900 rounded-full p-3 md:p-5 shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-500/50"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-amber-900 rounded-full p-3 md:p-5 shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-500/50"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
          </button>
        </>
      )}

      {/* Dot Indicators (only show if multiple slides) */}
      {sliders.length > 1 && (
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3 md:gap-4">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 h-3 md:h-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === selectedIndex
                  ? 'w-12 md:w-16 bg-amber-600'
                  : 'w-3 md:w-4 bg-white/60 hover:bg-white/90 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selectedIndex}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {sliders.length > 1 && (
        <div className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm md:text-base font-medium">
          {selectedIndex + 1} / {sliders.length}
        </div>
      )}
    </div>
  );
}
