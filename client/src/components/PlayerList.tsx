import React from 'react';
import { Player } from '@project-jin/shared';

interface PlayerListProps {
  players: Player[];
}

export function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">プレイヤー</h3>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded ${
              player.status === 'dead' ? 'bg-gray-700 opacity-50' : 'bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  player.status === 'alive' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className={player.status === 'dead' ? 'line-through' : ''}>
                {player.name}
              </span>
              {player.isBot && (
                <span className="text-xs bg-blue-600 px-1 py-0.5 rounded">BOT</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}