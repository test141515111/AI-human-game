import { Server, Socket } from 'socket.io';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData,
  ChatMessage 
} from '@project-jin/shared';
import { gameManager } from '../game';
import { v4 as uuidv4 } from 'uuid';

export class SocketHandler {
  private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('joinGame', (gameId: string, playerName: string) => {
        this.handleJoinGame(socket, gameId, playerName);
      });

      socket.on('leaveGame', () => {
        this.handleLeaveGame(socket);
      });

      socket.on('startGame', () => {
        this.handleStartGame(socket);
      });

      socket.on('nightAction', (action) => {
        this.handleNightAction(socket, action);
      });

      socket.on('vote', (targetId) => {
        this.handleVote(socket, targetId);
      });

      socket.on('sendMessage', (content) => {
        this.handleSendMessage(socket, content);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.handleLeaveGame(socket);
      });
    });
  }

  private handleJoinGame(socket: Socket, gameId: string, playerName: string): void {
    try {
      const game = gameManager.getGame(gameId);
      if (!game) {
        socket.emit('error', 'Game not found');
        return;
      }

      const player = game.addPlayer(playerName, false);
      socket.data.gameId = gameId;
      socket.data.playerId = player.id;
      socket.join(gameId);

      socket.emit('gameState', game.getGameState());
      socket.to(gameId).emit('playerJoined', player);
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to join game');
    }
  }

  private handleLeaveGame(socket: Socket): void {
    const { gameId, playerId } = socket.data;
    if (!gameId || !playerId) return;

    const game = gameManager.getGame(gameId);
    if (game) {
      game.removePlayer(playerId);
      socket.to(gameId).emit('playerLeft', playerId);
      
      if (game.getGameState().players.length === 0) {
        gameManager.deleteGame(gameId);
      }
    }

    socket.leave(gameId);
    socket.data.gameId = undefined;
    socket.data.playerId = undefined;
  }

  private handleStartGame(socket: Socket): void {
    const { gameId } = socket.data;
    if (!gameId) {
      socket.emit('error', 'Not in a game');
      return;
    }

    const game = gameManager.getGame(gameId);
    if (!game) {
      socket.emit('error', 'Game not found');
      return;
    }

    try {
      game.startGame();
      this.setupGamePhaseHandlers(gameId, game);
      this.io.to(gameId).emit('gameState', game.getGameState());
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to start game');
    }
  }

  private setupGamePhaseHandlers(gameId: string, game: any): void {
    game.onPhaseChange('day_report', () => {
      const casualties = game.processNightActions();
      this.io.to(gameId).emit('nightResult', casualties);
      
      const winner = game.checkWinCondition();
      if (winner) {
        const finalState = game.getGameState();
        finalState.winner = winner;
        finalState.isFinished = true;
        this.io.to(gameId).emit('gameEnd', winner, finalState);
        gameManager.deleteGame(gameId);
      }
    });

    game.onPhaseChange('execution', () => {
      const voteResults = game.processVotes();
      this.io.to(gameId).emit('voteResult', voteResults);
      
      const winner = game.checkWinCondition();
      if (winner) {
        const finalState = game.getGameState();
        finalState.winner = winner;
        finalState.isFinished = true;
        this.io.to(gameId).emit('gameEnd', winner, finalState);
        gameManager.deleteGame(gameId);
      }
    });

    const phases = ['night', 'day_report', 'day_discussion', 'day_vote', 'execution'] as const;
    phases.forEach(phase => {
      game.onPhaseChange(phase, () => {
        this.io.to(gameId).emit('phaseChange', phase);
      });
    });
  }

  private handleNightAction(socket: Socket, action: any): void {
    const { gameId, playerId } = socket.data;
    if (!gameId || !playerId) {
      socket.emit('error', 'Not in a game');
      return;
    }

    const game = gameManager.getGame(gameId);
    if (!game) {
      socket.emit('error', 'Game not found');
      return;
    }

    try {
      game.executeNightAction({
        ...action,
        playerId,
        turn: game.getGameState().turn
      });
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to execute action');
    }
  }

  private handleVote(socket: Socket, targetId: string): void {
    const { gameId, playerId } = socket.data;
    if (!gameId || !playerId) {
      socket.emit('error', 'Not in a game');
      return;
    }

    const game = gameManager.getGame(gameId);
    if (!game) {
      socket.emit('error', 'Game not found');
      return;
    }

    try {
      game.castVote(playerId, targetId);
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to vote');
    }
  }

  private handleSendMessage(socket: Socket, content: string): void {
    const { gameId, playerId } = socket.data;
    if (!gameId || !playerId) {
      socket.emit('error', 'Not in a game');
      return;
    }

    const game = gameManager.getGame(gameId);
    if (!game) {
      socket.emit('error', 'Game not found');
      return;
    }

    const player = game.getPlayer(playerId);
    if (!player || player.status !== 'alive') {
      socket.emit('error', 'Cannot send message');
      return;
    }

    const message: ChatMessage = {
      id: uuidv4(),
      playerId,
      content,
      timestamp: new Date(),
      phase: game.getGameState().phase,
      turn: game.getGameState().turn
    };

    this.io.to(gameId).emit('chatMessage', message);
  }
}