'use client';

import { useState, useRef, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';

interface HeaderProps {
  onExportPdf: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
}

export default function Header({ onExportPdf, onExportJson, onImportJson }: HeaderProps) {
  const { project, setProjectName } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(project.meta.name);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    setProjectName(editValue.trim() || 'TB STORYBOARD');
    setIsEditing(false);
  };

  return (
    <header className="h-14 bg-white border-b-2 border-gray-300 flex items-center justify-between px-4 shrink-0 shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-light tracking-[0.3em] text-muted-light">TB</span>
        <div className="w-px h-5 bg-border" />
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="bg-transparent text-base text-foreground outline-none border-b border-accent px-1 py-0.5 w-56"
          />
        ) : (
          <button
            onClick={() => {
              setEditValue(project.meta.name);
              setIsEditing(true);
            }}
            className="text-base text-foreground hover:text-accent transition-colors"
          >
            {project.meta.name}
          </button>
        )}
      </div>

      {/* Right: Export */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="text-sm text-gray-900 hover:text-white px-4 py-2 border border-gray-300 rounded-md hover:bg-accent hover:border-accent transition-colors font-medium"
        >
          내보내기
        </button>
        {showExportMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[160px]">
            <button
              onClick={() => { onExportPdf(); setShowExportMenu(false); }}
              className="w-full text-left text-sm px-4 py-2.5 hover:bg-gray-100 text-gray-900 transition-colors"
            >
              PDF 내보내기
            </button>
            <button
              onClick={() => { onExportJson(); setShowExportMenu(false); }}
              className="w-full text-left text-sm px-4 py-2.5 hover:bg-gray-100 text-gray-900 transition-colors"
            >
              JSON 내보내기
            </button>
            <div className="border-t border-gray-200" />
            <button
              onClick={() => { onImportJson(); setShowExportMenu(false); }}
              className="w-full text-left text-sm px-4 py-2.5 hover:bg-gray-100 text-gray-900 transition-colors"
            >
              JSON 가져오기
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
