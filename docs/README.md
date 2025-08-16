# Project JIN - Documentation

## 📚 ドキュメント一覧

このディレクトリには、Project JIN（AI人狼ゲーム）の包括的なドキュメントが含まれています。

### 📖 利用可能なドキュメント

1. **[API Documentation](./API_DOCUMENTATION.md)** 📡
   - REST APIエンドポイント詳細
   - WebSocketイベント仕様
   - データ型定義
   - エラーハンドリング

2. **[Frontend Architecture](./FRONTEND_ARCHITECTURE.md)** 🌐
   - Reactアプリケーション構造
   - コンポーネント詳細
   - 状態管理（Zustand）
   - ルーティング設計

3. **[Development Guide](./DEVELOPMENT_GUIDE.md)** 🛠️
   - 開発環境セットアップ
   - ビルド手順
   - デバッグ方法
   - トラブルシューティング

4. **[Code Structure](./CODE_STRUCTURE.md)** 🏗️
   - プロジェクト全体構造
   - 各ファイルの詳細説明
   - データフロー図
   - 拡張ポイント

## 🎯 どのドキュメントから読むべきか？

### 👨‍💻 **開発者として参加する場合**
1. [Development Guide](./DEVELOPMENT_GUIDE.md) - 環境構築
2. [Code Structure](./CODE_STRUCTURE.md) - コード理解
3. [API Documentation](./API_DOCUMENTATION.md) - API仕様
4. [Frontend Architecture](./FRONTEND_ARCHITECTURE.md) - UI開発

### 🔧 **API統合を行う場合**
1. [API Documentation](./API_DOCUMENTATION.md) - API仕様
2. [Development Guide](./DEVELOPMENT_GUIDE.md) - 動作確認方法

### 🎨 **UI/UX改善に取り組む場合**
1. [Frontend Architecture](./FRONTEND_ARCHITECTURE.md) - フロントエンド構造
2. [Code Structure](./CODE_STRUCTURE.md) - コンポーネント設計
3. [Development Guide](./DEVELOPMENT_GUIDE.md) - 開発環境

### 📊 **プロジェクト概要を知りたい場合**
1. [Code Structure](./CODE_STRUCTURE.md) - 全体像
2. [API Documentation](./API_DOCUMENTATION.md) - 機能仕様

## 🚀 クイックスタート

最速で開発を始めたい場合：

```bash
# 1. リポジトリをクローン
git clone https://github.com/test141515111/AI-human-game.git
cd AI-human-game

# 2. 依存関係をインストール
npm install

# 3. 共有ライブラリをビルド
npm run build:shared

# 4. 開発サーバーを起動
npm run dev
```

詳細は [Development Guide](./DEVELOPMENT_GUIDE.md) を参照してください。

## 🎮 Project JIN について

**「最後に信じるのは、人間の直感か、AIの論理か。」**

Project JINは2042年を舞台にした次世代AI人狼ゲームです。プレイヤーは人間とAIに分かれて疑心暗鬼の心理戦を繰り広げます。

### 主要技術スタック
- **Backend**: Node.js + Express + Socket.IO + TypeScript
- **Frontend**: React + Vite + Tailwind CSS + TypeScript  
- **Communication**: WebSocket (Socket.IO)
- **State Management**: Zustand
- **Build**: monorepo (server/client/shared)

### ゲーム特徴
- **リアルタイム対戦**: WebSocketによる即座の状態同期
- **役職システム**: エンジニア、サイバーガード、AI、トリックスターなど
- **フェーズ進行**: 夜→朝→昼→投票→処刑の5段階
- **心理戦**: 人間の直感 vs AIの論理的思考

## 📞 サポート・貢献

### 🐛 バグレポート
GitHubのIssuesでバグを報告してください。

### 💡 機能提案
新機能のアイデアがあればDiscussionsで共有してください。

### 🤝 コントリビューション
1. このリポジトリをFork
2. 機能ブランチを作成
3. 変更をコミット
4. Pull Requestを作成

### 📧 連絡先
プロジェクトに関する質問は、GitHubのIssuesまたはDiscussionsをご利用ください。

---

**Happy Gaming! 🎭**