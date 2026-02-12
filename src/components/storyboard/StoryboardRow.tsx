'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Shot } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import TimeInput from './TimeInput';
import ImageUploader from '@/components/ui/ImageUploader';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface StoryboardRowProps {
  shot: Shot;
  sequenceId: string;
  sceneId: string;
  aspectRatio: string;
  gridCols: string;
}

export default function StoryboardRow({ shot, sequenceId, sceneId, aspectRatio, gridCols }: StoryboardRowProps) {
  const { updateShot, deleteShot } = useProject();
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    gridTemplateColumns: gridCols,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="grid items-stretch border border-gray-300 rounded-lg bg-white mb-2 group shadow-sm"
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center cursor-grab active:cursor-grabbing text-muted hover:text-muted-light"
        >
          <svg className="w-4 h-4" viewBox="0 0 10 18" fill="currentColor">
            <circle cx="3" cy="3" r="1.5" />
            <circle cx="7" cy="3" r="1.5" />
            <circle cx="3" cy="9" r="1.5" />
            <circle cx="7" cy="9" r="1.5" />
            <circle cx="3" cy="15" r="1.5" />
            <circle cx="7" cy="15" r="1.5" />
          </svg>
        </div>

        {/* Cut Number */}
        <div className="flex items-center justify-center font-mono text-base text-muted-light">
          {shot.cutNumber}
        </div>

        {/* Divider */}
        <div className="bg-gray-300" />

        {/* Image */}
        <div className="overflow-hidden">
          <ImageUploader
            image={shot.image}
            onUpload={(img) => updateShot(sequenceId, sceneId, shot.id, { image: img })}
            onRemove={() => updateShot(sequenceId, sceneId, shot.id, { image: null })}
            aspectRatio={aspectRatio}
          />
        </div>

        {/* Divider */}
        <div className="bg-gray-300" />

        {/* Time */}
        <div className="flex items-center justify-center">
          <TimeInput
            value={shot.time}
            onChange={(tc) => updateShot(sequenceId, sceneId, shot.id, { time: tc })}
          />
        </div>

        {/* Divider */}
        <div className="bg-gray-300" />

        {/* Action */}
        <div className="p-3">
          <textarea
            value={shot.action}
            onChange={(e) => updateShot(sequenceId, sceneId, shot.id, { action: e.target.value })}
            placeholder="액션 설명..."
            rows={4}
            className="w-full bg-transparent text-sm text-foreground outline-none resize-none placeholder:text-muted/50"
          />
        </div>

        {/* Divider */}
        <div className="bg-gray-300" />

        {/* Dialogue */}
        <div className="p-3">
          <textarea
            value={shot.dialogue}
            onChange={(e) => updateShot(sequenceId, sceneId, shot.id, { dialogue: e.target.value })}
            placeholder="대사..."
            rows={4}
            className="w-full bg-transparent text-sm text-foreground outline-none resize-none placeholder:text-muted/50"
          />
        </div>

        {/* Delete */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setShowConfirm(true)}
            className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all text-base"
          >
            ×
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="샷 삭제"
        message="이 샷을 삭제하시겠습니까?"
        onConfirm={() => {
          deleteShot(sequenceId, sceneId, shot.id);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
