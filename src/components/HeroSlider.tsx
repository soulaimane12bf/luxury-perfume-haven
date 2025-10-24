import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
    setDirection('next');
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToPrev = () => {
    if (isTransitioning || sliders.length === 0) return;
    setDirection('prev');
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setDirection(index > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Handle button click
  const handleButtonClick = (link?: string) => {
    window.location.href = link || '/collection';
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-purple-400/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-400 border-r-pink-400 border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-r-transparent border-b-pink-400 border-l-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <p className="text-white text-xl font-medium tracking-wide">جاري التحميل...</p>
            <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (sliders.length === 0) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="text-center px-4 max-w-4xl relative z-10">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            مرحباً بك في متجر العطور الفاخرة
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-purple-200 mb-10 font-light">
            اكتشف عالم الروائح الفاخرة والعطور المميزة
          </p>
          <Button
            size="lg"
            onClick={() => handleButtonClick('/collection')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-purple-500/50 hover:scale-105 border border-white/20"
          >
            استكشف المجموعة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-black">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Slides Container */}
      <div className="relative w-full h-full">
        {sliders.map((slider, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + sliders.length) % sliders.length;
          const isNext = index === (currentIndex + 1) % sliders.length;
          
          return (
            <div
              key={`${slider.id}-${index}`}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
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
                  className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onLoad={() => console.log(`✅ Image loaded: ${slider.id}`)}
                  onError={(e) => {
                    console.error(`❌ Image failed: ${slider.id}`);
                    e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201200%20600%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%236b21a8%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23db2777%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20fill%3D%22url(%23g)%22%20width%3D%221200%22%20height%3D%22600%22%2F%3E%3C%2Fsvg%3E';
                  }}
                />
              </div>

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/30"></div>

              {/* Animated Particles */}
              {isActive && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                  <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
                </>
              )}

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center z-20 px-4 md:px-8">
                <div className="text-center text-white max-w-5xl">
                  {/* Title with Stagger Animation */}
                  <div className="overflow-hidden mb-4 md:mb-6">
                    <h1 
                      className={`text-4xl md:text-6xl lg:text-8xl font-bold drop-shadow-2xl leading-tight transition-all duration-700 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                      }`}
                      style={{ 
                        transitionDelay: isActive ? '200ms' : '0ms',
                        textShadow: '0 0 40px rgba(168, 85, 247, 0.4)'
                      }}
                    >
                      {slider.title}
                    </h1>
                  </div>
                  
                  {/* Subtitle */}
                  {slider.subtitle && (
                    <div className="overflow-hidden mb-6 md:mb-10">
                      <p 
                        className={`text-lg md:text-2xl lg:text-3xl drop-shadow-lg font-light transition-all duration-700 ${
                          isActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                        }`}
                        style={{ 
                          transitionDelay: isActive ? '400ms' : '0ms'
                        }}
                      >
                        {slider.subtitle}
                      </p>
                    </div>
                  )}
                  
                  {/* CTA Button with Glow Effect */}
                  <div 
                    className={`transition-all duration-700 ${
                      isActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                    }`}
                    style={{ transitionDelay: isActive ? '600ms' : '0ms' }}
                  >
                    <Button
                      size="lg"
                      onClick={() => handleButtonClick(slider.button_link)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 md:px-14 py-4 md:py-6 text-base md:text-xl shadow-2xl hover:shadow-purple-500/50 hover:scale-110 border-2 border-white/30 backdrop-blur-sm relative group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {slider.button_text}
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

      {/* Navigation Arrows - Modern Glass Design */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            disabled={isTransitioning}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-30 border border-white/20 group"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-30 border border-white/20 group"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* Modern Dot Indicators */}
      {sliders.length > 1 && (
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3 bg-black/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/20">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`relative transition-all duration-500 h-2 md:h-2.5 rounded-full focus:outline-none disabled:cursor-not-allowed overflow-hidden ${
                index === currentIndex
                  ? 'w-10 md:w-14 bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'w-2 md:w-2.5 bg-white/40 hover:bg-white/70 hover:scale-125'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
              type="button"
            >
              {index === currentIndex && (
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Slide Counter - Modern Badge */}
      {sliders.length > 1 && (
        <div className="absolute top-6 md:top-8 right-6 md:right-8 z-30 bg-gradient-to-br from-purple-600/90 to-pink-600/90 backdrop-blur-md text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold border border-white/30 shadow-xl">
          <span className="text-white">{currentIndex + 1}</span>
          <span className="text-white/60 mx-1">/</span>
          <span className="text-white/80">{sliders.length}</span>
        </div>
      )}
    </div>
  );
}