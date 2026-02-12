'use client';

import { useState } from 'react';
import { ConceptCard, ConceptCategory } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import ImageUploader from '@/components/ui/ImageUploader';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface ConceptCardComponentProps {
  card: ConceptCard;
  category: ConceptCategory;
}

export default function ConceptCardComponent({ card, category }: ConceptCardComponentProps) {
  const { updateConceptCard, updateConceptSlotImage, updateConceptSlotDescription, deleteConceptCard } = useProject();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
          <input
            type="text"
            value={card.name}
            onChange={(e) => updateConceptCard(category, card.id, { name: e.target.value })}
            placeholder="이름을 입력하세요"
            className="bg-transparent text-base font-medium text-foreground outline-none flex-1 placeholder:text-muted"
          />
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-muted hover:text-danger transition-colors ml-4 shrink-0"
          >
            삭제
          </button>
        </div>

        {/* 4-Section Grid */}
        <div className="grid grid-cols-4 divide-x divide-gray-300">
          {card.slots.map((slot, idx) => (
            <div key={idx} className="p-3 flex flex-col">
              {/* Section Label */}
              <div className="text-xs text-muted uppercase tracking-wider mb-2 text-center">
                {idx + 1}
              </div>

              {/* Image */}
              <ImageUploader
                image={slot.image}
                onUpload={(image) => updateConceptSlotImage(category, card.id, idx, image)}
                onRemove={() => updateConceptSlotImage(category, card.id, idx, null)}
                aspectRatio="4/3"
              />

              {/* Per-image Description */}
              <textarea
                value={slot.description}
                onChange={(e) => updateConceptSlotDescription(category, card.id, idx, e.target.value)}
                placeholder="설명..."
                rows={3}
                className="w-full bg-gray-50 text-sm text-gray-900 outline-none border border-gray-300 rounded p-2 resize-none focus:border-accent focus:ring-1 focus:ring-accent placeholder:text-gray-400 mt-2"
              />
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="카드 삭제"
        message="이 컨셉 카드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={() => {
          deleteConceptCard(category, card.id);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
