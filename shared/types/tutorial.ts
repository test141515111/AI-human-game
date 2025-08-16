export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetElement?: string; // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  allowClickOutside?: boolean;
  showNext?: boolean;
  showPrev?: boolean;
  showSkip?: boolean;
  action?: 'wait' | 'click' | 'input' | 'custom';
  actionTarget?: string;
  phase?: string; // Which game phase this step applies to
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  category: 'basics' | 'roles' | 'gameplay' | 'advanced';
}

export interface TutorialProgress {
  completedTutorials: string[];
  currentStep: number;
  showTutorialOnFirstJoin: boolean;
}