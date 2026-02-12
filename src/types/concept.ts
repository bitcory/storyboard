import { ImageData, Identifiable } from './common';

export type ConceptCategory = 'characters' | 'locations' | 'props';

export interface ConceptImageSlot {
  image: ImageData | null;
  description: string;
}

export interface ConceptCard extends Identifiable {
  slots: ConceptImageSlot[];
  name: string;
  category: ConceptCategory;
  createdAt: number;
}

export interface ConceptArtData {
  characters: ConceptCard[];
  locations: ConceptCard[];
  props: ConceptCard[];
}
