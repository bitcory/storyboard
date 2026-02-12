import { ImageData } from '@/types';
import { IMAGE_MAX_WIDTH, IMAGE_QUALITY } from './constants';
import { generateId } from './idGenerator';

export function resizeAndCompressImage(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > IMAGE_MAX_WIDTH) {
          height = (height * IMAGE_MAX_WIDTH) / width;
          width = IMAGE_MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
        resolve({
          id: generateId(),
          dataUrl,
          width,
          height,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
