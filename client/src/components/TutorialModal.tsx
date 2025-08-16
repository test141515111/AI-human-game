import React, { useState, useEffect, useRef } from 'react';
import { Tutorial, TutorialStep } from '@project-jin/shared';

interface TutorialModalProps {
  tutorial: Tutorial;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  currentStepIndex?: number;
}

export function TutorialModal({ 
  tutorial, 
  isOpen, 
  onClose, 
  onComplete, 
  currentStepIndex = 0 
}: TutorialModalProps) {
  const [stepIndex, setStepIndex] = useState(currentStepIndex);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentStep = tutorial.steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === tutorial.steps.length - 1;

  useEffect(() => {
    if (!isOpen) return;

    // Handle highlighting target elements
    if (currentStep?.targetElement) {
      const element = document.querySelector(currentStep.targetElement) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        element.classList.add('tutorial-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightedElement(null);
    }

    return () => {
      // Clean up highlight
      if (highlightedElement) {
        highlightedElement.classList.remove('tutorial-highlight');
      }
    };
  }, [isOpen, stepIndex, currentStep, highlightedElement]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && !isLastStep) {
        handleNext();
      } else if (event.key === 'ArrowLeft' && !isFirstStep) {
        handlePrevious();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isFirstStep, isLastStep]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const getModalPosition = () => {
    if (!currentStep?.targetElement || currentStep.position === 'center') {
      return 'fixed inset-0 flex items-center justify-center';
    }

    // Position relative to target element would be implemented here
    // For simplicity, defaulting to center for now
    return 'fixed inset-0 flex items-center justify-center';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className={getModalPosition()}>
        <div 
          ref={modalRef}
          className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full mx-4 z-50 border border-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{currentStep.title}</h2>
                <p className="text-sm text-gray-400">
                  {tutorial.title} - {stepIndex + 1}/{tutorial.steps.length}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div 
              className="text-gray-200 space-y-3"
              dangerouslySetInnerHTML={{ __html: currentStep.content }}
            />
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / tutorial.steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-750 rounded-b-lg flex items-center justify-between">
            <div className="flex space-x-2">
              {currentStep.showSkip && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  スキップ
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep.showPrev && !isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                >
                  戻る
                </button>
              )}
              
              {currentStep.showNext !== false && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  {isLastStep ? '完了' : '次へ'}
                </button>
              )}
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="px-6 py-2 text-xs text-gray-500 text-center border-t border-gray-700">
            <p>
              キーボード: ESC (閉じる) | ← → (ナビゲーション)
            </p>
          </div>
        </div>
      </div>
    </>
  );
}