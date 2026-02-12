'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, ConceptCard, ConceptCategory, ConceptImageSlot, Shot, Scene, Sequence } from '@/types';
import { STORAGE_KEY, DEFAULT_FRAME_RATE, DEFAULT_ASPECT_RATIO } from '@/utils/constants';
import { generateId } from '@/utils/idGenerator';
import { generateCutNumber } from '@/utils/cutNumbering';
import { createDefaultTimeCode } from '@/utils/timeCode';
import { useAutoSave } from '@/hooks/useAutoSave';
import { ImageData } from '@/types';

function createEmptySlot(): ConceptImageSlot {
  return { image: null, description: '' };
}

function createDefaultProject(): Project {
  const sceneId = generateId();
  const shotId = generateId();
  const sequenceId = generateId();
  return {
    meta: {
      name: 'TB STORYBOARD',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      frameRate: DEFAULT_FRAME_RATE,
      aspectRatio: DEFAULT_ASPECT_RATIO,
    },
    conceptArt: {
      characters: [],
      locations: [],
      props: [],
    },
    storyboard: {
      sequences: [
        {
          id: sequenceId,
          name: '시퀀스 1',
          order: 0,
          scenes: [
            {
              id: sceneId,
              name: '씬 1',
              order: 0,
              shots: [
                {
                  id: shotId,
                  cutNumber: generateCutNumber(0, 0),
                  image: null,
                  time: createDefaultTimeCode(),
                  action: '',
                  dialogue: '',
                  order: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

// Migrate old format (images[] + description) to new format (slots[])
function migrateProject(p: Project): Project {
  const migrateCards = (cards: ConceptCard[]): ConceptCard[] =>
    cards.map((card) => {
      // Already migrated
      if (card.slots) return card;
      // Old format
      const oldCard = card as unknown as { images?: (ImageData | null)[]; description?: string };
      if (oldCard.images) {
        return {
          ...card,
          slots: oldCard.images.map((img) => ({ image: img, description: '' })),
        };
      }
      return card;
    });

  return {
    ...p,
    conceptArt: {
      characters: migrateCards(p.conceptArt.characters),
      locations: migrateCards(p.conceptArt.locations),
      props: migrateCards(p.conceptArt.props),
    },
  };
}

interface ProjectContextValue {
  project: Project;
  isLoaded: boolean;
  // Selection
  selectedSequenceId: string;
  selectedSceneId: string;
  selectSequence: (seqId: string) => void;
  selectScene: (seqId: string, sceneId: string) => void;
  // Meta
  setProjectName: (name: string) => void;
  setAspectRatio: (ratio: string) => void;
  // Concept Art
  addConceptCard: (category: ConceptCategory) => void;
  updateConceptCard: (category: ConceptCategory, cardId: string, updates: Partial<ConceptCard>) => void;
  deleteConceptCard: (category: ConceptCategory, cardId: string) => void;
  updateConceptSlotImage: (category: ConceptCategory, cardId: string, slotIndex: number, image: ImageData | null) => void;
  updateConceptSlotDescription: (category: ConceptCategory, cardId: string, slotIndex: number, description: string) => void;
  // Storyboard - Sequences
  addSequence: () => void;
  updateSequence: (seqId: string, updates: Partial<Sequence>) => void;
  deleteSequence: (seqId: string) => void;
  // Storyboard - Scenes
  addScene: (seqId: string) => void;
  updateScene: (seqId: string, sceneId: string, updates: Partial<Scene>) => void;
  deleteScene: (seqId: string, sceneId: string) => void;
  // Storyboard - Shots
  addShot: (seqId: string, sceneId: string) => void;
  updateShot: (seqId: string, sceneId: string, shotId: string, updates: Partial<Shot>) => void;
  deleteShot: (seqId: string, sceneId: string, shotId: string) => void;
  reorderShots: (seqId: string, sceneId: string, shotIds: string[]) => void;
  // Import
  importProject: (project: Project) => void;
  // Storage
  getStorageSize: () => number;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project>(createDefaultProject);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSequenceId, setSelectedSequenceId] = useState('');
  const [selectedSceneId, setSelectedSceneId] = useState('');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Project;
        setProject(migrateProject(parsed));
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    }
    setIsLoaded(true);
  }, []);

  // Auto-select first sequence/scene on load
  useEffect(() => {
    if (!isLoaded) return;
    const seqs = project.storyboard.sequences;
    if (seqs.length > 0 && !selectedSequenceId) {
      setSelectedSequenceId(seqs[0].id);
      if (seqs[0].scenes.length > 0) {
        setSelectedSceneId(seqs[0].scenes[0].id);
      }
    }
  }, [isLoaded, project.storyboard.sequences, selectedSequenceId]);

  // Fix stale selection
  useEffect(() => {
    const seqs = project.storyboard.sequences;
    if (selectedSequenceId && !seqs.find((s) => s.id === selectedSequenceId)) {
      if (seqs.length > 0) {
        setSelectedSequenceId(seqs[0].id);
        setSelectedSceneId(seqs[0].scenes[0]?.id || '');
      } else {
        setSelectedSequenceId('');
        setSelectedSceneId('');
      }
    }
    const seq = seqs.find((s) => s.id === selectedSequenceId);
    if (seq && selectedSceneId && !seq.scenes.find((s) => s.id === selectedSceneId)) {
      setSelectedSceneId(seq.scenes[0]?.id || '');
    }
  }, [project.storyboard.sequences, selectedSequenceId, selectedSceneId]);

  const selectSequence = useCallback((seqId: string) => {
    setSelectedSequenceId(seqId);
    const seq = project.storyboard.sequences.find((s) => s.id === seqId);
    if (seq?.scenes[0]) {
      setSelectedSceneId(seq.scenes[0].id);
    }
  }, [project.storyboard.sequences]);

  const selectScene = useCallback((seqId: string, sceneId: string) => {
    setSelectedSequenceId(seqId);
    setSelectedSceneId(sceneId);
  }, []);

  useAutoSave(isLoaded ? project : null);

  const updateProject = useCallback((updater: (prev: Project) => Project) => {
    setProject((prev) => {
      const updated = updater(prev);
      updated.meta.updatedAt = Date.now();
      return updated;
    });
  }, []);

  const setProjectName = useCallback((name: string) => {
    updateProject((p) => ({ ...p, meta: { ...p.meta, name } }));
  }, [updateProject]);

  const setAspectRatio = useCallback((aspectRatio: string) => {
    updateProject((p) => ({ ...p, meta: { ...p.meta, aspectRatio } }));
  }, [updateProject]);

  // Concept Art
  const addConceptCard = useCallback((category: ConceptCategory) => {
    const card: ConceptCard = {
      id: generateId(),
      slots: [createEmptySlot(), createEmptySlot(), createEmptySlot(), createEmptySlot()],
      name: '',
      category,
      createdAt: Date.now(),
    };
    updateProject((p) => ({
      ...p,
      conceptArt: {
        ...p.conceptArt,
        [category]: [...p.conceptArt[category], card],
      },
    }));
  }, [updateProject]);

  const updateConceptCard = useCallback((category: ConceptCategory, cardId: string, updates: Partial<ConceptCard>) => {
    updateProject((p) => ({
      ...p,
      conceptArt: {
        ...p.conceptArt,
        [category]: p.conceptArt[category].map((c) =>
          c.id === cardId ? { ...c, ...updates } : c
        ),
      },
    }));
  }, [updateProject]);

  const deleteConceptCard = useCallback((category: ConceptCategory, cardId: string) => {
    updateProject((p) => ({
      ...p,
      conceptArt: {
        ...p.conceptArt,
        [category]: p.conceptArt[category].filter((c) => c.id !== cardId),
      },
    }));
  }, [updateProject]);

  const updateConceptSlotImage = useCallback(
    (category: ConceptCategory, cardId: string, slotIndex: number, image: ImageData | null) => {
      updateProject((p) => ({
        ...p,
        conceptArt: {
          ...p.conceptArt,
          [category]: p.conceptArt[category].map((c) => {
            if (c.id !== cardId) return c;
            const slots = [...c.slots];
            slots[slotIndex] = { ...slots[slotIndex], image };
            return { ...c, slots };
          }),
        },
      }));
    },
    [updateProject]
  );

  const updateConceptSlotDescription = useCallback(
    (category: ConceptCategory, cardId: string, slotIndex: number, description: string) => {
      updateProject((p) => ({
        ...p,
        conceptArt: {
          ...p.conceptArt,
          [category]: p.conceptArt[category].map((c) => {
            if (c.id !== cardId) return c;
            const slots = [...c.slots];
            slots[slotIndex] = { ...slots[slotIndex], description };
            return { ...c, slots };
          }),
        },
      }));
    },
    [updateProject]
  );

  // Sequences
  const addSequence = useCallback(() => {
    updateProject((p) => {
      const newSeq: Sequence = {
        id: generateId(),
        name: `시퀀스 ${p.storyboard.sequences.length + 1}`,
        order: p.storyboard.sequences.length,
        scenes: [
          {
            id: generateId(),
            name: '씬 1',
            order: 0,
            shots: [
              {
                id: generateId(),
                cutNumber: generateCutNumber(0, 0),
                image: null,
                time: createDefaultTimeCode(),
                action: '',
                dialogue: '',
                order: 0,
              },
            ],
          },
        ],
      };
      return {
        ...p,
        storyboard: {
          ...p.storyboard,
          sequences: [...p.storyboard.sequences, newSeq],
        },
      };
    });
  }, [updateProject]);

  const updateSequence = useCallback((seqId: string, updates: Partial<Sequence>) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.map((s) =>
          s.id === seqId ? { ...s, ...updates } : s
        ),
      },
    }));
  }, [updateProject]);

  const deleteSequence = useCallback((seqId: string) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.filter((s) => s.id !== seqId),
      },
    }));
  }, [updateProject]);

  // Scenes
  const addScene = useCallback((seqId: string) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.map((seq) => {
          if (seq.id !== seqId) return seq;
          const newScene: Scene = {
            id: generateId(),
            name: `씬 ${seq.scenes.length + 1}`,
            order: seq.scenes.length,
            shots: [
              {
                id: generateId(),
                cutNumber: generateCutNumber(seq.scenes.length, 0),
                image: null,
                time: createDefaultTimeCode(),
                action: '',
                dialogue: '',
                order: 0,
              },
            ],
          };
          return { ...seq, scenes: [...seq.scenes, newScene] };
        }),
      },
    }));
  }, [updateProject]);

  const updateScene = useCallback((seqId: string, sceneId: string, updates: Partial<Scene>) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.map((seq) => {
          if (seq.id !== seqId) return seq;
          return {
            ...seq,
            scenes: seq.scenes.map((sc) =>
              sc.id === sceneId ? { ...sc, ...updates } : sc
            ),
          };
        }),
      },
    }));
  }, [updateProject]);

  const deleteScene = useCallback((seqId: string, sceneId: string) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.map((seq) => {
          if (seq.id !== seqId) return seq;
          return {
            ...seq,
            scenes: seq.scenes.filter((sc) => sc.id !== sceneId),
          };
        }),
      },
    }));
  }, [updateProject]);

  // Shots
  const addShot = useCallback((seqId: string, sceneId: string) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.map((seq) => {
          if (seq.id !== seqId) return seq;
          return {
            ...seq,
            scenes: seq.scenes.map((sc) => {
              if (sc.id !== sceneId) return sc;
              const sceneIndex = seq.scenes.indexOf(sc);
              const newShot: Shot = {
                id: generateId(),
                cutNumber: generateCutNumber(sceneIndex, sc.shots.length),
                image: null,
                time: createDefaultTimeCode(),
                action: '',
                dialogue: '',
                order: sc.shots.length,
              };
              return { ...sc, shots: [...sc.shots, newShot] };
            }),
          };
        }),
      },
    }));
  }, [updateProject]);

  const updateShot = useCallback((seqId: string, sceneId: string, shotId: string, updates: Partial<Shot>) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.map((seq) => {
          if (seq.id !== seqId) return seq;
          return {
            ...seq,
            scenes: seq.scenes.map((sc) => {
              if (sc.id !== sceneId) return sc;
              return {
                ...sc,
                shots: sc.shots.map((shot) =>
                  shot.id === shotId ? { ...shot, ...updates } : shot
                ),
              };
            }),
          };
        }),
      },
    }));
  }, [updateProject]);

  const deleteShot = useCallback((seqId: string, sceneId: string, shotId: string) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.map((seq) => {
          if (seq.id !== seqId) return seq;
          return {
            ...seq,
            scenes: seq.scenes.map((sc) => {
              if (sc.id !== sceneId) return sc;
              const filtered = sc.shots.filter((shot) => shot.id !== shotId);
              const sceneIndex = seq.scenes.indexOf(sc);
              return {
                ...sc,
                shots: filtered.map((shot, i) => ({
                  ...shot,
                  order: i,
                  cutNumber: generateCutNumber(sceneIndex, i),
                })),
              };
            }),
          };
        }),
      },
    }));
  }, [updateProject]);

  const reorderShots = useCallback((seqId: string, sceneId: string, shotIds: string[]) => {
    updateProject((p) => ({
      ...p,
      storyboard: {
        ...p.storyboard,
        sequences: p.storyboard.sequences.map((seq) => {
          if (seq.id !== seqId) return seq;
          return {
            ...seq,
            scenes: seq.scenes.map((sc) => {
              if (sc.id !== sceneId) return sc;
              const sceneIndex = seq.scenes.indexOf(sc);
              const reordered = shotIds.map((id, i) => {
                const shot = sc.shots.find((s) => s.id === id)!;
                return {
                  ...shot,
                  order: i,
                  cutNumber: generateCutNumber(sceneIndex, i),
                };
              });
              return { ...sc, shots: reordered };
            }),
          };
        }),
      },
    }));
  }, [updateProject]);

  const importProject = useCallback((imported: Project) => {
    setProject(migrateProject(imported));
  }, []);

  const getStorageSize = useCallback(() => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      return data ? new Blob([data]).size : 0;
    } catch {
      return 0;
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        isLoaded,
        selectedSequenceId,
        selectedSceneId,
        selectSequence,
        selectScene,
        setProjectName,
        setAspectRatio,
        addConceptCard,
        updateConceptCard,
        deleteConceptCard,
        updateConceptSlotImage,
        updateConceptSlotDescription,
        addSequence,
        updateSequence,
        deleteSequence,
        addScene,
        updateScene,
        deleteScene,
        addShot,
        updateShot,
        deleteShot,
        reorderShots,
        importProject,
        getStorageSize,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
