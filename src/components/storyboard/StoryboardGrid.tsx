'use client';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useProject } from '@/contexts/ProjectContext';
import StoryboardRow from './StoryboardRow';

interface StoryboardGridProps {
  sequenceId: string;
  sceneId: string;
}

export default function StoryboardGrid({ sequenceId, sceneId }: StoryboardGridProps) {
  const { project, reorderShots, addShot } = useProject();

  const sequence = project.storyboard.sequences.find((s) => s.id === sequenceId);
  const scene = sequence?.scenes.find((s) => s.id === sceneId);
  const shots = scene?.shots || [];

  const aspectRatio = project.meta.aspectRatio.replace(':', '/');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = shots.findIndex((s) => s.id === active.id);
    const newIndex = shots.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = [...shots];
    const [moved] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, moved);
    reorderShots(sequenceId, sceneId, newOrder.map((s) => s.id));
  };

  if (shots.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-base text-muted mb-4">이 씬에 샷이 없습니다</p>
        <button
          onClick={() => addShot(sequenceId, sceneId)}
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          첫 번째 샷 추가하기
        </button>
      </div>
    );
  }

  const gridCols = '32px 80px 1px minmax(200px, 4fr) 1px 80px 1px minmax(100px, 2fr) 1px minmax(100px, 2fr) 40px';

  return (
    <div>
      {/* Header */}
      <div
        className="grid items-stretch mb-2 text-xs font-semibold uppercase tracking-widest border border-gray-300 rounded-lg overflow-hidden shadow-sm"
        style={{ gridTemplateColumns: gridCols }}
      >
        <div className="bg-gray-700 flex items-center justify-center py-2.5 text-white col-span-2">컷</div>
        <div className="bg-gray-500" />
        <div className="bg-gray-700 flex items-center justify-center py-2.5 text-white">이미지</div>
        <div className="bg-gray-500" />
        <div className="bg-gray-700 flex items-center justify-center py-2.5 text-white">시간</div>
        <div className="bg-gray-500" />
        <div className="bg-gray-700 flex items-center justify-center py-2.5 text-white">액션</div>
        <div className="bg-gray-500" />
        <div className="bg-gray-700 flex items-center justify-center py-2.5 text-white col-span-2">대화</div>
      </div>

      {/* Rows */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={shots.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {shots.map((shot) => (
            <StoryboardRow
              key={shot.id}
              shot={shot}
              sequenceId={sequenceId}
              sceneId={sceneId}
              aspectRatio={aspectRatio}
              gridCols={gridCols}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
