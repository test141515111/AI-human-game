import React, { useState } from 'react';
import { TUTORIALS, TUTORIAL_CATEGORIES } from '@project-jin/shared';
import { TutorialModal } from './TutorialModal';

interface TutorialTabProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialTab({ isOpen, onClose }: TutorialTabProps) {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

  const handleTutorialSelect = (tutorialId: string) => {
    setSelectedTutorial(tutorialId);
    setIsTutorialModalOpen(true);
  };

  const handleTutorialComplete = () => {
    setIsTutorialModalOpen(false);
    setSelectedTutorial(null);
    // Here you could save tutorial completion status
  };

  const handleTutorialClose = () => {
    setIsTutorialModalOpen(false);
    setSelectedTutorial(null);
  };

  const groupedTutorials = Object.values(TUTORIALS).reduce((acc, tutorial) => {
    if (!acc[tutorial.category]) {
      acc[tutorial.category] = [];
    }
    acc[tutorial.category].push(tutorial);
    return acc;
  }, {} as Record<string, typeof TUTORIALS[keyof typeof TUTORIALS][]>);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onClose} />
      
      {/* Tutorial Tab Panel */}
      <div className="fixed inset-y-0 right-0 w-96 bg-gray-800 shadow-2xl z-40 transform transition-transform duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-600 bg-gray-750">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">📚</span>
              チュートリアル
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Project JINのゲームシステムを学びましょう
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.entries(groupedTutorials).map(([category, tutorials]) => {
            const categoryInfo = TUTORIAL_CATEGORIES[category as keyof typeof TUTORIAL_CATEGORIES];
            const colorClasses = {
              blue: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
              purple: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
              green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
              yellow: 'from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
            };

            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <span className="mr-2">{categoryInfo.icon}</span>
                  {categoryInfo.name}
                </h3>
                
                <div className="space-y-3">
                  {tutorials.map((tutorial) => (
                    <div 
                      key={tutorial.id}
                      className={`bg-gradient-to-r ${colorClasses[categoryInfo.color]} rounded-lg p-4 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg`}
                      onClick={() => handleTutorialSelect(tutorial.id)}
                    >
                      <h4 className="font-bold text-white mb-2">{tutorial.title}</h4>
                      <p className="text-sm text-gray-100 mb-3">{tutorial.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-200 bg-black bg-opacity-20 px-2 py-1 rounded">
                          {tutorial.steps.length} ステップ
                        </span>
                        <div className="flex items-center text-white">
                          <span className="text-sm mr-1">開始</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Quick Tips */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <h3 className="font-bold text-white mb-2 flex items-center">
              <span className="mr-2">💡</span>
              クイックヒント
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 初回プレイ時は「基本ガイド」から始めることをお勧めします</li>
              <li>• チュートリアル中はESCキーでいつでも終了できます</li>
              <li>• 矢印キー（←→）でステップを移動できます</li>
              <li>• 各チュートリアルは何度でも再生可能です</li>
            </ul>
          </div>

          {/* Game Status Info */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-4 border border-gray-500">
            <h3 className="font-bold text-white mb-2 flex items-center">
              <span className="mr-2">🎮</span>
              ゲーム状況
            </h3>
            <p className="text-sm text-gray-300">
              チュートリアルはゲーム中いつでも確認できます。
              実際のゲームプレイと並行して学習することで、より効果的に理解を深められます。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-600 bg-gray-750">
          <p className="text-xs text-gray-400 text-center">
            西暦2042年の心理戦へようこそ 🤖🧠
          </p>
        </div>
      </div>

      {/* Tutorial Modal */}
      {selectedTutorial && (
        <TutorialModal
          tutorial={TUTORIALS[selectedTutorial]}
          isOpen={isTutorialModalOpen}
          onClose={handleTutorialClose}
          onComplete={handleTutorialComplete}
        />
      )}
    </>
  );
}