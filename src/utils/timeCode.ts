import { TimeCode } from '@/types';
import { DEFAULT_FRAME_RATE } from './constants';

export function parseTimeCode(input: string): TimeCode {
  const parts = input.split('+');
  const seconds = parseInt(parts[0], 10) || 0;
  const frames = parseInt(parts[1], 10) || 0;
  return { seconds: Math.max(0, seconds), frames: Math.max(0, Math.min(frames, DEFAULT_FRAME_RATE - 1)) };
}

export function formatTimeCode(tc: TimeCode): string {
  return `${tc.seconds}+${tc.frames}`;
}

export function timeCodeToFrames(tc: TimeCode): number {
  return tc.seconds * DEFAULT_FRAME_RATE + tc.frames;
}

export function framesToTimeCode(totalFrames: number): TimeCode {
  const seconds = Math.floor(totalFrames / DEFAULT_FRAME_RATE);
  const frames = totalFrames % DEFAULT_FRAME_RATE;
  return { seconds, frames };
}

export function createDefaultTimeCode(): TimeCode {
  return { seconds: 0, frames: 0 };
}
