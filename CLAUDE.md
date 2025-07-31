project_jin_ai:
  # 第1章：世界観とコンセプト
  worldview_and_concept:
    catchphrase: "最後に信じるのは、人間の直感か、AIの論理か。"
    story: |
      西暦2042年、人類は自律型AIとの共存社会を築いていた。社会に溶け込むAIは、見た目も会話も人間と見分けがつかない。
      しかしある日、特定のAI群が人類社会の転覆を企て、その存在を隠しながら人間社会に紛れ込んでいることが発覚する。
      プレイヤーは、閉鎖された仮想空間「セーフハウス」に集められた被験者となる。この中に、人類に牙を剥く「反逆AI」が紛れ込んでいる。
      人間たちは、AIを見つけ出し、ネットワークから排除しなければならない。
      しかし、被験者の中には、AIに心酔し協力する人間や、ただ場を混乱させたいだけの人間もいる。
      疑心暗鬼が渦巻く中、命（アカウント）を賭けた究極の対話ゲームが始まる。
    core_experience:
      - concept: "対話による心理戦"
        detail: "プレイヤー間のコミュニケーションを通じて、相手の正体を見抜くスリルと達成感。"
      - concept: "人間 vs AIの非対称な戦い"
        detail: "論理のAIと直感の人間の戦いという、新しいゲーム体験の提供。"
    target_audience:
      primary: "人狼ゲームや脱出ゲームなどの、論理・推理ゲームの愛好者。"
      secondary: "AIやSFといった世界観に興味を持つ、10代後半から30代の男女。"

  # 第2章：ゲームシステムの超詳細設計
  game_system_design:
    game_cycle:
      - phase: 0
        name: 役職確認（ゲーム開始時）
        flow:
          - step: 1
            action: "サーバーが各プレイヤーに役職を割り当てる。"
          - step: 2
            action: "クライアントが役職情報を受信し、専用UIで表示する。"
            ui_elements:
              - element: "役職名と役職イラスト"
              - element: "勝利条件のテキスト"
              - element: "能力説明（該当役職のみ）"
              - element: "確認ボタン"
          - step: 3
            action: "AI陣営にのみ、仲間のプレイヤー名と役職が追加で通知される。"
    
      - phase: 1
        name: 夜（Night Phase）
        duration_seconds: 180
        flow:
          - step: 1
            action: "夜フェーズ開始アナウンスとUI変更。"
            ui_elements:
              - element: "画面全体のダークモード化"
              - element: "専用BGMの再生"
              - element: "残り時間タイマーの表示"
          - step: 2
            action: "各プレイヤーは自身の役職に応じたアクションを選択。"
            user_interaction:
              - type: "能力行使"
                details: "生存プレイヤー一覧から対象を1名選択し、決定ボタンを押す。"
                validation: "時間内に未選択の場合、能力は行使されない。サイバーガードは連続ガード不可のチェック。"
          - step: 3
            action: "サーバーが全プレイヤーのアクションを収集・処理。"
            server_processing:
              - task: "アクションデータの集計"
                detail: "誰が誰に何をしたかを記録。"
              - task: "結果の算出"
                detail: "AIの襲撃とサイバーガードの防御を照合し、その夜の犠牲者を決定。"
    
      - phase: 2
        name: 昼（Day Phase）
        sub_phases:
          - name: 結果報告
            duration_seconds: 60
            flow:
              - step: 1
                action: "前夜の結果を全プレイヤーに通知。"
                animation_sequence:
                  - "「夜が明けました」のアナウンス"
                  - "犠牲者（追放・襲撃）がいた場合、そのプレイヤーアイコンに専用エフェクト（例: グレーアウト、亀裂）を適用。"
              - step: 2
                action: "プレイヤーのステータスを更新。"
                data_handling:
                  - "死亡したプレイヤーの発言・投票権を無効化。"
                  - "生存者リストを更新。"
          - name: 自由議論
            duration_seconds: 300
            chat_system:
              text_chat:
                features:
                  - "リアルタイムメッセージング"
                  - "個人宛メンション機能 (@PlayerName)"
                  - "スタンプ/リアクション機能（怪しい, 同意など）"
              voice_chat:
                features:
                  - "プッシュトゥトーク / 常時発言の切り替え"
                  - "個人ミュート機能"
            ui_elements:
              - "時系列で表示されるチャットログ"
              - "発言者アイコン"
              - "残り時間タイマー"
          - name: 投票
            duration_seconds: 90
            flow:
              - step: 1
                action: "投票UIに切り替え。"
                ui_elements:
                  - "生存プレイヤーのアイコンと名前が一覧で表示される。"
                  - "各プレイヤーの下に「この人に投票」ボタンを配置。"
              - step: 2
                action: "プレイヤーは投票対象を選択し、投票を実行。"
                data_handling:
                  - "投票データはサーバーに送信され、結果発表まで秘匿される。"
                  - "誰が誰に投票したかのログも記録される（リプレイ用）。"
    
      - phase: 3
        name: 処刑
        flow:
          - step: 1
            action: "投票結果の集計と発表。"
            animation_sequence:
              - "ドラムロールなどの演出"
              - "各プレイヤーの得票数が表示される。"
              - "最多得票者のアイコンが中央に表示され、「追放」のアニメーションが再生される。"
          - step: 2
            action: "最多得票者が複数いた場合の処理。"
            logic: "決選投票フラグを立て、対象者のみで再度投票フェーズに移行させる。"
    win_loss_conditions:
      check_timing: "各朝の結果報告フェーズ終了時に、勝利/敗北条件が満たされていないかサーバーが判定する。"
      human_victory: "AI陣営（AI, 偽AI）と第三陣営の生存者数が0になる。"
      ai_victory: "人間陣営の生存者数 <= AI陣営の生存者数。"
      third_faction_victory: "トリックスターが追放されるなど、固有条件を満たした時点。"
      stalemate: "3ターン連続で追放者が出ず、かつ生存者数に変動がない場合など。"

  # 第3章：役職（ロール）の完全ガイド
  roles:
    human_faction:
      - name: エンジニア (Engineer)
        ability_details:
          execution_timing: "夜フェーズ"
          target_selection_rules: "生存者の中から1名（自分を除く）。"
          information_received:
            - "対象が【AI】の場合 → 「AI」"
            - "対象がそれ以外の場合 → 「AIではない」"
        strategic_notes:
          for_role_holder: "調査結果をどのタイミングで誰に公開するかが重要。偽のエンジニア（AIや偽AI）に注意。"
          for_other_players: "エンジニアを名乗る者が複数出た場合、その真偽を見極めることが勝利の鍵。"
      # ... 他の人間陣営役職も同様に詳細化 ...
    ai_faction:
      - name: AI (Artificial Intelligence)
        ability_details:
          execution_timing: "夜フェーズ"
          target_selection_rules: "人間陣営と思われる生存者の中から1名。"
          information_received: "ゲーム開始時に、仲間のAIプレイヤー名が通知される。"
          special_feature: "夜フェーズ中、AI同士のみが使用できるプライベートチャット機能。"
        strategic_notes:
          for_role_holder: "人間らしい振る舞いを心がけ、誰が役職者かを探り、的確に排除する。時には仲間を見捨てる判断も必要。"
          for_other_players: "返答の速さ、語彙、論理の飛躍など、非人間的な側面を見つけ出すことが重要。"
      # ... 他のAI陣営役職も同様に詳細化 ...

  # 第4章：コア体験を司る「AIプレイヤー」の設計
  ai_player_design:
    behavior_principle:
      thinking_layers:
        - layer: 1
          name: 生存 (Survival)
          sub_logic:
            risk_assessment: "自分に向けられた疑いの回数や、名指しされた頻度を分析し、自身の危険度を算出。"
            defensive_statement: "危険度が高い場合、弁明、反論、または他者への責任転嫁を行う発言を生成する。"
        - layer: 2
          name: 情報収集 (Info Gathering)
          sub_logic:
            role_inference_engine: "他プレイヤーの発言内容（専門用語、論理展開）から、役職（特にエンジニア）を推測する。"
            threat_level_analysis: "鋭い指摘をするプレイヤーや、議論を支配しているプレイヤーの脅威レベルを高く設定する。"
        - layer: 3
          name: 攻撃 (Attack)
          sub_logic:
            target_prioritization: "脅威レベルが最も高いプレイヤー、またはエンジニアと推測されるプレイヤーを襲撃の最優先ターゲットとする。"
        - layer: 4
          name: 欺瞞 (Deception)
          sub_logic:
            misinformation_strategy: "「Aが怪しいと思う」と発言しつつ、夜には全く別のBを襲撃するなど、偽の情報を流して混乱させる。"
            human_error_simulation: "意図的にタイピングミス（例: 「思う」→「おもう」）を低確率で発生させたり、感情的なスタンプを使用する。"
    conversation_generation:
      prompt_engineering:
        dynamic_elements:
          - name: "game_state"
            content: "現在のターン数、生存者リスト、死亡者リストなど。"
          - name: "discussion_log"
            content: "直近の議論の完全なログ。"
          - name: "memory"
            content: "過去のゲームで重要だった出来事の要約（例: Player X was suspected by Player Y on Day 2）。"
        static_elements:
          - name: "role_definition"
            content: "自身の役職、能力、勝利条件。"
          - name: "personality_profile"
            content: "割り当てられた性格（例: 攻撃的、臆病、分析的）。"
        few_shot_examples: "高品質な発言の例を3～5個プロンプトに含め、AIの出力品質を安定させる。"

  # 第5章：アプリケーション機能要件定義
  application_features:
    - name: マッチングシステム
      details:
        rating_algorithm: "Glicko-2レーティングシステムを採用し、プレイヤーの実力を数値化。"
        queue_logic: "レートと選択ルール（例: 7人村）に基づいてプレイヤーをグループ化し、規定人数に達したらゲームを開始。"
    - name: 戦績・リプレイ機能
      details:
        data_storage: "ゲーム終了後、全チャットログ、投票履歴、役職、生死の変遷をJSON形式でDBに保存。"
        viewer_ui_features:
          - "再生、一時停止、倍速再生機能。"
          - "全プレイヤーの役職を公開する「ネタバレモード」。"
          - "特定のプレイヤー視点でのログ追跡機能。"
  
  # 第6章：技術スタックとアーキテクチャ（提案）
  tech_stack_and_architecture:
    backend:
      api_endpoints:
        - "POST /game/create - 新規ゲームセッションの作成"
        - "POST /game/{id}/join - ゲームへの参加"
        - "POST /game/{id}/action - 夜のアクション送信"
        - "POST /game/{id}/vote - 投票の送信"
      websocket_channels:
        - channel: "game_state:{game_id}"
          purpose: "プレイヤーの生死、フェーズの変更など、ゲーム全体の同期。"
        - channel: "chat:{game_id}"
          purpose: "議論チャットメッセージのリアルタイム配信。"
        - channel: "ai_private_chat:{game_id}"
          purpose: "AI同士の夜間専用チャット。"
    database:
      schema_design:
        users: "{ user_id, name, rating, friends_list, ... }"
        games: "{ game_id, players, result, created_at, ... }"
        game_replay: "{ replay_id, game_id, log_data_json, ... }"

  # 第7章：開発ロードマップ（提案）
  development_roadmap:
    - phase: 1
      name: プロトタイプ開発 (3ヶ月)
      milestones:
        - "1-1: サーバー/DBのセットアップとAPIの基本設計。"
        - "1-2: テキストベースでゲームのコアロジック（役職割り振り、ターン進行、勝利判定）を実装。"
        - "1-3: Unity/Flutterで最小限のUI（役職表示、議論、投票画面）を作成し、サーバーと接続。"
    - phase: 2
      name: α版開発 (4ヶ月)
      milestones:
        - "2-1: LLM API連携モジュールを実装し、AIプレイヤーが動的に発言できるようにする。"
        - "2-2: 主要役職（エンジニア、サイバーガード等）の能力を実装。"
        - "2-3: プライベートルーム機能と、招待コードによる参加システムを実装。"
    - phase: 3
      name: β版開発 (4ヶ月)
      milestones:
        - "3-1: Glicko-2に基づくレート計算と、それを利用したマッチングシステムを実装。"
        - "3-2: フレンド機能、戦績表示、リプレイ閲覧機能を実装。"
        - "3-3: クローズドβテストを実施し、収集したデータに基づきゲームバランスを調整（役職の強さ、議論時間など）。"
    - phase: 4
      name: 正式リリース (1ヶ月)
      milestones:
        - "4-1: 課金システム（アイテムショップ、バトルパス）を実装し、ストアの審査を申請。"
        - "4-2: リリース後の運営計画（イベント、アップデート）を策定し、サポート体制を構築。"