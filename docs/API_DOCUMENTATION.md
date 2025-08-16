# Project JIN - API Documentation

## 概要

Project JINは2042年を舞台にした次世代AI人狼ゲームです。このドキュメントでは、サーバーAPIとWebSocketイベントの詳細な仕様を説明します。

## サーバー構成

- **Base URL**: `http://localhost:8080`
- **WebSocket**: `ws://localhost:8080`
- **Framework**: Express.js + Socket.IO
- **Language**: TypeScript

## REST API エンドポイント

### 1. Health Check

サーバーの状態確認とアクティブなゲーム数を取得します。

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "activeGames": 2
}
```

### 2. ゲーム作成

新しいゲームセッションを作成します。

```http
POST /api/games
```

**Response:**
```json
{
  "gameId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 3. ゲーム状態取得

指定されたゲームの現在の状態を取得します。

```http
GET /api/games/:gameId
```

**Parameters:**
- `gameId` (string): ゲームの一意識別子

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "phase": "night",
  "turn": 1,
  "players": [
    {
      "id": "player-1",
      "name": "Alice",
      "status": "alive",
      "isBot": false,
      "role": {
        "name": "engineer",
        "faction": "human",
        "abilities": ["investigate"],
        "winCondition": "Eliminate all AI and third faction"
      }
    }
  ],
  "nightActions": [],
  "votingResults": [],
  "isFinished": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Game not found"
}
```

## WebSocket Events

### Client → Server Events

#### 1. ゲーム参加
```typescript
socket.emit('joinGame', {
  gameId: string,
  playerName: string
});
```

#### 2. ゲーム開始
```typescript
socket.emit('startGame', {
  gameId: string
});
```

#### 3. 夜行動実行
```typescript
socket.emit('nightAction', {
  gameId: string,
  playerId: string,
  targetId: string,
  actionType: 'investigate' | 'protect' | 'attack'
});
```

#### 4. 投票
```typescript
socket.emit('vote', {
  gameId: string,
  voterId: string,
  targetId: string
});
```

#### 5. チャットメッセージ送信
```typescript
socket.emit('chatMessage', {
  gameId: string,
  playerId: string,
  content: string
});
```

### Server → Client Events

#### 1. ゲーム状態更新
```typescript
socket.on('gameStateUpdated', (gameState: GameState) => {
  // ゲーム状態の変更時に送信
});
```

#### 2. プレイヤー参加通知
```typescript
socket.on('playerJoined', {
  player: Player,
  gameId: string
});
```

#### 3. プレイヤー退出通知
```typescript
socket.on('playerLeft', {
  playerId: string,
  gameId: string
});
```

#### 4. チャットメッセージ受信
```typescript
socket.on('newChatMessage', (message: ChatMessage) => {
  // 新しいメッセージの受信時
});
```

#### 5. フェーズ変更通知
```typescript
socket.on('phaseChanged', {
  phase: GamePhase,
  turn: number,
  gameId: string
});
```

#### 6. 夜行動結果
```typescript
socket.on('nightActionResult', {
  casualties: string[], // 死亡したプレイヤーID
  investigations: Array<{
    investigatorId: string,
    targetId: string,
    result: 'AI' | 'Not AI'
  }>
});
```

#### 7. 投票結果
```typescript
socket.on('votingResult', {
  results: Array<{
    playerId: string,
    votes: number
  }>,
  eliminated?: string // 追放されたプレイヤーID
});
```

#### 8. ゲーム終了
```typescript
socket.on('gameEnded', {
  winner: Faction,
  gameId: string
});
```

#### 9. エラー通知
```typescript
socket.on('error', {
  message: string,
  code?: string
});
```

## データ型定義

### GamePhase
```typescript
type GamePhase = 'night' | 'day_report' | 'day_discussion' | 'day_vote' | 'execution';
```

### Faction
```typescript
type Faction = 'human' | 'ai' | 'third';
```

### RoleName
```typescript
type RoleName = 
  | 'engineer'      // エンジニア (調査能力)
  | 'cyber_guard'   // サイバーガード (護衛能力)
  | 'citizen'       // 市民 (能力なし)
  | 'ai'           // AI (襲撃能力)
  | 'fake_ai'      // 偽AI (AI陣営だが襲撃不可)
  | 'trickster';   // トリックスター (第三陣営)
```

### Player
```typescript
interface Player {
  id: string;
  name: string;
  status: 'alive' | 'dead';
  role?: Role;
  isBot: boolean;
}
```

### Role
```typescript
interface Role {
  name: RoleName;
  faction: Faction;
  abilities: string[];
  winCondition: string;
}
```

### GameState
```typescript
interface GameState {
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
```

## ゲームフロー

1. **ゲーム作成**: `POST /api/games`でゲームを作成
2. **プレイヤー参加**: WebSocket経由で`joinGame`イベント
3. **ゲーム開始**: 十分なプレイヤーが参加したら`startGame`
4. **フェーズ循環**:
   - **Night**: 各役職が能力行使（180秒）
   - **Day Report**: 夜の結果発表（60秒）
   - **Day Discussion**: 自由議論（300秒）
   - **Day Vote**: 投票（90秒）
   - **Execution**: 処刑・勝利判定
5. **ゲーム終了**: いずれかの陣営の勝利条件が満たされた時点

## エラーハンドリング

### HTTP エラー
- `404`: ゲームが見つからない
- `400`: 無効なリクエスト

### WebSocket エラー
- `INVALID_GAME_ID`: 無効なゲームID
- `PLAYER_NOT_FOUND`: プレイヤーが見つからない
- `INVALID_PHASE`: 不正なフェーズでのアクション
- `ALREADY_DEAD`: 死亡したプレイヤーのアクション
- `INSUFFICIENT_PLAYERS`: プレイヤー数不足

## CORS設定

開発環境では以下のオリジンが許可されています：
- `http://localhost:3000`
- `http://localhost:3001`

本番環境では環境変数`CORS_ORIGIN`で設定可能です。