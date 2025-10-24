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
  const [direction, setDirection] = useState('next');

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
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log(`✅ Loaded ${validSliders.length} sliders:`, validSliders);
        setSliders(validSliders);
      } catch (error) {
        console.error('❌ Error fetching sliders:', error);
        setSliders([]);
      } finally {
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
    setDirection('next');
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
  setTimeout(() => setIsTransitioning(false), 250);
  };

  const goToPrev = () => {
    if (isTransitioning || sliders.length === 0) return;
    setDirection('prev');
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  setTimeout(() => setIsTransitioning(false), 250);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setDirection(index > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setCurrentIndex(index);
  setTimeout(() => setIsTransitioning(false), 250);
  };

  // Handle button click
  const handleButtonClick = (link?: string) => {
    window.location.href = link || '/collection';
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gray-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
          </div>
          <p className="text-white text-xl font-medium tracking-wide">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (sliders.length === 0) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Removed heavy animated backgrounds for performance */}
        </div>
        <div className="text-center px-4 max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            مرحباً بك في متجر العطور الفاخرة
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-10 font-light">
            اكتشف عالم الروائح الفاخرة والعطور المميزة
          </p>
          <Button
            size="lg"
            onClick={() => handleButtonClick('/collection')}
            className="bg-white hover:bg-gray-100 text-black shadow-2xl hover:scale-105 border border-gray-200"
          >
            استكشف المجموعة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-black">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {sliders.map((slider, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + sliders.length) % sliders.length;
          const isNext = index === (currentIndex + 1) % sliders.length;
          
          return (
            <div
              key={`${slider.id}-${index}`}
              className={`absolute inset-0 w-full h-full transition-all duration-250 ease-out ${
                isActive 
                  ? 'opacity-100 scale-100 z-20' 
                  : isPrev || isNext
                  ? 'opacity-0 scale-95 z-10'
                  : 'opacity-0 scale-90 z-0'
              }`}
              style={{
                transform: isActive 
                  ? 'translateX(0) scale(1)' 
                  : direction === 'next' && isPrev
                  ? 'translateX(-50px) scale(0.95)'
                  : direction === 'prev' && isNext
                  ? 'translateX(50px) scale(0.95)'
                  : 'scale(0.9)'
              }}
            >
              {/* Background Image with Ken Burns Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slider.image_url}
                  alt={slider.title}
                    className={`w-full h-full object-cover object-center transition-transform duration-250 ease-out ${
                    isActive ? 'scale-105 md:scale-110' : 'scale-100'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onLoad={() => console.log(`✅ Image loaded: ${slider.id}`)}
                  onError={(e) => {
                    console.error(`❌ Image failed: ${slider.id}`);
                    e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201200%20600%22%3E%3Crect%20fill%3D%22%23111827%22%20width%3D%221200%22%20height%3D%22600%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-size%3D%2248%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fsvg%3E';
                  }}
                />
              </div>

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center z-20 px-6 md:px-8">
                <div className="text-center text-white max-w-5xl">
                  {/* Title with Stagger Animation */}
                  <div className="mb-6 md:mb-8">
                    <h1 
                      className={`text-5xl md:text-7xl lg:text-8xl font-bold drop-shadow-2xl leading-[1.2] transition-all duration-250 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                      }`}
                      style={{ 
                        transitionDelay: isActive ? '200ms' : '0ms',
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      {slider.title}
                    </h1>
                  </div>
                  
                  {/* Subtitle */}
                  {slider.subtitle && (
                    <div className="mb-8 md:mb-12">
                      <p 
                        className={`text-xl md:text-3xl lg:text-4xl drop-shadow-lg font-light leading-relaxed transition-all duration-250 ${
                          isActive ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                        style={{ 
                          transitionDelay: isActive ? '400ms' : '0ms',
                          textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
                        }}
                      >
                        {slider.subtitle}
                      </p>
                    </div>
                  )}
                  
                  {/* CTA Button */}
                  <div 
                    className={`transition-all duration-250 ${
                      isActive ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
                    style={{ transitionDelay: isActive ? '600ms' : '0ms' }}
                  >
                    <Button
                      size="lg"
                      onClick={() => handleButtonClick(slider.button_link)}
                      className="bg-white hover:bg-gray-100 text-black px-10 md:px-16 py-4 md:py-6 text-lg md:text-2xl shadow-2xl font-semibold transition-all duration-150"
                    >
                      {slider.button_text}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Debug Info */}
              <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded font-mono z-30">
                Slide {index + 1} 
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            disabled={isTransitioning}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 md:p-5 shadow-2xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-30 border border-white/20 group"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 md:w-10 md:h-10 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 md:p-5 shadow-2xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-30 border border-white/20 group"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="w-6 h-6 md:w-10 md:h-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* Modern Dot Indicators */}
      {sliders.length > 1 && (
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3 bg-black/20 backdrop-blur-md px-5 py-3 rounded-full border border-white/20">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`relative transition-all duration-150 h-2.5 md:h-3 rounded-full focus:outline-none disabled:cursor-not-allowed overflow-hidden ${
                index === currentIndex
                  ? 'w-12 md:w-16 bg-white'
                  : 'w-2.5 md:w-3 bg-white/40 hover:bg-white/70 hover:scale-125'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
              type="button"
            >
              {index === currentIndex && (
                <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {sliders.length > 1 && (
        <div className="absolute top-6 md:top-8 right-6 md:right-8 z-30 bg-black/50 backdrop-blur-md text-white px-5 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold border border-white/20 shadow-xl">
          <span className="text-white">{currentIndex + 1}</span>
          <span className="text-white/60 mx-1.5">/</span>
          <span className="text-white/80">{sliders.length}</span>
        </div>
      )}
    </div>
  );
}