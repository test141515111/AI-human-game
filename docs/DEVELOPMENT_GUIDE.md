# Project JIN - Development Setup Guide

## 概要

Project JINは次世代AI人狼ゲームです。このガイドでは、開発環境のセットアップから実際の開発フローまでを詳しく説明します。

## 必要な環境

### システム要件
- **Node.js**: 18.0.0 以上
- **npm**: 9.0.0 以上 （または yarn 3.0.0 以上）
- **Git**: バージョン管理用

### 推奨開発環境
- **VSCode** - TypeScript/React開発に最適
- **Chrome DevTools** - WebSocket通信のデバッグ用

## プロジェクト構造

```
AI-human-game/
├── server/           # バックエンドサーバー (Express + Socket.IO)
│   ├── src/
│   │   ├── game/     # ゲームロジック
│   │   ├── websocket/ # WebSocket処理
│   │   └── index.ts  # エントリーポイント
│   └── package.json
├── client/           # フロントエンドアプリ (React + Vite)
│   ├── src/
│   │   ├── components/ # Reactコンポーネント
│   │   ├── pages/     # ページコンポーネント
│   │   ├── services/  # API通信
│   │   └── store/     # 状態管理
│   └── package.json
├── shared/           # 共通型定義・定数
│   ├── types/        # TypeScript型定義
│   ├── constants/    # ゲーム定数
│   └── package.json
└── package.json      # ルートパッケージ
```

## 初期セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/test141515111/AI-human-game.git
cd AI-human-game
```

### 2. 依存関係のインストール
```bash
# ルートとすべてのワークスペースの依存関係をインストール
npm install
```

### 3. 共有ライブラリのビルド
```bash
# 共有パッケージ（型定義）をビルド
npm run build:shared
```

### 4. 環境変数の設定（オプション）
```bash
# サーバー用環境変数（オプション）
cp server/.env.example server/.env
```

**環境変数の内容:**
```env
PORT=8080
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development
```

## 開発サーバーの起動

### 方法1: 一括起動（推奨）
```bash
# サーバーとクライアントを同時に起動
npm run dev
```

これにより以下が同時に実行されます：
- サーバー: http://localhost:8080
- クライアント: http://localhost:3001

### 方法2: 個別起動
```bash
# ターミナル1: サーバー起動
cd server && npm run dev

# ターミナル2: クライアント起動  
cd client && npm run dev
```

### 方法3: PM2を使用（推奨 - プロダクション環境）
```bash
# PM2でサーバーを起動
cd server && pm2 start npm --name "jin-server" -- run dev

# PM2でクライアントを起動
cd client && pm2 start npm --name "jin-client" -- run dev

# PM2プロセス確認
pm2 status

# PM2ログ確認
pm2 logs --nostream
```

## アクセスURL

開発環境での各サービスへのアクセス：

- **🎮 ゲームクライアント**: http://localhost:3001
- **🔧 サーバーAPI**: http://localhost:8080
- **💚 ヘルスチェック**: http://localhost:8080/health

## 開発ワークフロー

### 1. ブランチ戦略
```bash
# メインブランチから新機能ブランチを作成
git checkout main
git pull origin main
git checkout -b feature/new-feature-name

# 開発完了後
git add .
git commit -m "feat: add new feature description"
git push origin feature/new-feature-name

# Pull Requestを作成してレビュー
```

### 2. コーディング規約

#### TypeScript
- 厳密な型定義を使用
- `any`型の使用を避ける
- インターフェースとタイプエイリアスを適切に使い分け

#### React
- 関数コンポーネントを使用
- Hooksを活用
- propsの型定義を必須とする

#### CSS/Tailwind
- ユーティリティクラスを優先
- カスタムCSSは最小限に
- レスポンシブデザインを考慮

### 3. テスト（予定）
```bash
# 全体のテスト実行
npm test

# 個別ワークスペースのテスト
npm test --workspace=server
npm test --workspace=client
```

## デバッグ方法

### 1. サーバーサイドデバッグ
```bash
# サーバーログの確認
cd server && npm run dev

