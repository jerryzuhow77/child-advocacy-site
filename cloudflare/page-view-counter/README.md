# 全站真實瀏覽次數 API

本目錄提供 `child-advocacy-site` 的 Cloudflare Worker + Workers KV 瀏覽計數後端。

## 已部署環境

- Worker：`sweet-art-bed8child-advocacy-page-views`
- KV namespace：`child-advocacy-page-views`
- KV binding：`PAGE_VIEWS`
- API endpoint：`https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/views`
- 健康檢查：`https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/health`

官網前端已在 `assets/site.js` 設定 `window.CPA_VIEW_COUNTER.endpoint`，各頁面透過 `assets/mobile-nav-view-counter-20260823.js` 顯示共用累計瀏覽次數。

## API

- `GET /health`：回傳服務與 KV binding 狀態。
- `GET /views?page=<文章ID>&increment=0`：只讀取瀏覽數。
- `GET /views?page=<文章ID>&increment=1`：瀏覽數 +1 並回傳最新數字。
- `GET /views?key=<文章ID>`：相容的只讀格式。
- `POST /views`，JSON `{ "key": "<文章ID>" }`：瀏覽數 +1。

## 前端防重複

前端使用 `sessionStorage`，同一瀏覽工作階段重新整理不會一直累加。Worker 或網路暫時失效時，頁面會自動降級為本裝置瀏覽數，不會讓文章版面壞掉。

## Wrangler 後續維護

若未來改用 Wrangler CLI 重新部署，請先把 `wrangler.jsonc` 內的 `REPLACE_WITH_KV_NAMESPACE_ID` 換成 Cloudflare 後台顯示的實際 Namespace ID，避免覆蓋既有 binding。
