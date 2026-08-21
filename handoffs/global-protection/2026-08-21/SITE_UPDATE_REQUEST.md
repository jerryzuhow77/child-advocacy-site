# ChatGPT Sites 自動更新請求｜全球守護留言牆

## 目標 Site

- 名稱：全球守護留言牆
- 正式網址：https://global-protection.jerryzuhow77.chatgpt.site/
- Sites project ID：`appgprj_6a81f66ab7148191b10fc07c159948aa`
- 更新日期：2026-08-21

## 執行授權

站點擁有者要求自動處理本次首頁 UX 優化。請先在現有 Site 專案建立可回復版本，於預覽環境合併與驗證；所有回歸檢查通過後，沿用現有公開網址發布更新。

## 必須使用的基底

必須從 Sites 目前線上專案的最新原始碼開始，不得以 2026-08-18 封存檔整包覆蓋。附帶 ZIP 是「合併參考包」，只提供前台 UX 邏輯與 CSS 層。

## 本次合併範圍

1. 首屏改為兩個清楚入口：免登入留下一句、登入後投稿文章。
2. 三個信任標籤：人工審核後公開、不公開精確位置、可不留真實姓名。
3. 統計與公開留言讀取期間顯示骨架／破折號，不先閃出 0。
4. 留言便條、世界地圖、守護拼圖合併為三頁籤；只有目前頁籤執行動畫。
5. 分頁失焦、減少動畫、不可見區塊時暫停 GSAP／循環動畫。
6. 手機四格底部導覽與安全區域；主要觸控目標至少 44px。
7. 對話框支援 Esc、焦點鎖定、開啟後聚焦與關閉後焦點返回。
8. 加入跳至主要內容連結與 focus-visible 樣式。
9. 繁中、簡中、英文、日文同步。
10. 保留目前所有訪客投稿、照片上傳、國家／地區、快報、計數器、收藏、PWA、登入、通知、審核與管理功能。

## 嚴禁覆蓋或改動

- `.openai/hosting.json` 與現有 project binding
- D1 binding、資料表、schema、migration 與任何既有資料
- 投稿、圖片、審核、檢舉、稽核及瀏覽次數 API payload
- Google／Microsoft／Apple／Email／ChatGPT 登入與 callback
- Resend secrets、寄件網域及管理員通知設定
- PWA manifest、service worker 與現行 cache version
- 官方快報同步來源及現行計數器
- 現有環境變數與 secrets

## 合併方式

1. 從 ChatGPT 檔案庫 `/Sites/Global-Protection/` 讀取 `Global-Protection_Sites_Auto-Handoff_20260821.zip`。
2. 解開內含的 `Global-Protection_Homepage_UX_Optimization_20260821.zip`，讀取 `APPLY_TO_CURRENT_SITE.md`、`PATCH_MANIFEST.json` 與 patch。
3. 不要整檔替換現行 `guardian-wall.tsx`；將新增 state、四語文案、無障礙對話框、探索頁籤及 mobile nav 邏輯逐段合併到現行元件。
4. 只將 `app/globals.css` 最後標示為 `2026-08-21 homepage UX optimization layer` 的樣式整合到現行 CSS；處理重複 selector，避免提高不必要 specificity。
5. 若線上版已有三步式訪客表單，保留現況；若沒有，只做視覺分步，不改 API payload 或欄位名稱。

## 發布前驗收

- 360、390、430、768、1024、1440px 無水平捲軸或文字裁切。
- 四語切換不跳回首頁、不遺失目前區塊。
- 訪客可含照片投稿；預覽、刪除、排序、壓縮與 EXIF 清理正常。
- 會員投稿、草稿、收藏、分類、登入 callback 正常。
- 快報同步、瀏覽次數、地圖、拼圖、留言與回覆正常。
- 管理台、審核、通知、檢舉、D1 資料與 PWA 安裝正常。
- 螢幕閱讀器、鍵盤 Tab、Esc、焦點返回及 reduced motion 正常。
- 執行現有 production build 與測試；任何失敗都不得發布。

## 發布策略

- 先建立可回復版本與預覽。
- 若只有本次允許的前台檔案差異且全部驗收通過，沿用原網址公開發布。
- 發布後重新以未登入訪客、一般會員與管理員三種身分抽測。
- 若發現回歸，立即回復上一個已發布版本，不得以刪除資料或重建 D1 處理。