# PM2使用時
pm2 logs jin-server --nostream
```

### 2. クライアントサイドデバッグ
- **React DevTools**: コンポーネントの状態確認
- **Browser DevTools**: Network/WebSocketタブでSocket.IO通信を監視
- **Console**: `console.log`でのデバッグ情報確認

### 3. WebSocket通信のデバッグ
```javascript
// クライアント側でSocket.IOイベントをログ出力
socket.onAny((event, ...args) => {
  console.log('Socket Event:', event, args);
});
```

## ビルドとデプロイ

### 1. 開発ビルド
```bash
# 全体のビルド
npm run build

# 個別ビルド
npm run build --workspace=shared
npm run build --workspace=server  
npm run build --workspace=client
```

### 2. プロダクションビルド
```bash
# プロダクション用ビルド
NODE_ENV=production npm run build
```

### 3. 静的ファイルの確認
```bash
# クライアントのプレビュー
cd client && npm run preview
```

## パッケージ管理

### 新しい依存関係の追加
```bash
# ルートレベルの依存関係
npm install <package-name>

# 特定のワークスペースに追加
npm install <package-name> --workspace=server
npm install <package-name> --workspace=client
npm install <package-name> --workspace=shared
```

### 開発依存関係の追加
```bash
npm install <package-name> --save-dev --workspace=<workspace-name>
```

## トラブルシューティング

### 1. 共通の問題

#### 「shared モジュールが見つからない」エラー
```bash
# 共有ライブラリを再ビルド
npm run build:shared
```

#### ポート競合エラー
```bash
# 使用中のポートを確認
lsof -i :8080
lsof -i :3001

# プロセスを終了
kill -9 <PID>
```

#### WebSocket接続エラー
- サーバーが起動しているか確認
- CORS設定を確認
- プロキシ設定を確認

### 2. キャッシュクリア
```bash
# npm キャッシュクリア
npm cache clean --force

# node_modules 再インストール
rm -rf node_modules */node_modules
npm install
```

### 3. 型エラーの解決
```bash
# TypeScriptコンパイラーで型チェック
cd server && npx tsc --noEmit
cd client && npx tsc --noEmit
cd shared && npx tsc --noEmit
```

## 開発時の便利なコマンド

### 1. リンティング
```bash
# 全体のLint実行
npm run lint

# 自動修正
npm run lint -- --fix
```

### 2. ログ監視
```bash
# PM2ログのリアルタイム監視
pm2 logs

# 特定のサービスのログ
pm2 logs jin-server
pm2 logs jin-client
```

### 3. プロセス管理
```bash
# PM2プロセス一覧
pm2 list

# プロセス再起動
pm2 restart jin-server
pm2 restart jin-client

# プロセス停止
pm2 stop jin-server
pm2 stop jin-client

# PM2全体を停止
pm2 kill
```

## VSCode設定

### 推奨拡張機能
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

### Workspace設定 (.vscode/settings.json)
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.includeCompletionsForModuleExports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## Git Hooks（推奨）

### Pre-commit hook
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run build:shared
```

## パフォーマンス監視

### 1. 開発時の監視
```bash
# バンドルサイズ分析
cd client && npm run build -- --analyze
```

### 2. WebSocket パフォーマンス
- Chrome DevToolsのWebSocketタブで通信量を監視
- メッセージの頻度と量を確認

## セキュリティ考慮事項

### 1. 依存関係の脆弱性チェック
```bash
npm audit
npm audit fix
```

### 2. 環境変数
- 本番環境では機密情報を環境変数で管理
- `.env`ファイルはGitに含めない

### 3. CORS設定
- 本番環境では適切なオリジンのみ許可
- 開発環境でもワイルドカード（`*`）は避ける

## 次のステップ

1. **AI プレイヤーの実装**: OpenAI APIとの統合
2. **データベース統合**: Prisma + PostgreSQLの導入
3. **リプレイ機能**: ゲーム履歴の保存・再生
4. **レーティングシステム**: Glicko-2アルゴリズムの実装
5. **UI/UX改善**: アニメーション・エフェクトの追加

このガイドに従って開発環境をセットアップし、Project JINの開発に参加しましょう！