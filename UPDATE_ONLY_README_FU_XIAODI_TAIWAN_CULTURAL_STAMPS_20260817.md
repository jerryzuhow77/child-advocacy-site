# 傅小弟案｜臺灣生活文化圖章內頁更新檔

更新日期：2026-08-17

## 安裝

將壓縮檔解壓縮至 `child-advocacy-site` 網站根目錄，保留資料夾結構並覆蓋同名檔案。

## 本次內容

- 將使用者提供的六枚圖章原稿完整保留為網站資產，未重新生成、未改寫圖樣。
- 在案件內頁「閱讀指南」加入六枚臺灣生活文化圖章：閩南 2 枚、客家 2 枚、外省族群 2 枚。
- 各章節角落交替顯示三族群圖章彩蛋；滑鼠停留或鍵盤聚焦時顯示圖章說明。
- 圖章區塊於桌機顯示六欄、平板三欄、手機兩欄。
- 繁體中文、英文、日文文案同步；簡體中文沿用網站既有的繁簡轉換機制。
- 圖章明確標示為原創生活文化意象，不是官方族群徽章，也不替任何族群作單一定義。
- CSS 與 JavaScript 快取版本更新為 `20260817-4`。

## 需覆蓋／新增的檔案

- `assets/fu-junxiang-feature.css`
- `assets/fu-junxiang-feature.js`
- `assets/art/fu-xiaodi-taiwan-cultural-stamps-20260817.png`
- `historical-cases/regions/taiwan/fu-junxiang/index.html`
- `en/historical-cases/regions/taiwan/fu-junxiang/index.html`
- `ja/historical-cases/regions/taiwan/fu-junxiang/index.html`

## 驗證

- JavaScript 語法檢查通過。
- 三語 HTML 結構與快取版本檢查通過。
- 六枚精靈圖位置、CSS 引用與響應式欄數檢查通過。
- 網站資產與使用者提供原圖 SHA-256 完全相同。
