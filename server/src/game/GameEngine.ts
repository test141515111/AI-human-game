import { 
  GameState, 
  Player, 
  GamePhase, 
  NightAction, 
  VotingResult,
  Faction,
  RoleName
} from '@project-jin/shared';
import { ROLES, GAME_CONFIG } from '@project-jin/shared';
import { v4 as uuidv4 } from 'uuid';

export class GameEngine {
  private gameState: GameState;
  private phaseTimer: NodeJS.Timeout | null = null;
  private phaseCallbacks: Map<GamePhase, () => void> = new Map();

  constructor(gameId: string) {
    this.gameState = {
      id: gameId,
      phase: 'night',
      turn: 1,
      players: [],
      nightActions: [],
      votingResults: [],
      isFinished: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  addPlayer(name: string, isBot: boolean = false): Player {
    const player: Player = {
      id: uuidv4(),
      name,
      status: 'alive',
      isBot
    };
    this.gameState.players.push(player);
    this.gameState.updatedAt = new Date();
    return player;
  }

  removePlayer(playerId: string): void {
    this.gameState.players = this.gameState.players.filter(p => p.id !== playerId);
    this.gameState.updatedAt = new Date();
  }

  canStartGame(): boolean {
    const playerCount = this.gameState.players.length;
    return playerCount >= GAME_CONFIG.minPlayers && playerCount <= GAME_CONFIG.maxPlayers;
  }

  startGame(): void {
    if (!this.canStartGame()) {
      throw new Error('Invalid player count');
    }

    this.assignRoles();
    this.gameState.phase = 'night';
    this.gameState.turn = 1;
    this.startPhaseTimer();
  }

  private assignRoles(): void {
    const playerCount = this.gameState.players.length;
    const distribution = GAME_CONFIG.roleDistribution[playerCount as keyof typeof GAME_CONFIG.roleDistribution];
    
    if (!distribution) {
      throw new Error(`No role distribution for ${playerCount} players`);
    }

    const rolePool: RoleName[] = [];
    for (const [roleName, count] of Object.entries(distribution)) {
      for (let i = 0; i < count; i++) {
        rolePool.push(roleName as RoleName);
      }
    }

    const shuffledRoles = this.shuffle(rolePool);
    this.gameState.players.forEach((player, index) => {
      player.role = ROLES[shuffledRoles[index]];
    });
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  executeNightAction(action: NightAction): void {
    if (this.gameState.phase !== 'night') {
      throw new Error('Night actions can only be performed during night phase');
    }

    const player = this.getPlayer(action.playerId);
    if (!player || player.status !== 'alive') {
      throw new Error('Invalid player or player is dead');
    }

    this.gameState.nightActions.push({
      ...action,
      turn: this.gameState.turn
    });
  }

  processNightActions(): string[] {
    const casualties: string[] = [];
    const protectedPlayers = new Set<string>();

    const protectActions = this.gameState.nightActions.filter(
      action => action.actionType === 'protect' && action.turn === this.gameState.turn
    );
    protectActions.forEach(action => {
      protectedPlayers.add(action.targetId);
    });

    const attackActions = this.gameState.nightActions.filter(
      action => action.actionType === 'attack' && action.turn === this.gameState.turn
    );
    
    attackActions.forEach(action => {
      if (!protectedPlayers.has(action.targetId)) {
        const target = this.getPlayer(action.targetId);
        if (target && target.status === 'alive') {
          target.status = 'dead';
          casualties.push(action.targetId);
        }
      }
    });

    return casualties;
  }

  castVote(voterId: string, targetId: string): void {
    if (this.gameState.phase !== 'day_vote') {
      throw new Error('Voting can only be done during vote phase');
    }

    const voter = this.getPlayer(voterId);
    if (!voter || voter.status !== 'alive') {
      throw new Error('Invalid voter or voter is dead');
    }

    const existingVote = this.gameState.votingResults.find(
      v => v.voterId === voterId && v.turn === this.gameState.turn
    );

    if (existingVote) {
      existingVote.targetId = targetId;
    } else {
      this.gameState.votingResults.push({
        voterId,
        targetId,
        turn: this.gameState.turn
      });
    }
  }

  processVotes(): { playerId: string; votes: number }[] {
    const currentVotes = this.gameState.votingResults.filter(
      v => v.turn === this.gameState.turn
    );

    const voteCount = new Map<string, number>();
    currentVotes.forEach(vote => {
      voteCount.set(vote.targetId, (voteCount.get(vote.targetId) || 0) + 1);
    });

    const results = Array.from(voteCount.entries())
      .map(([playerId, votes]) => ({ playerId, votes }))
      .sort((a, b) => b.votes - a.votes);

    if (results.length > 0 && results[0].votes > 0) {
      const maxVotes = results[0].votes;
      const topVoted = results.filter(r => r.votes === maxVotes);
      
      if (topVoted.length === 1) {
        const eliminatedPlayer = this.getPlayer(topVoted[0].playerId);
        if (eliminatedPlayer) {
          eliminatedPlayer.status = 'dead';
        }
      }
    }

    return results;
  }

  checkWinCondition(): Faction | null {
    const alivePlayers = this.gameState.players.filter(p => p.status === 'alive');
    const humanCount = alivePlayers.filter(p => p.role?.faction === 'human').length;
    const aiCount = alivePlayers.filter(p => p.role?.faction === 'ai').length;
    const thirdCount = alivePlayers.filter(p => p.role?.faction === 'third').length;

    if (aiCount === 0 && thirdCount === 0) {
      return 'human';
    }

    if (humanCount <= aiCount) {
      return 'ai';
    }

    const trickster = alivePlayers.find(p => p.role?.name === 'trickster');
    if (trickster && alivePlayers.length === 1) {
      return 'third';
    }

    return null;
  }

  advancePhase(): void {
    const phaseOrder: GamePhase[] = ['night', 'day_report', 'day_discussion', 'day_vote', 'execution'];
    const currentIndex = phaseOrder.indexOf(this.gameState.phase);
    const nextIndex = (currentIndex + 1) % phaseOrder.length;
    
    this.gameState.phase = phaseOrder[nextIndex];
    
    if (this.gameState.phase === 'night') {
      this.gameState.turn++;
    }

    this.startPhaseTimer();
    
    const callback = this.phaseCallbacks.get(this.gameState.phase);
    if (callback) {
      callback();
    }
  }

  private startPhaseTimer(): void {
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
    }

    const phaseDurations: Partial<Record<GamePhase, number>> = {
      night: GAME_CONFIG.phases.night.duration * 1000,
      day_report: GAME_CONFIG.phases.day_report.duration * 1000,
      day_discussion: GAME_CONFIG.phases.day_discussion.duration * 1000,
      day_vote: GAME_CONFIG.phases.day_vote.duration * 1000
    };

    const duration = phaseDurations[this.gameState.phase];
    if (duration) {
      this.phaseTimer = setTimeout(() => {
        this.advancePhase();
      }, duration);
    }
  }

  onPhaseChange(phase: GamePhase, callback: () => void): void {
    this.phaseCallbacks.set(phase, callback);
  }

  getPlayer(playerId: string): Player | undefined {
    return this.gameState.players.find(p => p.id === playerId);
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getAlivePlayers(): Player[] {
    return this.gameState.players.filter(p => p.status === 'alive');
  }

  investigatePlayer(investigatorId: string, targetId: string): 'AI' | 'Not AI' | null {
    const investigator = this.getPlayer(investigatorId);
    const target = this.getPlayer(targetId);

    if (!investigator || !target || investigator.role?.name !== 'engineer') {
      return null;
    }

    return target.role?.name === 'ai' ? 'AI' : 'Not AI';
  }

  destroy(): void {
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
    }
  }
}