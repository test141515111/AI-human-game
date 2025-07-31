import { create } from 'zustand';
import { GameState, Player, ChatMessage } from '@project-jin/shared';

interface GameStore {
  gameState: GameState | null;
  currentPlayer: Player | null;
  messages: ChatMessage[];
  setGameState: (state: GameState) => void;
  setCurrentPlayer: (player: Player) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: null,
  currentPlayer: null,
  messages: [],
  
  setGameState: (state) => set({ gameState: state }),
  
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  reset: () => set({
    gameState: null,
    currentPlayer: null,
    messages: []
  })
}));