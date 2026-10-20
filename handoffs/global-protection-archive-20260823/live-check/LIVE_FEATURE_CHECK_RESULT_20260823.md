# Global Protection live feature check result

- Workflow run: `32639880448`
- Completed: 2026-08-23T12:36:45Z
- Target: `https://cn.globalprotectionwall.com/`
- Mode: read-only

## Live frontend

- Homepage: `200 OK`
- Content type: `text/html; charset=utf-8`
- Server-rendered HTML sampled: `39,810` bytes
- Existing baseline markers detected:
  - `全球守護留言牆`
  - `世界地圖便條牆`
  - `守護拼圖`

## Archive feature result

The following archive markers were **not detected** in the live server-rendered HTML:

- `守護文章典藏館` / `守护文章典藏馆`
- `今天，再讀一篇守護` / `今天，再读一篇守护`
- `本月值得再讀` / `本月值得再读`
- `你可能錯過的守護` / `你可能错过的守护`
- `守護書架` / `守护书架`
- `繼續閱讀這條守護線` / `继续阅读这条守护线`
- `Guardian Article Archive`
- `archive-section`
- `ticker-archive-bridge`
- `guardian-archive`

Conclusion: the archive/old-post rediscovery update is **not currently present in the live homepage HTML**. Server deployment is still required.

## Public endpoint health

- `/api/public/messages?limit=1`: `200`, `application/json`
- `/sw.js`: `200`, `text/javascript; charset=utf-8`
- `/manifest.webmanifest`: `404`, `text/plain;charset=UTF-8`

The check did not retain public message bodies. No login, post, account, database, DNS or service mutation was performed.
