const API_BASE_URL = '/api';

export const api = {
  createGame: async (): Promise<{ gameId: string }> => {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to create game');
    }
    
    return response.json();
  },

  getGameState: async (gameId: string) => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch game state');
    }
    
    return response.json();
  },
};