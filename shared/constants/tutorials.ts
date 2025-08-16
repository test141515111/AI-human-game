import { Tutorial } from '../types/tutorial';

export const TUTORIALS: Record<string, Tutorial> = {
  gameBasics: {
    id: 'gameBasics',
    title: 'Project JIN 基本ガイド',
    description: 'AI人狼ゲームの基本的な流れを学びましょう',
    category: 'basics',
    steps: [
      {
        id: 'welcome',
        title: 'Project JINへようこそ！',
        content: `
          <div class="space-y-3">
            <p><strong>「最後に信じるのは、人間の直感か、AIの論理か。」</strong></p>
            <p>西暦2042年を舞台にした次世代人狼ゲームです。</p>
            <p>あなたは人間として、AIとの心理戦に挑みます。</p>
          </div>
        `,
        position: 'center',
        showNext: true,
        showSkip: true
      },
      {
        id: 'gameFlow',
        title: 'ゲームの流れ',
        content: `
          <div class="space-y-3">
            <p>ゲームは以下の5つのフェーズを繰り返します：</p>
            <ol class="list-decimal list-inside space-y-2">
              <li><strong>夜フェーズ</strong> - 各役職が特殊能力を使用</li>
              <li><strong>朝フェーズ</strong> - 夜の結果を発表</li>
              <li><strong>昼フェーズ</strong> - 全員で議論</li>
              <li><strong>投票フェーズ</strong> - 怪しい人に投票</li>
              <li><strong>処刑フェーズ</strong> - 結果発表と勝利判定</li>
            </ol>
          </div>
        `,
        position: 'center',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'playerList',
        title: 'プレイヤー一覧',
        content: `
          <div class="space-y-3">
            <p>右側のプレイヤー一覧で参加者を確認できます。</p>
            <ul class="list-disc list-inside space-y-1">
              <li>🟢 緑色：生存中</li>
              <li>🔴 赤色：死亡</li>
              <li>BOTタグ：AIプレイヤー</li>
            </ul>
            <p>死亡したプレイヤーには取り消し線が表示されます。</p>
          </div>
        `,
        targetElement: '.player-list',
        position: 'left',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'phaseDisplay',
        title: 'フェーズ表示',
        content: `
          <div class="space-y-3">
            <p>現在のゲームフェーズとターン数がここに表示されます。</p>
            <p>各フェーズには制限時間があり、時間内に行動する必要があります。</p>
          </div>
        `,
        targetElement: '.phase-display',
        position: 'bottom',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'gameControls',
        title: 'ゲーム操作',
        content: `
          <div class="space-y-3">
            <p>フェーズに応じて操作パネルが変化します：</p>
            <ul class="list-disc list-inside space-y-1">
              <li><strong>夜フェーズ</strong>：役職の特殊能力を使用</li>
              <li><strong>投票フェーズ</strong>：怪しいプレイヤーに投票</li>
            </ul>
          </div>
        `,
        targetElement: '.game-controls',
        position: 'top',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'chat',
        title: 'チャット機能',
        content: `
          <div class="space-y-3">
            <p>昼フェーズでは他のプレイヤーと議論できます。</p>
            <p>情報を共有し、怪しい人を見つけ出しましょう。</p>
            <p><em>※ 夜フェーズでは一般的にチャットは制限されます</em></p>
          </div>
        `,
        targetElement: '.chat-box',
        position: 'top',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'ready',
        title: 'ゲーム開始の準備完了！',
        content: `
          <div class="space-y-3">
            <p>基本的な操作方法を覚えました！</p>
            <p>役職についてもっと知りたい場合は「役職ガイド」を確認してください。</p>
            <p>それでは、心理戦を楽しみましょう！</p>
          </div>
        `,
        position: 'center',
        showPrev: true
      }
    ]
  },

  rolesGuide: {
    id: 'rolesGuide',
    title: '役職ガイド',
    description: 'Project JINの役職システムを詳しく学びましょう',
    category: 'roles',
    steps: [
      {
        id: 'factionsOverview',
        title: '陣営について',
        content: `
          <div class="space-y-3">
            <p>Project JINには3つの陣営があります：</p>
            <div class="grid grid-cols-1 gap-3">
              <div class="bg-blue-600 p-3 rounded">
                <h4 class="font-bold">人間陣営</h4>
                <p>AIを見つけ出して排除することが目標</p>
              </div>
              <div class="bg-red-600 p-3 rounded">
                <h4 class="font-bold">AI陣営</h4>
                <p>人間を襲撃して数を減らすことが目標</p>
              </div>
              <div class="bg-purple-600 p-3 rounded">
                <h4 class="font-bold">第三陣営</h4>
                <p>独自の勝利条件を持つ</p>
              </div>
            </div>
          </div>
        `,
        position: 'center',
        showNext: true,
        showSkip: true
      },
      {
        id: 'humanRoles',
        title: '人間陣営の役職',
        content: `
          <div class="space-y-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h4 class="font-bold text-blue-400">🔍 エンジニア</h4>
              <p>夜にプレイヤーを調査し、AIかどうかを判定できます。</p>
              <p class="text-sm text-gray-400">※調査結果は「AI」または「AIではない」で表示</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="font-bold text-green-400">🛡️ サイバーガード</h4>
              <p>夜にプレイヤーを護衛し、AIの攻撃から守ることができます。</p>
              <p class="text-sm text-gray-400">※同じ人を連続で護衛することはできません</p>
            </div>
            <div class="border-l-4 border-gray-500 pl-4">
              <h4 class="font-bold text-gray-400">👤 市民</h4>
              <p>特殊能力はありませんが、議論と投票で貢献します。</p>
              <p class="text-sm text-gray-400">※人数が多い重要な役職です</p>
            </div>
          </div>
        `,
        position: 'center',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'aiRoles',
        title: 'AI陣営の役職',
        content: `
          <div class="space-y-4">
            <div class="border-l-4 border-red-500 pl-4">
              <h4 class="font-bold text-red-400">🤖 AI</h4>
              <p>夜にプレイヤーを襲撃できます。AI同士は互いを認識できます。</p>
              <p class="text-sm text-gray-400">※夜フェーズでAI専用チャットが使えます</p>
            </div>
            <div class="border-l-4 border-orange-500 pl-4">
              <h4 class="font-bold text-orange-400">🎭 偽AI</h4>
              <p>人間ですがAI陣営として扱われます。襲撃能力はありません。</p>
              <p class="text-sm text-gray-400">※エンジニアの調査では「AIではない」と判定されます</p>
            </div>
          </div>
        `,
        position: 'center',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'thirdFaction',
        title: '第三陣営の役職',
        content: `
          <div class="space-y-4">
            <div class="border-l-4 border-purple-500 pl-4">
              <h4 class="font-bold text-purple-400">🃏 トリックスター</h4>
              <p>独自の勝利条件を持つ特殊な役職です。</p>
              <p>状況に応じて人間・AI陣営どちらにも協力できます。</p>
              <p class="text-sm text-gray-400">※具体的な勝利条件はゲーム開始時に通知されます</p>
            </div>
          </div>
        `,
        position: 'center',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'winConditions',
        title: '勝利条件',
        content: `
          <div class="space-y-3">
            <h4 class="font-bold mb-3">各陣営の勝利条件：</h4>
            <div class="space-y-3">
              <div class="bg-blue-900 p-3 rounded">
                <h5 class="font-bold text-blue-300">人間陣営の勝利</h5>
                <p>すべてのAI陣営と第三陣営を排除する</p>
              </div>
              <div class="bg-red-900 p-3 rounded">
                <h5 class="font-bold text-red-300">AI陣営の勝利</h5>
                <p>人間陣営の数をAI陣営以下にする</p>
              </div>
              <div class="bg-purple-900 p-3 rounded">
                <h5 class="font-bold text-purple-300">第三陣営の勝利</h5>
                <p>役職固有の条件を満たす</p>
              </div>
            </div>
          </div>
        `,
        position: 'center',
        showPrev: true
      }
    ]
  },

  gameplayTips: {
    id: 'gameplayTips',
    title: 'ゲームプレイのコツ',
    description: '勝利に向けた戦略とテクニックを学びましょう',
    category: 'gameplay',
    steps: [
      {
        id: 'observationTips',
        title: '観察のポイント',
        content: `
          <div class="space-y-3">
            <h4 class="font-bold mb-2">相手を見抜くヒント：</h4>
            <ul class="list-disc list-inside space-y-2">
              <li><strong>発言の一貫性</strong> - 言動に矛盾はないか？</li>
              <li><strong>情報の出し方</strong> - 有益な情報を提供しているか？</li>
              <li><strong>投票行動</strong> - 投票の理由は妥当か？</li>
              <li><strong>反応の速さ</strong> - AIは論理的すぎることがある</li>
              <li><strong>感情表現</strong> - 人間らしい感情があるか？</li>
            </ul>
          </div>
        `,
        position: 'center',
        showNext: true,
        showSkip: true
      },
      {
        id: 'communicationTips',
        title: 'コミュニケーション戦略',
        content: `
          <div class="space-y-3">
            <h4 class="font-bold mb-2">効果的な議論のコツ：</h4>
            <ul class="list-disc list-inside space-y-2">
              <li><strong>情報共有</strong> - 持っている情報は積極的に共有</li>
              <li><strong>質問する</strong> - 相手の正体を探る質問を投げかける</li>
              <li><strong>理由を述べる</strong> - 疑いや擁護には必ず根拠を</li>
              <li><strong>冷静さを保つ</strong> - 感情的になりすぎないよう注意</li>
              <li><strong>時間を意識</strong> - 制限時間内に重要な議論を</li>
            </ul>
          </div>
        `,
        position: 'center',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'votingStrategy',
        title: '投票戦略',
        content: `
          <div class="space-y-3">
            <h4 class="font-bold mb-2">賢い投票のコツ：</h4>
            <ul class="list-disc list-inside space-y-2">
              <li><strong>情報を整理</strong> - 議論で得た情報を整理してから投票</li>
              <li><strong>多数派を意識</strong> - 票が割れると混乱の原因に</li>
              <li><strong>グレーを吊る</strong> - 確実に怪しい人から排除</li>
              <li><strong>役職を守る</strong> - エンジニアなど重要な役職は保護</li>
              <li><strong>時間ギリギリまで考える</strong> - 最後まで情報収集</li>
            </ul>
          </div>
        `,
        position: 'center',
        showNext: true,
        showPrev: true,
        showSkip: true
      },
      {
        id: 'mindGames',
        title: '心理戦のテクニック',
        content: `
          <div class="space-y-3">
            <h4 class="font-bold mb-2">2042年の心理戦：</h4>
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded">
              <p class="mb-2"><strong>人間の強み：</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li>直感と勘による判断</li>
                <li>感情的な反応と共感</li>
                <li>非論理的だが的確な洞察</li>
              </ul>
            </div>
            <div class="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded">
              <p class="mb-2"><strong>AIの特徴：</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li>論理的で一貫した思考</li>
                <li>データに基づく判断</li>
                <li>感情の起伏が少ない</li>
              </ul>
            </div>
          </div>
        `,
        position: 'center',
        showPrev: true
      }
    ]
  }
};

export const TUTORIAL_CATEGORIES = {
  basics: { name: '基本操作', icon: '📚', color: 'blue' },
  roles: { name: '役職システム', icon: '🎭', color: 'purple' },
  gameplay: { name: 'ゲームプレイ', icon: '🎯', color: 'green' },
  advanced: { name: '上級テクニック', icon: '⚡', color: 'yellow' }
} as const;