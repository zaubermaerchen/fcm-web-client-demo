# AGENTS.md

> このリポジトリで作業するAIコーディングエージェント向けの指示書。

## プロジェクト概要

Firebase Cloud Messaging (FCM) プッシュ通知Webクライアント。素のTypeScript + Vite構成（UIフレームワークなし）。UIテキストやエラーメッセージは日本語で記述されている。コードベースは小規模（`src/` 内に約4ファイル）。

**技術スタック:** TypeScript 5.9, Vite 7, Firebase SDK 10（モジュラーAPI）, ES Modules。

## ビルド / 開発 / テスト コマンド

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動（.env から Firebase 設定を自動生成）
npm run dev

# 型チェック + 本番ビルド
npm run build

# 型チェックのみ（出力なし）
npx tsc --noEmit

# 本番ビルドのプレビュー
npm run preview

# public/firebase-config.js を .env から手動で再生成
npm run generate:firebase-config
```

### テスト

テストフレームワークは未導入。テストファイルも存在しない。将来テストを追加する場合、Viteツールチェーンとの親和性からVitestが自然な選択となる。

### リンター / フォーマッター

リンターやフォーマッターは未導入。唯一の静的解析はTypeScriptの厳格コンパイラ（`tsc`）のみ。型エラーの確認には `npx tsc --noEmit` を実行する。

## 環境変数

`.env.example` を `.env` にコピーし、Firebaseプロジェクトの値を設定する。すべての変数には `VITE_` プレフィックスが付く。`predev`/`prebuild` スクリプトが `.env` から `public/firebase-config.js` を自動生成し、Service Workerが実行時にFirebase設定にアクセスできるようにしている。

**`.env` と `public/firebase-config.js` は絶対にコミットしないこと** — 両方とも gitignore に登録済み。

## コードスタイルガイドライン

### フォーマット

- **セミコロンなし**（ASIに依存）
- **シングルクォート**をすべての文字列に使用
- 関数引数やオブジェクトリテラルに**末尾カンマなし**
- **2スペースインデント**（ソースファイルから推定）
- Prettier/Biome/ESLint は未導入。既存のスタイルに手動で合わせること

### インポート

1. 副作用インポートを最初に記述（例: `import './style.css'`）
2. ローカルモジュールのインポート（例: `import { foo } from './firebase'`）
3. サードパーティパッケージのインポート（例: `import { getToken } from 'firebase/messaging'`）

**型インポートにはインライン `type` キーワードを使用すること** — tsconfig の `verbatimModuleSyntax: true` により強制される:

```ts
// 正しい
import { getToken, type MessagePayload } from 'firebase/messaging'

// 間違い — コンパイルエラーになる
import type { MessagePayload } from 'firebase/messaging'  // 分離した型専用インポート
import { MessagePayload } from 'firebase/messaging'        // type 修飾子の欠落
```

**名前付きインポートのみ**を使用する。このコードベースにデフォルトエクスポートは存在しない。

### TypeScript

- **Strict モード**が有効。追加チェックあり: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **`erasableSyntaxOnly: true`** — enum、namespace、パラメータプロパティ、その他のTypeScript固有のランタイム構文は使用禁止。コンパイル時に消去可能な型アノテーションのみ許可。enumの代わりにプレーンオブジェクトやユニオン型を使用すること。
- **`any` は禁止** — コードベースに `any` 型は一切存在しない。この状態を維持すること
- ターゲットは **ES2022** — モダンな構文（トップレベルawait、`.at()` など）は使用可
- 関数パラメータには明示的な型アノテーションを付ける。単純な関数の戻り値型は推論に任せてよいが、エクスポートされた非同期関数には明示的にアノテーションを付けること
- 明示的な不在には `undefined` ではなく `null` を使用し、`Type | null` として宣言する

### 命名規則

| 要素               | 規則         | 例                               |
| ------------------ | ------------ | -------------------------------- |
| 変数               | `camelCase`  | `messagingPromise`               |
| 関数               | `camelCase`  | `getMessagingInstance`            |
| DOM要素の参照       | `camelCase` + `El` 接尾辞 | `statusEl`, `buttonEl` |
| インターフェース / 型 | `PascalCase` | `ImportMetaEnv`                |
| ファイル            | `kebab-case` | `firebase-messaging-sw.js`       |
| 定数               | `camelCase`  | （SCREAMING_SNAKE_CASE は不可）   |

### 関数

- `const` に代入した**アロー関数**を優先: `const fn = () => { ... }`
- `function` 宣言はホイスティングが必要な場合のみ使用
- 関数はデフォルトでモジュールプライベートとし、他のモジュールで必要なものだけを `export` する

### エラーハンドリング

- try/catch ブロックではなく **Promise の `.catch()` チェーン**を使用
- 標準の `Error` インスタンスをスロー: `throw new Error('メッセージ')`
- `.message` にアクセスする前に、不明なエラー型を必ずガードする:
  ```ts
  error instanceof Error ? error.message : String(error)
  ```
- クリーンアップ（ボタンの再有効化など）には `.finally()` を使用
- ネストした if/else ではなく **早期リターンのガード節**を null チェックに使用
- エラーメッセージは**日本語**で記述

### Null安全性

- **オプショナルチェーン**（`?.`）と **Null合体演算子**（`??`）を使用
- フォールバック値には `||` より `??` を優先
- 要素が見つからない可能性のあるDOMクエリには `as Type | null` を使用
- 必須のDOM要素はモジュールのトップレベルでバリデーションし、見つからない場合はスローする

### コメント

- コードベースにはほぼコメントがない — 説明的な命名によりコードが自己文書化されている
- 不要なコメントは追加しない。ロジックが非自明な場合のみ追加する
- JSDoc は使用しない

### エクスポート

- **名前付きエクスポートのみ** — デフォルトエクスポートは使用しない
- プライベートなヘルパーはモジュールスコープにエクスポートせずに保持する

## アーキテクチャ概要

- `src/main.ts` — アプリのエントリーポイント: DOM設定、トークン取得、フォアグラウンドメッセージリスナー
- `src/firebase.ts` — Firebaseの初期化、メッセージングインスタンス（遅延シングルトン）、VAPIDキーアクセス
- `src/vite-env.d.ts` — `import.meta.env` 変数の型宣言
- `public/firebase-messaging-sw.js` — バックグラウンド通知用Service Worker（素のJS、`importScripts` を使用）
- `scripts/generate-firebase-config.cjs` — `.env` を読み取り `public/firebase-config.js` を書き出すCommonJSビルドスクリプト
- `src/counter.ts` — Viteスキャフォールドテンプレートの未使用の残骸（削除可）

## 主要な技術的制約

- Service Worker（`public/firebase-messaging-sw.js`）はViteのモジュールシステムの外で動作するため、`import.meta.env` を使用できない。Firebase設定は `importScripts()` で読み込まれる生成済みの `firebase-config.js` ファイルを通じて注入される。
- `vite.config.ts` は存在しない。プロジェクトはViteのデフォルト設定に依存している。
- プロジェクトは package.json で `"type": "module"` を使用している。設定生成スクリプトは Node.js 互換性のためESMをオプトアウトする `.cjs` 拡張子を使用している。
