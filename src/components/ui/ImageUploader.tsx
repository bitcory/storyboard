'use client';

import { useCallback, useRef, useState } from 'react';
import { resizeAndCompressImage } from '@/utils/imageUtils';
import { ImageData } from '@/types';

interface ImageUploaderProps {
  image: ImageData | null;
  onUpload: (image: ImageData) => void;
  onRemove: () => void;
  aspectRatio?: string;
}

export default function ImageUploader({ image, onUpload, onRemove, aspectRatio = '1/1' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const imageData = await resizeAndCompressImage(file);
      onUpload(imageData);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`relative border-2 border-dashed rounded transition-colors overflow-hidden ${
        isDragging ? 'border-accent bg-accent/5' : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{ aspectRatio }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {image ? (
        <>
          <img
            src={image.dataUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 w-6 h-6 bg-background/80 text-foreground rounded-full flex items-center justify-center text-sm hover:bg-danger transition-colors"
          >
            ×
          </button>
        </>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 flex flex-col items-center justify-center text-muted hover:text-muted-light transition-colors"
        >
          <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="text-sm">이미지 추가</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
        className="hidden"
      />
    </div>
  );
}
