'use client';

import { useProject } from '@/contexts/ProjectContext';
import StoryboardToolbar from '@/components/storyboard/StoryboardToolbar';
import StoryboardGrid from '@/components/storyboard/StoryboardGrid';

export default function StoryboardPage() {
  const { project, isLoaded, selectedSequenceId, selectedSceneId, selectSequence, selectScene } = useProject();
  const sequences = project.storyboard.sequences;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-base text-muted">로딩 중...</div>
      </div>
    );
  }

  if (sequences.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-base text-muted mb-4">스토리보드가 비어 있습니다</p>
      </div>
    );
  }

  return (
    <div>
      <StoryboardToolbar
        selectedSequenceId={selectedSequenceId}
        selectedSceneId={selectedSceneId}
        onSelectSequence={selectSequence}
        onSelectScene={(sceneId) => selectScene(selectedSequenceId, sceneId)}
      />

      {selectedSequenceId && selectedSceneId && (
        <StoryboardGrid
          sequenceId={selectedSequenceId}
          sceneId={selectedSceneId}
        />
      )}
    </div>
  );
}
