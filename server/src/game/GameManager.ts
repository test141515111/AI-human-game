import { GameEngine } from './GameEngine';
import { v4 as uuidv4 } from 'uuid';

export class GameManager {
  private games: Map<string, GameEngine> = new Map();

  createGame(): string {
    const gameId = uuidv4();
    const game = new GameEngine(gameId);
    this.games.set(gameId, game);
    return gameId;
  }

  getGame(gameId: string): GameEngine | undefined {
    return this.games.get(gameId);
  }

  deleteGame(gameId: string): void {
    const game = this.games.get(gameId);
    if (game) {
      game.destroy();
      this.games.delete(gameId);
    }
  }

  getAllGames(): GameEngine[] {
    return Array.from(this.games.values());
  }

  getActiveGamesCount(): number {
    return Array.from(this.games.values())
      .filter(game => !game.getGameState().isFinished)
      .length;
  }
}

export const gameManager = new GameManager();