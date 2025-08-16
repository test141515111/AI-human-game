import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useTutorialStore } from '../store/tutorialStore';
import { socketService } from '../services/socket';
import { ChatBox } from '../components/ChatBox';
import { PlayerList } from '../components/PlayerList';
import { GameControls } from '../components/GameControls';
import { PhaseDisplay } from '../components/PhaseDisplay';
import { TutorialTab } from '../components/TutorialTab';
import { TutorialModal } from '../components/TutorialModal';
import { TUTORIALS } from '@project-jin/shared';

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const playerName = searchParams.get('name');
  
  const { gameState, setGameState, setCurrentPlayer, addMessage, reset } = useGameStore();
  const { shouldShowFirstTimeHelp, completeTutorial, setShowTutorialOnFirstJoin } = useTutorialStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isTutorialTabOpen, setIsTutorialTabOpen] = useState(false);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);

  useEffect(() => {
    if (!gameId || !playerName) {
      navigate('/');
      return;
    }

    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinGame', gameId, playerName);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('gameState', (state) => {
      setGameState(state);
      const currentPlayer = state.players.find(p => p.name === playerName);
      if (currentPlayer) {
        setCurrentPlayer(currentPlayer);
      }
    });

    socket.on('playerJoined', (player) => {
      if (gameState) {
        const updatedState = {
          ...gameState,
          players: [...gameState.players, player]
        };
        setGameState(updatedState);
      }
    });

    socket.on('playerLeft', (playerId) => {
      if (gameState) {
        const updatedState = {
          ...gameState,
          players: gameState.players.filter(p => p.id !== playerId)
        };
        setGameState(updatedState);
      }
    });

    socket.on('chatMessage', (message) => {
      addMessage(message);
    });

    socket.on('phaseChange', (phase) => {
      if (gameState) {
        setGameState({ ...gameState, phase });
      }
    });

    socket.on('gameEnd', (winner, finalState) => {
      setGameState(finalState);
      alert(`ゲーム終了！ ${winner}陣営の勝利です！`);
    });

    socket.on('error', (message) => {
      alert(`エラー: ${message}`);
    });

    return () => {
      socket.emit('leaveGame');
      socketService.disconnect();
      reset();
    };
  }, [gameId, playerName]);

  // Show first-time tutorial
  useEffect(() => {
    if (isConnected && shouldShowFirstTimeHelp()) {
      const timer = setTimeout(() => {
        setShowFirstTimeModal(true);
      }, 2000); // Show after 2 seconds to let the game load
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, shouldShowFirstTimeHelp]);

  const handleFirstTimeTutorialComplete = () => {
    setShowFirstTimeModal(false);
    completeTutorial('gameBasics');
    setShowTutorialOnFirstJoin(false);
  };

  const handleFirstTimeTutorialClose = () => {
    setShowFirstTimeModal(false);
    setShowTutorialOnFirstJoin(false);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>接続中...</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>ゲーム情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        {/* Header with Tutorial Button */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Project JIN</h1>
            <p className="text-sm text-gray-400">ゲームID: {gameId}</p>
          </div>
          
          <button
            onClick={() => setIsTutorialTabOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-lg"
            title="チュートリアルを開く"
          >
            <span className="mr-2">📚</span>
            <span className="hidden sm:inline">チュートリアル</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="phase-display">
              <PhaseDisplay gameState={gameState} />
            </div>
            <div className="game-controls">
              <GameControls gameState={gameState} />
            </div>
            <div className="chat-box">
              <ChatBox />
            </div>
          </div>
          
          <div className="player-list">
            <PlayerList players={gameState.players} />
          </div>
        </div>
      </div>

      {/* Tutorial Tab */}
      <TutorialTab 
        isOpen={isTutorialTabOpen} 
        onClose={() => setIsTutorialTabOpen(false)} 
      />

      {/* First-time Tutorial Modal */}
      {showFirstTimeModal && (
        <TutorialModal
          tutorial={TUTORIALS.gameBasics}
          isOpen={showFirstTimeModal}
          onClose={handleFirstTimeTutorialClose}
          onComplete={handleFirstTimeTutorialComplete}
        />
      )}
    </div>
  );
}