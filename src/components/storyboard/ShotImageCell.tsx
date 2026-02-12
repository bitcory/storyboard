'use client';

import { ImageData } from '@/types';
import ImageUploader from '@/components/ui/ImageUploader';

interface ShotImageCellProps {
  image: ImageData | null;
  onUpload: (image: ImageData) => void;
  onRemove: () => void;
  aspectRatio: string;
}

export default function ShotImageCell({ image, onUpload, onRemove, aspectRatio }: ShotImageCellProps) {
  return (
    <div className="flex-[4] min-w-[200px]">
      <ImageUploader
        image={image}
        onUpload={onUpload}
        onRemove={onRemove}
        aspectRatio={aspectRatio}
      />
    </div>
  );
}
