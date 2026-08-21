# 全球守護留言牆｜2026-08-21 Sites 更新交接

此分支只保存跨專案的部署交接紀錄，**不會由 child-advocacy-site 的 GitHub Pages 工作流程發布**。

## 目標

- Site：全球守護留言牆
- 正式網址：`https://global-protection.jerryzuhow77.chatgpt.site/`
- ChatGPT Sites project ID：`appgprj_6a81f66ab7148191b10fc07c159948aa`
- 更新：首頁 UX、手機導覽、載入狀態、探索頁籤、動畫暫停及無障礙焦點管理

## 已保存的交接檔

ChatGPT 檔案庫：`/Sites/Global-Protection/`

- `Global-Protection_Sites_Auto-Handoff_20260821.zip`
- `Global-Protection_Sites_Auto-Handoff_20260821.sha256`
- `SITE_UPDATE_REQUEST_20260821.md`
- `DEPLOYMENT_STATUS_20260821.json`

## 合併底線

必須讀取目前線上的 Sites 專案後逐段合併，不得以 2026-08-18 封存檔整包覆蓋。以下內容不得變動：

- `.openai/hosting.json` 與現有 project binding
- D1 binding、schema、migration 及線上資料
- 投稿、照片、審核、檢舉、通知、瀏覽次數 API
- Google／Microsoft／Apple／Email／ChatGPT 登入與 callback
- Resend secrets 與管理員通知
- PWA manifest、service worker 與快取版本
- 現有環境變數與 secrets

## 權限狀態

公開備份倉庫 `yayungrikit-byte/Global-Protection` 對目前連線身份 `jerryzuhow77` 僅提供讀取權限；建立分支與 issue 均被 GitHub 回應 403。因此真正的 production 更新仍須由既有 ChatGPT Sites 專案編輯介面載入並發布，不能從此 GitHub Pages 倉庫替代部署。
