# Project JIN - Frontend Architecture Documentation

## 概要

Project JINのフロントエンドは、React + TypeScript + Viteで構築された現代的なSPAです。リアルタイムゲーム体験を提供するため、Socket.IOでサーバーと通信し、Zustandで状態管理を行っています。

## 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全性の確保
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **Socket.IO Client** - リアルタイム通信
- **Zustand** - 軽量状態管理
- **React Query** - サーバー状態管理
- **React Router DOM** - SPA ルーティング

## プロジェクト構造

```
client/
├── src/
│   ├── components/          # 再利用可能なUIコンポーネント
│   │   ├── ChatBox.tsx     # チャット機能
│   │   ├── GameControls.tsx # ゲーム操作UI
│   │   ├── PhaseDisplay.tsx # フェーズ表示
│   │   └── PlayerList.tsx  # プレイヤー一覧
│   ├── pages/              # ページコンポーネント
│   │   ├── HomePage.tsx    # ホーム画面
│   │   └── GamePage.tsx    # ゲーム画面
│   ├── services/           # 外部API・通信サービス
│   │   ├── api.ts         # REST API クライアント
│   │   └── socket.ts      # Socket.IO クライアント
│   ├── store/             # 状態管理
│   │   └── gameStore.ts   # ゲーム状態ストア
│   ├── App.tsx            # ルートコンポーネント
│   └── main.tsx           # エントリーポイント
├── index.html             # HTMLテンプレート
├── package.json           # 依存関係
├── vite.config.ts        # Vite設定
├── tailwind.config.js    # Tailwind CSS設定
└── tsconfig.json         # TypeScript設定
```

## コンポーネント詳細

### 1. HomePage.tsx
ゲームの開始画面を提供するコンポーネント。

**機能:**
- 新しいゲームの作成
- 既存ゲームへの参加
- プレイヤー名の入力

**主要な状態:**
```typescript
const [isCreating, setIsCreating] = useState(false);
const [gameId, setGameId] = useState('');
const [playerName, setPlayerName] = useState('');
```

**主要な操作:**
- `createGame()` - 新しいゲームを作成してゲーム画面に遷移
- `joinGame()` - 既存のゲームに参加

### 2. GamePage.tsx
メインのゲーム画面コンポーネント。

**機能:**
- WebSocket接続の管理
- ゲーム状態の監視と更新
- 各種イベントハンドラーの登録

**WebSocketイベント:**
- `connect/disconnect` - 接続状態の管理
- `gameState` - ゲーム状態の受信
- `playerJoined/playerLeft` - プレイヤーの参加・退出
- `chatMessage` - チャットメッセージ受信
- `phaseChange` - フェーズ変更通知
- `gameEnd` - ゲーム終了通知

### 3. PlayerList.tsx
参加プレイヤーの一覧表示コンポーネント。

**機能:**
- プレイヤー名と生死状態の表示
- BOTプレイヤーの識別
- 視覚的な状態インジケーター

**表示情報:**
- プレイヤー名
- 生存状態（緑：生存、赤：死亡）
- BOTタグ
- 死亡プレイヤーの打ち消し線

### 4. GameControls.tsx
ゲーム操作UIコンポーネント。フェーズに応じて異なる操作を提供。

**機能:**
- ゲーム開始ボタン（開始前）
- 夜のアクション実行（夜フェーズ）
- 投票実行（投票フェーズ）

**夜のアクション:**
- エンジニア → 調査
- サイバーガード → 護衛
- AI → 襲撃

### 5. PhaseDisplay.tsx
現在のゲームフェーズと残り時間を表示。

**表示情報:**
- 現在のフェーズ名
- ターン数
- フェーズタイマー（予定）

### 6. ChatBox.tsx
リアルタイムチャット機能コンポーネント。

**機能:**
- メッセージの送受信
- チャット履歴の表示
- フェーズ別メッセージフィルター（予定）

## サービス層

### 1. api.ts - REST APIクライアント
```typescript
export const api = {
  createGame: async () => Promise<{ gameId: string }>,
  getGameState: async (gameId: string) => Promise<GameState>
};
```

