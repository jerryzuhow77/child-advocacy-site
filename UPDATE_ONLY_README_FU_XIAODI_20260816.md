# 傅小弟案四語網頁｜僅更新檔案說明

更新日期：2026-08-16  
適用網站：`https://jerryzuhow77.github.io/child-advocacy-site/`

## 安裝方式

1. 先備份目前網站。
2. 將壓縮檔解壓到網站儲存庫根目錄。
3. 保留壓縮檔中的相對路徑，允許同名檔案覆蓋。
4. 檢查下列六個主要網址後，再依原 GitHub Pages 流程提交與發布：
   - `/`
   - `/en/`
   - `/ja/`
   - `/historical-cases/regions/taiwan/fu-junxiang/`
   - `/en/historical-cases/regions/taiwan/fu-junxiang/`
   - `/ja/historical-cases/regions/taiwan/fu-junxiang/`

本壓縮檔只含新增或修改的檔案，不含完整網站，也不要求刪除既有檔案。

## 本次內容

- 案件公開名稱統一為「人皮燈籠案／刺青針刑虐童案」；正文人物統一稱「傅小弟」。
- 繁體／簡體中文共用一份案件頁，另建英文與日文完整頁。
- 四語首頁案件名稱、案件備註、台灣歷史案件入口與最新快報同步。
- 日文 `/ja/` 已改回真正的日文首頁，不再誤顯示王昊事件文章。
- 案件內含 11 組動畫：幕開、皮影詩劇、原創時代校園心理懸疑轉場、制度線索互動、幕謝。
- 動畫不重演傷害；皮影人物、對話、交付簿均明示為象徵創作，不是證詞、證物或裁判認定。
- 兩首原創配樂各提供 WebM 與 M4A，相容主要桌面與手機瀏覽器；預設靜音，由讀者主動開啟。
- 四語案件頁與首頁卡片共用計數鍵 `historical-fu-junxiang-shared`。
- 全站 81 個讀者子頁已稽核：21 頁採專屬計數器、60 頁由全站程式自動加入，遺漏 0 頁。Google 驗證檔不屬讀者頁面。
- `sitemap.xml` 已加入三個案件語言網址及英文、日文首頁。

## 本次更新檔案

### 首頁、導覽、計數與索引

- `index.html`
- `en/index.html`
- `ja/index.html`
- `assets/site.css`
- `assets/site.js`
- `sitemap.xml`

### 傅小弟案四語頁面

- `historical-cases/regions/taiwan/fu-junxiang/index.html`
- `en/historical-cases/regions/taiwan/fu-junxiang/index.html`
- `ja/historical-cases/regions/taiwan/fu-junxiang/index.html`
- 簡體中文版由繁／簡切換器即時轉換，並套用簡體中文字型堆疊。

### 案件視覺、動畫與音樂

- `assets/fu-junxiang-feature.css`
- `assets/fu-junxiang-feature.js`
- `assets/art/fu-xiaodi-care-ledger-20260816.svg`
- `assets/audio/fu-xiaodi-before-the-long-silence.m4a`
- `assets/audio/fu-xiaodi-before-the-long-silence.webm`
- `assets/audio/fu-xiaodi-velvet-hammers.m4a`
- `assets/audio/fu-xiaodi-velvet-hammers.webm`

### 全站計數器補齊

- `cases/kaikai/chapters/no-parents-orphan/index.html`
- `en/cases/kaikai/chapters/no-parents-orphan/index.html`
- `ja/cases/kaikai/chapters/no-parents-orphan/index.html`

## 已完成檢查

- JavaScript 語法檢查。
- 六個主要 HTML 頁面解析與標題、H1 檢查。
- 所有新增頁面的本機連結、樣式、腳本、圖像與音訊路徑檢查；遺漏 0 筆。
- SVG XML 與 `sitemap.xml` 結構檢查。
- 兩首音訊各約 30.8 秒，WebM／M4A 皆可由伺服器正確提供。
- 桌面／手機斷點、英文與日文字級／行距、簡體中文字型、減少動態與省流量靜態模式均已納入樣式與程式邏輯。

## 發布提醒

本更新包沒有替你推送 GitHub、提交版本或發布 GitHub Pages；請先在測試分支預覽，再依網站既有流程發布。
