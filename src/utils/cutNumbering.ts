export function generateCutNumber(sceneIndex: number, shotIndex: number): string {
  const scene = String(sceneIndex + 1).padStart(3, '0');
  const shot = String(shotIndex + 1);
  return `${scene}-${shot}`;
}

export function recalculateCutNumbers(sceneIndex: number, shotCount: number): string[] {
  return Array.from({ length: shotCount }, (_, i) => generateCutNumber(sceneIndex, i));
}
