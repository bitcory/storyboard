export const STORAGE_KEY = 'tb-storyboard-project';

export const DEFAULT_FRAME_RATE = 24;
export const DEFAULT_ASPECT_RATIO = '16:9';

export const AUTOSAVE_DEBOUNCE_MS = 500;

export const IMAGE_MAX_WIDTH = 480;
export const IMAGE_QUALITY = 0.5;

export const STORAGE_WARNING_BYTES = 4 * 1024 * 1024; // 4MB

export const CONCEPT_CATEGORIES = {
  characters: { label: '캐릭터', path: '/studio/concept/characters' },
  locations: { label: '장소', path: '/studio/concept/locations' },
  props: { label: '소품', path: '/studio/concept/props' },
} as const;

export const FRAME_RATIO_OPTIONS = [
  { value: '16/9', label: '16:9', desc: 'Widescreen' },
  { value: '4/3', label: '4:3', desc: 'Standard' },
  { value: '2.39/1', label: '2.39:1', desc: 'Cinemascope' },
  { value: '1.85/1', label: '1.85:1', desc: 'Theatrical' },
  { value: '1/1', label: '1:1', desc: 'Square' },
  { value: '9/16', label: '9:16', desc: 'Vertical' },
] as const;
