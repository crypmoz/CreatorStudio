import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // Reset state when src changes
    setIsLoading(true);
    setError(false);

    // For browser optimization, preload image if it's marked as priority
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [src, priority]);

  // Handle image load event
  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };
  
  // Handle image error event
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    onError?.();
  };

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!src || !width) return undefined;
    
    const srcWithoutExt = src.replace(/\.[^/.]+$/, '');
    const extension = src.split('.').pop();
    
    // Create srcSet for different sizes (1x, 2x)
    return `${src} 1x, ${srcWithoutExt}@2x.${extension} 2x`;
  };

  // Styled components for specific states
  const imageStyles: React.CSSProperties = {
    objectFit,
    display: isLoading || error ? 'none' : 'block',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  return (
    <div style={containerStyles} className={className}>
      {isLoading && (
        <Skeleton 
          className="absolute inset-0 rounded-md"
          style={{ width: '100%', height: '100%' }}
        />
      )}
      
      {error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-md"
          style={{ width: '100%', height: '100%' }}
        >
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        loading={loading}
        srcSet={generateSrcSet()}
        style={imageStyles}
        onLoad={handleImageLoad}
        onError={handleImageError}
        width={width}
        height={height}
      />
    </div>
  );
}