**エンドポイント:**
- `POST /api/games` - ゲーム作成
- `GET /api/games/:id` - ゲーム状態取得

### 2. socket.ts - WebSocketクライアント
Socket.IOクライアントのシングルトン実装。

**主要メソッド:**
```typescript
export const socketService = {
  connect: () => Socket,
  disconnect: () => void,
  getSocket: () => Socket | null
};
```

**送信イベント:**
- `joinGame` - ゲーム参加
- `startGame` - ゲーム開始
- `nightAction` - 夜行動
- `vote` - 投票
- `chatMessage` - チャット送信

## 状態管理

### gameStore.ts - Zustandストア
ゲーム全体の状態を管理するメインストア。

```typescript
interface GameStore {
  gameState: GameState | null;      // 現在のゲーム状態
  currentPlayer: Player | null;     // 現在のプレイヤー情報
  messages: ChatMessage[];          // チャットメッセージ履歴
  
  // アクション
  setGameState: (state: GameState) => void;
  setCurrentPlayer: (player: Player) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  reset: () => void;
}
```

**データフロー:**
1. WebSocketでサーバーからイベント受信
2. ストアの状態を更新
3. コンポーネントが自動的に再レンダリング

## ルーティング

React Routerを使用したSPAルーティング。

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/game/:gameId" element={<GamePage />} />
</Routes>
```

**パラメーター:**
- `gameId` - ゲームの一意識別子
- `name` (クエリパラメータ) - プレイヤー名

## スタイリング

### Tailwind CSS
ユーティリティファーストのアプローチで高速開発。

**テーマ設定:**
- **背景**: `bg-gray-900` (ダークテーマ)
- **カード**: `bg-gray-800`
- **テキスト**: `text-white`
- **アクセント**: `blue-600`, `green-600`, `red-600`

**レスポンシブ対応:**
- モバイルファースト設計
- `lg:` プレフィックスでデスクトップレイアウト

## 型定義

共有ライブラリ（`@project-jin/shared`）から型をインポート。

**主要な型:**
```typescript
import { 
  GameState, 
  Player, 
  ChatMessage,
  GamePhase,
  Faction,
  RoleName 
} from '@project-jin/shared';
```

## エラーハンドリング

### 1. 接続エラー
- WebSocket切断時の再接続処理
- ローディング状態の表示

### 2. ゲームエラー
- 不正な操作の防止
- サーバーエラーメッセージの表示

### 3. バリデーション
- 入力値の検証
- 必須フィールドのチェック

## パフォーマンス最適化

### 1. React最適化
- `React.memo()` でコンポーネントの不要な再レンダリング防止
- `useCallback()`, `useMemo()` でコンピューテッドの最適化

### 2. Bundle最適化
- Viteの自動コード分割
- Tree shaking対応

### 3. リアルタイム最適化
- Socket.IOのイベントリスナー適切な登録・解除
- メモリリーク防止

## 開発ツール

### 1. 開発サーバー
```bash
npm run dev  # Vite dev server (port 3001)
```

### 2. ビルド
```bash
npm run build    # 本番ビルド
npm run preview  # ビルド結果のプレビュー
```

### 3. リンティング
```bash
npm run lint  # ESLint実行
```

## 今後の拡張計画

### 1. UI/UX改善
- アニメーションの追加
- サウンドエフェクト
- より豊富な視覚効果

### 2. 機能追加
- リプレイ機能
- 戦績表示
- フレンド機能
- プライベートルーム

### 3. アクセシビリティ
- キーボードナビゲーション
- スクリーンリーダー対応
- 色覚異常対応

## トラブルシューティング

### よくある問題

1. **WebSocket接続エラー**
   - サーバーが起動しているか確認
   - CORS設定を確認

2. **型エラー**
   - 共有ライブラリがビルドされているか確認
   - `npm run build --workspace=shared`

3. **スタイル適用されない**
   - Tailwind CSS設定を確認
   - PostCSS設定を確認