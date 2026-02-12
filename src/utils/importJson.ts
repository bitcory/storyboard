import { Project } from '@/types';

function validateProject(data: unknown): data is Project {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if (!obj.meta || typeof obj.meta !== 'object') return false;
  const meta = obj.meta as Record<string, unknown>;
  if (typeof meta.name !== 'string') return false;
  if (typeof meta.frameRate !== 'number') return false;

  if (!obj.conceptArt || typeof obj.conceptArt !== 'object') return false;
  const ca = obj.conceptArt as Record<string, unknown>;
  if (!Array.isArray(ca.characters)) return false;
  if (!Array.isArray(ca.locations)) return false;
  if (!Array.isArray(ca.props)) return false;

  if (!obj.storyboard || typeof obj.storyboard !== 'object') return false;
  const sb = obj.storyboard as Record<string, unknown>;
  if (!Array.isArray(sb.sequences)) return false;

  return true;
}

export function importProjectJson(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!validateProject(json)) {
          reject(new Error('유효하지 않은 프로젝트 파일입니다'));
          return;
        }
        resolve(json);
      } catch {
        reject(new Error('JSON 파싱에 실패했습니다'));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기에 실패했습니다'));
    reader.readAsText(file);
  });
}
