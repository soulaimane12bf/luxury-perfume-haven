import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slidersApi } from '@/lib/api';
import { Button } from './ui/button';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch sliders from API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        console.log('🔄 Fetching sliders...');
        const data = await slidersApi.getActive();
        
        console.log('📦 API Response:', data);

        const validSliders = (Array.isArray(data) ? data : [])
          .filter((slider: Slider) => slider && slider.id && slider.image_url)
          .map((slider: Slider) => ({
            ...slider,
            title: slider.title || 'عنوان الشريحة',
            subtitle: slider.subtitle || '',
            button_text: slider.button_text || 'تسوق الآن',
            button_link: slider.button_link || '/collection',
          }))
          .sort((a, b) => a.order - b.order);

        console.log(`✅ Loaded ${validSliders.length} sliders:`, validSliders);
        setSliders(validSliders);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching sliders:', error);
        setSliders([]);
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (sliders.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [sliders.length, currentIndex]);

  // Navigation functions
  const goToNext = () => {
    if (isTransitioning || sliders.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    if (isTransitioning || sliders.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Handle button click
  const handleButtonClick = (link?: string) => {
    window.location.href = link || '/collection';
  };

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

  // Empty state
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
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {sliders.map((slider, index) => (
          <div
            key={`${slider.id}-${index}`}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slider.image_url}
              alt={slider.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              onLoad={() => console.log(`✅ Image loaded: ${slider.id}`)}
              onError={(e) => {
                console.error(`❌ Image failed: ${slider.id}`);
                e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201200%20600%22%3E%3Crect%20fill%3D%22%23f1c27d%22%20width%3D%221200%22%20height%3D%22600%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-size%3D%2248%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fsvg%3E';
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-white px-6 md:px-8 max-w-6xl">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 drop-shadow-2xl leading-tight">
                  {slider.title}
                </h1>
                
                {slider.subtitle && (
                  <p className="text-xl md:text-2xl lg:text-4xl mb-6 md:mb-8 drop-shadow-lg font-medium opacity-95">
                    {slider.subtitle}
                  </p>
                )}
                
                <Button
                  size="lg"
                  onClick={() => handleButtonClick(slider.button_link)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl shadow-2xl hover:scale-110 transition-all duration-300 font-semibold"
                >
                  {slider.button_text}
                </Button>
              </div>
            </div>

            {/* Debug Info */}
            <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded font-mono z-30">
              Slide {index + 1} 
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            disabled={isTransitioning}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm hover:bg-white text-amber-900 rounded-full p-3 md:p-5 shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-500/50 disabled:opacity-50"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
          </button>
          
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm hover:bg-white text-amber-900 rounded-full p-3 md:p-5 shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-500/50 disabled:opacity-50"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {sliders.length > 1 && (
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3 md:gap-4">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 h-3 md:h-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed ${
                index === currentIndex
                  ? 'w-12 md:w-16 bg-amber-600'
                  : 'w-3 md:w-4 bg-white/60 hover:bg-white/90 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {sliders.length > 1 && (
        <div className="absolute top-6 right-6 z-30 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm md:text-base font-medium">
          {currentIndex + 1} / {sliders.length}
        </div>
      )}
    </div>
  );
}