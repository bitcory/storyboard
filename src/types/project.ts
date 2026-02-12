import { ConceptArtData } from './concept';
import { StoryboardData } from './storyboard';

export interface ProjectMeta {
  name: string;
  createdAt: number;
  updatedAt: number;
  frameRate: number;
  aspectRatio: string;
}

export interface Project {
  meta: ProjectMeta;
  conceptArt: ConceptArtData;
  storyboard: StoryboardData;
}
