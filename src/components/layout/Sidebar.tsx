'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { CONCEPT_CATEGORIES, STORAGE_KEY } from '@/utils/constants';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { project, selectedSequenceId, selectedSceneId, selectScene } = useProject();
  const [expandedSeq, setExpandedSeq] = useState<Record<string, boolean>>({});
  const [conceptOpen, setConceptOpen] = useState(false);
  const [storyboardOpen, setStoryboardOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isConceptPage = pathname.startsWith('/studio/concept');

  useEffect(() => {
    const expanded: Record<string, boolean> = {};
    project.storyboard.sequences.forEach((seq) => {
      expanded[seq.id] = true;
    });
    setExpandedSeq(expanded);
  }, [project.storyboard.sequences]);

  useEffect(() => {
    if (isConceptPage) setConceptOpen(true);
  }, [isConceptPage]);

  const toggleSeq = (seqId: string) => {
    setExpandedSeq((prev) => ({ ...prev, [seqId]: !prev[seqId] }));
  };

  const handleSceneClick = (seqId: string, sceneId: string) => {
    selectScene(seqId, sceneId);
    if (pathname !== '/studio/storyboard') {
      router.push('/studio/storyboard');
    }
  };

  return (
    <aside className="w-[280px] bg-gray-50 border-r-2 border-gray-300 flex flex-col shrink-0 overflow-y-auto">
      {/* Concept Art - Dropdown */}
      <div className="p-4">
        <button
          onClick={() => setConceptOpen(!conceptOpen)}
          className="w-full flex items-center gap-2 text-base font-semibold tracking-wide text-foreground mb-1"
        >
          <span className="w-3 h-3 rounded-full bg-violet-500 shrink-0" />
          <span className="flex-1 text-left">컨셉아트</span>
          <svg
            className={`w-3 h-3 shrink-0 transition-transform text-muted ${conceptOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M2 4l4 4 4-4z" />
          </svg>
        </button>
        {conceptOpen && (
          <nav className="space-y-1 mt-2">
            {Object.entries(CONCEPT_CATEGORIES).map(([key, { label, path }]) => (
              <Link
                key={key}
                href={path}
                className={`block pl-7 pr-3 py-2 text-sm rounded transition-colors ${
                  isActive(path)
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-light hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <div className="border-t border-gray-300 mx-4" />

      {/* Storyboard - Dropdown */}
      <div className="p-4 flex-1">
        <button
          onClick={() => setStoryboardOpen(!storyboardOpen)}
          className="w-full flex items-center gap-2 text-base font-semibold tracking-wide text-foreground mb-1"
        >
          <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
          <span className="flex-1 text-left">스토리보드</span>
          <svg
            className={`w-3 h-3 shrink-0 transition-transform text-muted ${storyboardOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M2 4l4 4 4-4z" />
          </svg>
        </button>

        {storyboardOpen && <div className="space-y-1 mt-2">
          {project.storyboard.sequences.map((seq) => (
            <div key={seq.id}>
              <button
                onClick={() => toggleSeq(seq.id)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-light hover:text-foreground hover:bg-surface-hover rounded transition-colors text-left"
              >
                <svg
                  className={`w-3 h-3 shrink-0 transition-transform ${expandedSeq[seq.id] ? 'rotate-90' : ''}`}
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M4 2l4 4-4 4z" />
                </svg>
                {seq.name}
              </button>

              {expandedSeq[seq.id] && seq.scenes.map((scene) => {
                const isSelected =
                  pathname === '/studio/storyboard' &&
                  selectedSequenceId === seq.id &&
                  selectedSceneId === scene.id;

                return (
                  <button
                    key={scene.id}
                    onClick={() => handleSceneClick(seq.id, scene.id)}
                    className={`w-full flex items-center justify-between pl-8 pr-3 py-1.5 text-xs rounded transition-colors text-left ${
                      isSelected
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted hover:text-foreground hover:bg-surface-hover'
                    }`}
                  >
                    <span>{scene.name}</span>
                    <span className="text-xs text-muted/60">{scene.shots.length}샷</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>}
      </div>

      {/* Storage Info */}
      <div className="p-4 border-t border-gray-300">
        <StorageInfo />
      </div>
    </aside>
  );
}

function StorageInfo() {
  const { getStorageSize } = useProject();
  const [size, setSize] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSize(getStorageSize());
  }, [getStorageSize]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setSize(getStorageSize());
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted, getStorageSize]);

  if (!mounted) return null;

  const mb = (size / (1024 * 1024)).toFixed(2);
  const isWarning = size > 4 * 1024 * 1024;

  const handleClear = () => {
    if (confirm('저장된 데이터를 모두 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className={`text-xs ${isWarning ? 'text-danger' : 'text-muted'}`}>
        저장 용량: {mb} MB
        {isWarning && ' (초과 주의)'}
      </div>
      <button
        onClick={handleClear}
        className="text-xs text-muted hover:text-danger transition-colors"
      >
        초기화
      </button>
    </div>
  );
}
