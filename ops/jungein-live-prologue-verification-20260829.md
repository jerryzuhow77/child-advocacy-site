# 鄭仁案序幕正式站即時驗證

- 驗證時間：2026-08-28 18:01 UTC（2026-08-29 02:01 台北時間）
- GitHub Actions run：`33197359858`
- Workflow commit：`95d67671df89ac40e957e90625d705525858eeba`
- 驗證方式：GitHub-hosted Ubuntu runner，唯讀 HTTP 取得頁面、指定影片／海報及頁面引用的同源 JS／CSS。
- 正式站、正式主機、資料庫、服務、DNS、帳號與環境變數均未修改。

## 直接端點

| 項目 | HTTP | URL |
|---|---:|---|
| 鄭仁案頁面 | 200 | `https://cn.globalprotectionwall.com/historical-cases/korea/jungein` |
| 序幕影片 | 404 | `https://cn.globalprotectionwall.com/jungein-prologue-20260829.mp4` |
| 序幕首幀海報 | 404 | `https://cn.globalprotectionwall.com/jungein-prologue-poster-20260829.webp` |

## 正式頁面與資產掃描

```json
{
  "page_contains_patch_marker": false,
  "page_contains_video_path": false,
  "asset_count": 8,
  "marker_asset_urls": []
}
```

已成功取得的正式資產包括：

- `/assets/index-C4x89g2N.css`：200，436598 bytes
- `/assets/page-CXpiX5_u.js`：200，51453 bytes
- 其餘六個頁面引用的同源 JS：全部 200

在上述正式 CSS、頁面 JS 與其他同源資產中，未找到發布標記 `global-protection-jungein-video-prologue-20260829`，也未找到 `jungein-prologue-20260829.mp4` 路徑。

## 結論

鄭仁案頁面目前可正常載入，但序幕發布內容尚未寫入正式站。這不是瀏覽器快取造成：兩個新增媒體端點直接回傳 404，現行頁面與 bundle 也不含序幕標記。正式發布仍需取得 `/opt/global-protection` 的授權寫入通道，執行已完成的備份、原子替換、驗證與失敗回滾腳本。
