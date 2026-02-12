'use client';

import { useRef } from 'react';
import { ProjectProvider } from '@/contexts/ProjectContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { exportProjectPdf } from '@/utils/exportPdf';
import { exportProjectJson } from '@/utils/exportJson';
import { importProjectJson } from '@/utils/importJson';
import { useProject } from '@/contexts/ProjectContext';

function StudioLayoutInner({ children }: { children: React.ReactNode }) {
  const { project, importProject } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPdf = () => {
    exportProjectPdf(project);
  };

  const handleExportJson = () => {
    exportProjectJson(project);
  };

  const handleImportJson = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importProjectJson(file);
      importProject(imported);
    } catch (error) {
      alert(`가져오기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
    e.target.value = '';
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        onExportPdf={handleExportPdf}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-100 px-3 py-4">
          {children}
        </main>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      <StudioLayoutInner>{children}</StudioLayoutInner>
    </ProjectProvider>
  );
}
