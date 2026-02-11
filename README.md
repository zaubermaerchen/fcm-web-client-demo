# FCM Web Client Demo

Firebase Cloud Messaging (FCM) を使用したプッシュ通知Webクライアントのデモアプリケーション。

## 前提条件

- Node.js 20 以上
- npm
- Firebaseプロジェクト（Firebase Console で作成済みであること）

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーし、Firebaseプロジェクトの設定値を入力してください。

```bash
cp .env.example .env
```

`.env` ファイルを開き、Firebase Console から取得した値を設定します：

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

`predev` スクリプトが自動的に `.env` から `public/firebase-config.js` を生成します。

### ビルド

型チェックと本番ビルドを実行：

```bash
npm run build
```
