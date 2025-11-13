'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn, getImagePlaceholder } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const galleryImages = images.length > 0 ? images : [getImagePlaceholder(600, 600, 'Product')];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main image */}
      <div className="relative aspect-square bg-secondary-50 rounded-lg overflow-hidden">
        <Image
          src={galleryImages[selectedImageIndex]}
          alt={`${productName} - изображение ${selectedImageIndex + 1}`}
          fill
          className={cn(
            'object-cover transition-transform duration-300 cursor-zoom-in',
            isZoomed && 'scale-150'
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onClick={() => setIsZoomed(!isZoomed)}
        />
        
        {/* Navigation arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImageIndex(prev => 
                prev === 0 ? galleryImages.length - 1 : prev - 1
              )}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Предыдущее изображение"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setSelectedImageIndex(prev => 
                prev === galleryImages.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Следующее изображение"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                index === selectedImageIndex
                  ? 'border-primary-600'
                  : 'border-secondary-200 hover:border-secondary-300'
              )}
            >
              <Image
                src={image}
                alt={`${productName} - миниатюра ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom hint */}
      {!isZoomed && (
        <p className="text-sm text-secondary-500 text-center">
          Нажмите на изображение для увеличения
        </p>
      )}
    </div>
  );
}
