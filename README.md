# 家計簿アプリ（Kakeibo）

Next.js（App Router）と Dexie（IndexedDB）を使った、ブラウザ内で動作する家計簿アプリです。トップページで全期間・1年間の円グラフを確認し、登録画面で支出を入力、月次レポートで月別分析ができます。

## 画面構成

| ページ | URL | 内容 |
|--------|-----|------|
| トップページ | `/` | 全期間・1年間のジャンル別円グラフ、ドリルダウン |
| 登録 | `/register` | 支出の新規登録 |
| 月次レポート | `/reports` | 月別サマリー・棒グラフ・明細 |

## 技術スタック

| 用途 | 技術 |
|------|------|
| フレームワーク | Next.js 16（App Router） |
| データベース | Dexie（IndexedDB / ブラウザ内保存） |
| グラフ | Recharts |
| リアルタイム更新 | dexie-react-hooks（`useLiveQuery`） |
| スタイル | Tailwind CSS |

## 前提条件

- [Node.js](https://nodejs.org/) 20.9.0 以上
- npm（または yarn / pnpm / bun）

## セットアップ

```bash
# 依存パッケージのインストール
npm install
```

## 実行方法

### 開発サーバー（通常はこちら）

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。ファイルを編集するとホットリロードで反映されます。

### 本番ビルドと起動

```bash
npm run build
npm start
```

### その他のコマンド

```bash
npm run lint   # ESLint によるコードチェック
```

## 使い方

1. **初回起動時**  
   ジャンル（食費・日用品・交通費・その他）と、1年間用・全期間用のテスト支出が自動投入されます。すぐにグラフと詳細表示を確認できます。

2. **トップページ（`/`）**  
   「全期間」「1年間（直近365日）」の2つの円グラフでジャンル別支出を確認できます。扇形をクリックすると、その期間に絞ったジャンル別履歴が表示されます。

3. **支出の登録（`/register`）**  
   ナビゲーションの「登録」から登録画面を開き、日付・金額・ジャンル・変動費/固定費・メモを入力して保存します。

4. **月次レポート（`/reports`）**  
   対象月を選ぶと、合計・変動費/固定費・ジャンル別棒グラフ・明細テーブルが表示されます。

## プロジェクト構成

Feature-based（機能単位）のディレクトリ構成を採用しています。ドメインごとに責務を分離し、機能追加やチーム分担がしやすい形にしています。

```
app/                          # App Router（ルーティング層）
  layout.tsx                  # ルートレイアウト（Server Component）
  page.tsx                    # トップページ（/）
  register/page.tsx           # 支出登録（/register）
  reports/page.tsx            # 月次レポート（/reports）
  globals.css

components/
  app-nav.tsx                 # 共通ナビゲーション

features/kakeibo/             # 家計簿ドメイン
  components/                 # UI コンポーネント
    top-page.tsx              # トップページ（全期間・1年間グラフ）
    expense-register-page.tsx # 支出登録画面
    expense-form.tsx          # 支出入力フォーム
    expense-chart.tsx         # 円グラフ
    expense-history-list.tsx  # ジャンル別履歴リスト
  hooks/                      # カスタムフック（データ購読・初期化）
    use-genres.ts
    use-kakeibo-items.ts
    use-kakeibo-init.ts
  lib/                        # データアクセス層
    db.ts                     # Dexie スキーマ定義
    repository.ts             # CRUD 操作の窓口
    seed.ts                   # 初回データ投入
  types/                      # 型定義
  constants/                  # 定数（ジャンル名・色・ラベル等）
  utils/                      # 純粋関数（フォーマット・集計・日付フィルタ）

features/reports/             # 月次レポートドメイン
  components/
    monthly-report-dashboard.tsx
    month-selector.tsx
    monthly-summary-cards.tsx
    monthly-genre-chart.tsx
    monthly-expense-table.tsx
  hooks/
    use-monthly-report.ts
  types/
  utils/
    monthly-summary.ts
```

### 設計方針

| レイヤー | 役割 |
|----------|------|
| `app/` | ルーティングとページの入口のみ。ビジネスロジックは持たない |
| `features/*/components/` | UI の分割。Client / Server Component を用途に応じて使い分け |
| `features/*/hooks/` | Dexie とのリアクティブなデータ購読、副作用（初期化） |
| `features/*/lib/` | DB スキーマ・Repository パターンでデータ操作を集約 |
| `features/*/types/` | ドメイン型を一箇所で管理 |
| `features/*/utils/` | 副作用のない変換・集計ロジック |

新機能を追加する場合は `features/` 配下に新ドメインを切る（例: `features/settings/`）か、既存ドメイン配下にコンポーネント・hooks を追加します。

## データ構造

スキーマ定義は `features/kakeibo/lib/db.ts`、初回データ投入は `features/kakeibo/lib/seed.ts` で行っています。

### kakeibo（支出履歴）

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | number | 自動採番 ID |
| `date` | string | 日付（`YYYY-MM-DD`） |
| `amount` | number | 金額 |
| `genre_id` | number | ジャンル ID |
| `type` | `'variable' \| 'fixed'` | 変動費 / 固定費 |
| `memo` | string | メモ |

### genres（ジャンル）

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | number | 自動採番 ID |
| `name` | string | ジャンル名 |

### テストデータ（初回起動時）

初回起動時に、ジャンルとサンプルの支出データが投入されます。日付は「今日」からの相対日で設定されます。

**ジャンル:** 食費、日用品、交通費、その他

**1年間用（直近365日以内・7件）:** カフェ、スーパー、洗剤など、電車、家賃、ランチ、日用品まとめ買い

**全期間用の追加分（365日より前・5件）:** 引っ越し前の外食、家具・消耗品、長距離移動、旧家賃、保険料

すでに支出データが存在する場合、初期化処理ではサンプルデータによる置き換えを行いません。

## データの保存について

- データはブラウザの IndexedDB（データベース名: `KakeiboDB`）に保存されます。
- サーバーへの送信やクラウド同期は行いません。
- ブラウザのサイトデータを削除すると、登録した支出も消えます。
- 初回投入とシードのバージョン管理は `features/kakeibo/lib/seed.ts` で行います。既存の支出データがある場合、初期化処理で支出が置き換えられることはありません。

## パスエイリアス

`@/*` はプロジェクトルートを指します（`tsconfig.json` で設定）。

```ts
import { TopPage } from "@/features/kakeibo/components/top-page";
```
