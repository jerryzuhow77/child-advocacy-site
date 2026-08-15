護童行動聯盟｜特別專題桌機收放＋萱萱案高解析布袋戲偶
更新日期：2026-08-15
封裝類型：UPDATE ONLY（僅含本次需要新增或覆蓋的檔案）

部署方式
1. 請在既有 child-advocacy-site 專案根目錄解壓縮或上傳。
2. 僅覆蓋壓縮檔內同名路徑；不要先刪除網站或整個 assets 目錄。
3. GitHub Pages 完成部署後，建議強制重新整理瀏覽器快取。

本次覆蓋的既有檔案（8）
- assets/site.js
- assets/xuanxuan-feature.css
- index.html
- en/index.html
- ja/index.html
- cases/xuanxuan/index.html
- en/cases/xuanxuan/index.html
- ja/cases/xuanxuan/index.html

本次新增的高解析透明 WebP（4）
- assets/art/xuanxuan-puppets/record-keeper-pointing-20260815.webp
- assets/art/xuanxuan-puppets/messenger-receiving-20260815.webp
- assets/art/xuanxuan-puppets/examiner-weighing-20260815.webp
- assets/art/xuanxuan-puppets/guide-thread-20260815.webp

不會覆蓋／未放入本包
- assets/site.css
- assets/xuanxuan-feature.js
- assets/audio/xuanxuan-original-score-loop-20260815.mp3
- assets/home-view-counter-20260811.js 與 CSS
- data/search-index.json、sitemap.xml
- 其他案件、文章、社群、活動與網站設定

保留條件
- 繁體與簡體共用中文實體頁；英文、日文各自為一份實體頁。
- 四語萱萱案瀏覽數仍共用 case-xuanxuan-shared。
- 原創背景音樂、預設靜音、音效降音與重播功能原樣保留。
- 起訴不等於有罪、庭期待法院公開等文案原樣保留。

完成內容
- 桌機與手機的「剴剴案／社會觀察」下層按鈕統一為點擊式手風琴：點一下展開、再點一下收合，切換另一組時自動收起前一組。
- 萱萱案六章與結尾加入四款原創高解析布袋戲偶，共十個戲偶動畫層；動作包含指卷查問、承接移交、持秤衡量、牽線指向、停印與退幕。
- 戲偶為象徵性的成年制度觀察者，不重演兒童傷害。
- 手機版放大戲偶畫面並保留冠帽、袖形與衣襬；減少動態偏好下改為清楚的靜態呈現。

驗證
- assets/site.js 與 assets/xuanxuan-feature.js：Node 語法檢查通過。
- 三語實體專頁：各 7 個轉場、10 個戲偶圖層、4 款姿勢，所有本地素材路徑通過。
- 四款 WebP：1023/1024 × 1536/1537 px，含透明 Alpha。
- 三語首頁：各 2 個下層收放按鈕，ARIA 對應目標唯一，快取版本已更新。
