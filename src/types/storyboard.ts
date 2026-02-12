import { ImageData, TimeCode, Identifiable } from './common';

export interface Shot extends Identifiable {
  cutNumber: string;
  image: ImageData | null;
  time: TimeCode;
  action: string;
  dialogue: string;
  order: number;
}

export interface Scene extends Identifiable {
  name: string;
  shots: Shot[];
  order: number;
}

export interface Sequence extends Identifiable {
  name: string;
  scenes: Scene[];
  order: number;
}

export interface StoryboardData {
  sequences: Sequence[];
}
