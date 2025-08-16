import { create } from 'zustand';
import { TutorialProgress } from '@project-jin/shared';

interface TutorialStore extends TutorialProgress {
  // Actions
  completeTutorial: (tutorialId: string) => void;
  setCurrentStep: (step: number) => void;
  setShowTutorialOnFirstJoin: (show: boolean) => void;
  resetTutorialProgress: () => void;
  
  // Helper functions
  isTutorialCompleted: (tutorialId: string) => boolean;
  shouldShowFirstTimeHelp: () => boolean;
}

const getStoredProgress = (): TutorialProgress => {
  if (typeof window === 'undefined') {
    return { completedTutorials: [], currentStep: 0, showTutorialOnFirstJoin: true };
  }
  
  try {
    const stored = localStorage.getItem('project-jin-tutorial-progress');
    return stored ? JSON.parse(stored) : { completedTutorials: [], currentStep: 0, showTutorialOnFirstJoin: true };
  } catch {
    return { completedTutorials: [], currentStep: 0, showTutorialOnFirstJoin: true };
  }
};

const saveProgress = (progress: TutorialProgress) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('project-jin-tutorial-progress', JSON.stringify(progress));
  }
};

const initialState: TutorialProgress = getStoredProgress();

export const useTutorialStore = create<TutorialStore>((set, get) => ({
  ...initialState,

  completeTutorial: (tutorialId: string) => {
    const newState = {
      ...get(),
      completedTutorials: get().completedTutorials.includes(tutorialId)
        ? get().completedTutorials
        : [...get().completedTutorials, tutorialId]
    };
    set(newState);
    saveProgress(newState);
  },

  setCurrentStep: (step: number) => {
    const newState = { ...get(), currentStep: step };
    set(newState);
    saveProgress(newState);
  },

  setShowTutorialOnFirstJoin: (show: boolean) => {
    const newState = { ...get(), showTutorialOnFirstJoin: show };
    set(newState);
    saveProgress(newState);
  },

  resetTutorialProgress: () => {
    const newState = { completedTutorials: [], currentStep: 0, showTutorialOnFirstJoin: true };
    set(newState);
    saveProgress(newState);
  },

  isTutorialCompleted: (tutorialId: string) => {
    return get().completedTutorials.includes(tutorialId);
  },

  shouldShowFirstTimeHelp: () => {
    const state = get();
    return state.showTutorialOnFirstJoin && state.completedTutorials.length === 0;
  }
}));