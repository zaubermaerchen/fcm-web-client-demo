# FCM Push Notification Web Client

## 概要
Firebase Cloud Messaging (FCM) からプッシュ通知を受け取るWebページを、Vite + TypeScript (vanilla) で構築する。

## 技術スタック
- **ビルドツール**: Vite
- **言語**: TypeScript（フレームワークなし）
- **Firebase SDK**: firebase (v9+ modular API)
- **通知**: ブラウザネイティブ通知 (Notification API)

## アーキテクチャ
```
fcm-client/
├── index.html                  # メインHTML
├── src/
│   ├── main.ts                 # エントリポイント（Firebase初期化 + トークン取得）
│   ├── firebase.ts             # Firebase設定・初期化
│   └── vite-env.d.ts           # Vite環境変数の型定義
├── public/
│   └── firebase-messaging-sw.js  # Service Worker（バックグラウンド通知受信）
├── .env.example                # 環境変数テンプレート
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 実装プラン

### Phase 1: プロジェクトセットアップ
- [ ] Vite + TypeScript (vanilla-ts) でプロジェクトを初期化
- [ ] Firebase SDK (`firebase`) をインストール
- [ ] `.gitignore` に `.env` を追加
- [ ] `.env.example` を作成（Firebase設定のテンプレート）

### Phase 2: Firebase設定
- [ ] `src/vite-env.d.ts` に `ImportMetaEnv` の型定義を追加
- [ ] `src/firebase.ts` を作成
  - `import.meta.env` から Firebase 設定を読み込み
  - `initializeApp()` で Firebase を初期化
  - `getMessaging()` で Messaging インスタンスを取得・エクスポート

### Phase 3: FCMトークン取得 & 通知処理
- [ ] `src/main.ts` を作成
  - 通知権限のリクエスト (`Notification.requestPermission()`)
  - FCMトークンの取得 (`getToken()`) → **コンソールログに出力**
  - フォアグラウンドメッセージの受信処理 (`onMessage()`)
  - UIにトークン取得状態を表示
- [ ] `index.html` を作成
  - トークン取得ボタンとステータス表示

### Phase 4: Service Worker
- [ ] `public/firebase-messaging-sw.js` を作成
  - Firebase Messaging の Service Worker（バックグラウンド通知受信用）
  - `importScripts()` で Firebase SDK を読み込み
  - `onBackgroundMessage()` でバックグラウンド通知を処理

### Phase 5: Vite設定 & 動作確認
- [ ] `vite.config.ts` を設定（必要に応じて）
- [ ] ビルド・開発サーバーの動作確認

## 環境変数（.env）
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
```

## 備考
- Viteでは `VITE_` プレフィックス付きの環境変数のみクライアントに公開される
- Service Worker は `public/` に配置し、ビルド時にそのままコピーされる
- Service Worker内では `import.meta.env` が使えないため、Firebase設定はCDN版SDKの `importScripts()` + 直接値で設定する（またはビルド時に注入）
