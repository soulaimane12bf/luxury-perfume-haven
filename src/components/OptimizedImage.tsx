import { useState, useEffect, ImgHTMLAttributes } from 'react';
import { useLazyImage } from '@/hooks/useLazyImage';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  className = '',
  ...props 
}: OptimizedImageProps) => {
  const { imgRef, imageSrc, isLoaded } = useLazyImage(src, placeholder);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <img
      ref={imgRef}
      src={hasError ? placeholder : imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={handleError}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      {...props}
    />
  );
};
