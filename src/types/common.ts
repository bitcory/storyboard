export interface ImageData {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
}

export interface TimeCode {
  seconds: number;
  frames: number;
}

export interface Identifiable {
  id: string;
}
