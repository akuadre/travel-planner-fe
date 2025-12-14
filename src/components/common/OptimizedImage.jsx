// components/common/OptimizedImage.jsx
import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  fallback = null,
  onLoad,
  onError 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setImageSrc(src);

    // Cleanup previous image
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
    }

    // Create new image
    const img = new Image();
    imgRef.current = img;
    
    img.src = src;
    
    img.onload = () => {
      setIsLoading(false);
      if (onLoad) onLoad();
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      if (onError) onError();
    };

    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
        imgRef.current = null;
      }
    };
  }, [src]);

  if (hasError) {
    return fallback || (
      <div className={`${className} bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center`}>
        <svg className="h-12 w-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2l-7-4a2 2 0 00-2 0L5 7a2 2 0 00-2 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {isLoading && (
        <div 
          className="bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse absolute inset-0 z-10"
        />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage;