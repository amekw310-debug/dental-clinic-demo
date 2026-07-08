# Smile Dental Clinic(スマイルデンタルクリニック)

架空の歯科医院「スマイルデンタルクリニック」のデモサイトです。
HTML / CSS / JavaScript のみで構成された静的サイトで、GitHub Pages で公開しています。

**公開URL:** https://amekw310-debug.github.io/dental-clinic-demo/

## サイト構成

シングルページ構成で、以下のセクションがあります。

- ヒーロー(院内写真コラージュを背景にキャッチコピーとCTAを表示)
- 医院紹介(about)
- 診療内容(services)
- 院長紹介(doctor)
- 院内紹介(facility)
- 診療時間・アクセス(hours / access)
- WEB予約・お問い合わせ(contact)

## ファイル構成

```
.
├── index.html          # ページ本体(全セクションを含むシングルページ)
├── style.css           # スタイルシート(レスポンシブ対応)
├── script.js           # ハンバーガーメニュー、スクロール連動の表示制御など
└── images/
    ├── hero-bg.png     # ヒーロー背景用の院内写真コラージュ
    ├── doctor.png      # 院長のポートレート写真
    ├── doctor.svg      # 院長写真のプレースホルダー(未使用)
    └── facility-*.svg  # 院内紹介の各設備イラスト(6枚)
```

## 主な機能(script.js)

- ハンバーガーメニューの開閉(Escキー・リンククリックで閉じる)
- スクロール時のヘッダーシャドウ表示
- 固定CTAボタン・ページトップボタンの表示制御
- スクロールに連動したフェードイン表示
- フッターの年号自動更新

## ローカルでの確認方法

ビルドは不要です。リポジトリを取得して、任意の静的サーバーで配信してください。

```sh
git clone https://github.com/amekw310-debug/dental-clinic-demo.git
cd dental-clinic-demo
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## デプロイ

`main` ブランチにプッシュすると、GitHub Pages に自動的に反映されます。

## 注意事項

このサイトはデモです。医院名・住所・電話番号・人物などはすべて架空のものです。
