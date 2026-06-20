# kabu-quiz｜株式投資クイズ（KCのノート）

株式投資の基礎を **4択・◯×** で学べる無料クイズアプリ。**登録不要・AI採点なし**、
進捗とブックマークは端末の LocalStorage に保存します（匿名）。相場解説ブログ
[KCのノート](https://kc-notes.com) の学習コンテンツとして公開します。

## 特長
- カテゴリ別クイズ（基礎 / 値動き / NISA・注文 / 指標・リスク）
- 即時採点＋解説、**復習モード**（間違いだけ再出題）、**★ブックマーク**
- カテゴリ別の進捗・正答率を可視化（LocalStorage）
- サーバー・DB・APIキー不要の**静的SPA**（Vite + Vue 3）

## 開発
```bash
npm install
npm run dev      # 開発サーバ
npm run build    # dist/ に静的ビルド
npm run preview  # ビルド結果をプレビュー
```

## 公開（GitHub Pages）
`main` に push すると `.github/workflows/deploy.yml` が自動でビルド＆Pages公開。
独自ドメイン `quiz.kc-notes.com` は `public/CNAME` ＋ DNS(CNAME) ＋ リポジトリ設定で割当。

## 問題データ
`src/data/questions.js` に格納。`type: 'mc'`(4択) / `'tf'`(◯×)、`answer` は正解の選択肢index。

> 本クイズは教育目的で、特定銘柄の売買を推奨するものではありません。
