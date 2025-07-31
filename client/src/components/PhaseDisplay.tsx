import React from 'react';
import { GameState } from '@project-jin/shared';

interface PhaseDisplayProps {
  gameState: GameState;
}

export function PhaseDisplay({ gameState }: PhaseDisplayProps) {
  const phaseNames = {
    night: '夜',
    day_report: '朝 - 結果報告',
    day_discussion: '昼 - 議論',
    day_vote: '昼 - 投票',
    execution: '処刑'
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {phaseNames[gameState.phase]}フェーズ
          </h2>
          <p className="text-sm text-gray-400">ターン {gameState.turn}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">生存者</p>
          <p className="text-2xl font-bold">
            {gameState.players.filter(p => p.status === 'alive').length} / {gameState.players.length}
          </p>
        </div>
      </div>
    </div>
  );
}