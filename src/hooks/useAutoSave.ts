'use client';

import { useEffect, useRef, useState } from 'react';
import { AUTOSAVE_DEBOUNCE_MS, STORAGE_KEY } from '@/utils/constants';
import { Project } from '@/types';

export function useAutoSave(project: Project | null) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [quotaError, setQuotaError] = useState(false);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!project) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const json = JSON.stringify(project);
        window.localStorage.setItem(STORAGE_KEY, json);
        setQuotaError(false);
        warnedRef.current = false;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          setQuotaError(true);
          if (!warnedRef.current) {
            warnedRef.current = true;
            alert('저장 용량을 초과했습니다. 불필요한 이미지를 삭제하거나 JSON으로 내보내기 후 브라우저 데이터를 정리해 주세요.');
          }
        } else {
          console.error('Auto-save failed:', error);
        }
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [project]);

  return { quotaError };
}
