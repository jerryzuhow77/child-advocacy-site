# 全站真實瀏覽次數 API

本目錄提供 `child-advocacy-site` 的 Cloudflare Worker + Workers KV 瀏覽計數後端。

## Cloudflare 設定

1. Cloudflare Dashboard → Workers & Pages → KV → Create instance。
2. 建立 namespace：`child-advocacy-page-views`。
3. 複製 KV Namespace ID，填入 `wrangler.jsonc` 的 `REPLACE_WITH_KV_NAMESPACE_ID`。
4. 在本目錄執行 `npx wrangler deploy`，第一次會要求登入 Cloudflare。
5. 記下部署後網址，例如：`https://child-advocacy-page-views.<你的 workers.dev 子網域>.workers.dev`。
6. 測試 `/health`，應回傳 `{ "ok": true, ... }`。
7. 官網前端設定 `window.CPA_VIEW_COUNTER_API` 為 `<Worker網址>/views` 後即可啟用全站共用計數。

## API

- `GET /views?key=<文章ID>`：讀取瀏覽數。
- `POST /views` JSON `{ "key": "<文章ID>" }`：瀏覽數 +1 並回傳最新數字。
- `GET /health`：健康檢查。

## 注意

前端會用 sessionStorage 防止同一分頁工作階段反覆重新整理灌數。Worker 亦限制 CORS 到護童行動聯盟 GitHub Pages 與全球守護留言牆相關網域。
