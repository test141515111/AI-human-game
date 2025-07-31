export type GamePhase = 'night' | 'day_report' | 'day_discussion' | 'day_vote' | 'execution';

export type PlayerStatus = 'alive' | 'dead';

export type Faction = 'human' | 'ai' | 'third';

export type RoleName = 
  | 'engineer'
  | 'cyber_guard'
  | 'citizen'
  | 'ai'
  | 'fake_ai'
  | 'trickster';

export interface Role {
  name: RoleName;
  faction: Faction;
  abilities: string[];
  winCondition: string;
}

export interface Player {
  id: string;
  name: string;
  status: PlayerStatus;
  role?: Role;
  isBot: boolean;
}

export interface GameState {
  id: string;
  phase: GamePhase;
  turn: number;
  players: Player[];
  nightActions: NightAction[];
  votingResults: VotingResult[];
  winner?: Faction;
  isFinished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NightAction {
  playerId: string;
  targetId: string;
  actionType: 'investigate' | 'protect' | 'attack';
  turn: number;
}

export interface VotingResult {
  voterId: string;
  targetId: string;
  turn: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  content: string;
  timestamp: Date;
  phase: GamePhase;
  turn: number;
}