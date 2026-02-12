'use client';

import { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { FRAME_RATIO_OPTIONS } from '@/utils/constants';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface StoryboardToolbarProps {
  selectedSequenceId: string;
  selectedSceneId: string;
  onSelectSequence: (id: string) => void;
  onSelectScene: (id: string) => void;
}

export default function StoryboardToolbar({
  selectedSequenceId,
  selectedSceneId,
  onSelectSequence,
  onSelectScene,
}: StoryboardToolbarProps) {
  const { project, addSequence, addScene, deleteSequence, deleteScene, addShot, setAspectRatio } = useProject();
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'sequence' | 'scene'; id: string } | null>(null);

  const sequences = project.storyboard.sequences;
  const currentSequence = sequences.find((s) => s.id === selectedSequenceId);
  const scenes = currentSequence?.scenes || [];

  const currentRatioCss = project.meta.aspectRatio.replace(':', '/');

  const handleRatioChange = (cssValue: string) => {
    setAspectRatio(cssValue.replace('/', ':'));
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'sequence') {
      deleteSequence(deleteTarget.id);
      const remaining = sequences.filter((s) => s.id !== deleteTarget.id);
      if (remaining.length > 0) {
        onSelectSequence(remaining[0].id);
        onSelectScene(remaining[0].scenes[0]?.id || '');
      }
    } else {
      deleteScene(selectedSequenceId, deleteTarget.id);
      const remaining = scenes.filter((s) => s.id !== deleteTarget.id);
      if (remaining.length > 0) {
        onSelectScene(remaining[0].id);
      }
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {/* Frame Ratio */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted">프레임</label>
          <select
            value={currentRatioCss}
            onChange={(e) => handleRatioChange(e.target.value)}
            className="bg-white border border-gray-300 text-base text-gray-900 rounded-md px-3 py-1.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {FRAME_RATIO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Sequence Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 font-medium">시퀀스</label>
          <select
            value={selectedSequenceId}
            onChange={(e) => {
              onSelectSequence(e.target.value);
              const seq = sequences.find((s) => s.id === e.target.value);
              if (seq?.scenes[0]) onSelectScene(seq.scenes[0].id);
            }}
            className="bg-white border border-gray-300 text-base text-gray-900 rounded-md px-3 py-1.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {sequences.map((seq) => (
              <option key={seq.id} value={seq.id}>
                {seq.name}
              </option>
            ))}
          </select>
          <button
            onClick={addSequence}
            className="text-sm text-gray-600 hover:text-white px-2.5 py-1.5 border border-gray-300 rounded-md hover:bg-accent hover:border-accent transition-colors font-medium"
          >
            +
          </button>
          {sequences.length > 1 && (
            <button
              onClick={() => setDeleteTarget({ type: 'sequence', id: selectedSequenceId })}
              className="text-sm text-gray-400 hover:text-danger font-medium transition-colors"
            >
              삭제
            </button>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Scene Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 font-medium">씬</label>
          <select
            value={selectedSceneId}
            onChange={(e) => onSelectScene(e.target.value)}
            className="bg-white border border-gray-300 text-base text-gray-900 rounded-md px-3 py-1.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {scene.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => addScene(selectedSequenceId)}
            className="text-sm text-gray-600 hover:text-white px-2.5 py-1.5 border border-gray-300 rounded-md hover:bg-accent hover:border-accent transition-colors font-medium"
          >
            +
          </button>
          {scenes.length > 1 && (
            <button
              onClick={() => setDeleteTarget({ type: 'scene', id: selectedSceneId })}
              className="text-sm text-gray-400 hover:text-danger font-medium transition-colors"
            >
              삭제
            </button>
          )}
        </div>

        <div className="flex-1" />

        {/* Add Shot */}
        <button
          onClick={() => addShot(selectedSequenceId, selectedSceneId)}
          className="text-sm text-white px-4 py-2 bg-accent hover:bg-accent-hover rounded-md transition-colors font-medium shadow-sm"
        >
          + 샷 추가
        </button>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === 'sequence' ? '시퀀스 삭제' : '씬 삭제'}
        message={
          deleteTarget?.type === 'sequence'
            ? '이 시퀀스와 모든 하위 씬/샷이 삭제됩니다.'
            : '이 씬과 모든 하위 샷이 삭제됩니다.'
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
