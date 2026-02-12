'use client';

import { ConceptCategory } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import ConceptCardComponent from './ConceptCardComponent';

interface ConceptCardListProps {
  category: ConceptCategory;
  title: string;
}

export default function ConceptCardList({ category, title }: ConceptCardListProps) {
  const { project, addConceptCard } = useProject();
  const cards = project.conceptArt[category];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-foreground">{title}</h2>
        <button
          onClick={() => addConceptCard(category)}
          className="text-sm text-gray-600 hover:text-white px-4 py-2 border border-gray-300 rounded-md hover:bg-accent hover:border-accent transition-colors font-medium"
        >
          + 추가
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-base text-muted mb-4">아직 {title} 카드가 없습니다</p>
          <button
            onClick={() => addConceptCard(category)}
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            첫 번째 카드 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <ConceptCardComponent key={card.id} card={card} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
