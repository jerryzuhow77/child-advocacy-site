# 全球守護留言牆｜守護文章典藏與舊文再浮現

**目標站點：** https://cn.globalprotectionwall.com/  
**更新模式：** merge-only 前台更新  
**建立日期：** 2026-08-23（Asia/Taipei）  
**GitHub PR：** #24

## 已備妥並持久保存的驗證包

- Library：`/Sites/Global-Protection/Global-Protection_Content-Archive_Verified_20260823.zip`
- SHA-256：`2cfc231e4c528b9428386ea749de5a032c02500cda120cd47da9934a2daf0159`
- 驗證檔：`/Sites/Global-Protection/Global-Protection_Content-Archive_Verified_20260823.sha256`
- 基準：`Global-Protection_Sites_Auto-Handoff_20260821`
- 套用原則：只能從騰訊雲目前正式站最新原始碼進行 merge，不得以舊基準整包覆蓋。

## 更新內容

1. 最新留言頁下方新增「今天，再讀一篇守護」，依台北日期每日固定輪替舊文。
2. 新增「守護文章典藏館」頁籤。
3. 新增全文搜尋，以及語言、主題、地區、案件、年份交叉篩選。
4. 新增長期推薦、最新發布、最多互動、重新發現四種排序。
5. 新增本月值得再讀、你可能錯過的守護、守護書架。
6. 文章內新增「繼續閱讀這條守護線」，依案件、主題、地區推薦舊文。
7. 補齊繁中、简中、English、日本語介面。
8. 手機底部導覽新增典藏入口，篩選器、書架與文章卡改為響應式。

## 資料與權限邊界

不得更動或重建下列既有功能：

- 登入、會員與管理員角色
- 訪客投稿、照片上傳、國家／地區欄位
- 人工審核、退回修改、直發權限
- 台灣與香港／大陸投稿同步
- Email 通知
- 按讚、回覆、分享、檢舉
- 既有資料庫、資料卷與 API
- 環境變數、密鑰、OAuth callback、PWA cache 與 service worker

交接包保留原有 `/api/public/messages`、`/api/public/messages/:id/engagement`、`/api/reports` 參照，沒有資料庫 migration。

## 安全套用方式

1. 從騰訊雲目前正式站最新原始碼建立可回復版本。
2. 讀取驗證包中的 `APPLY_TO_CURRENT_SITE.md`、`PATCH_MANIFEST.json`、`VERIFIED_VALIDATION_REPORT_20260823.md` 與 `INTEGRITY_MANIFEST.sha256`。
3. 以 `patches/guardian-wall.archive.patch` 合併典藏邏輯，不得完整替換正式站 `guardian-wall.tsx`。
4. 將 `styles/guardian-archive.css` 追加至目前正式樣式尾端，處理重複 selector。
5. 保留目前正式站投稿表單、欄位名稱、API payload 與所有既有整合。
6. 執行 production build，以及桌機、手機、四語、登入、投稿、照片、審核、通知、回覆、收藏、檢舉、計數器、PWA 與資料讀寫回歸測試。
7. 全部通過才沿用原網址發布；任一測試失敗即停止發布並保留目前正式版。

## 已完成的離線驗證

- `npx tsc --noEmit`：通過。
- TSX／CSS patch 乾跑與實際套用：通過。
- API 參照集合：未改變。
- protected integration markers：通過。
- 資料庫 migration：無。
- Chromium／Playwright：360、390、430、768、1024、1440px 均無水平溢位、console error 或 page error。
- 3 張文章卡、6 本守護書架及搜尋／篩選元件：正常渲染。

## GitHub 與正式部署狀態

- PR #24 已確認存在、可合併，且只包含交接請求與部署狀態文件。
- 驗證包已持久保存至 ChatGPT Library。
- 本次 GitHub 合併不會修改留言牆正式程式或資料庫。
- 目前工具仍未連接騰訊雲主機的應用程式來源、容器或終端，因此不得宣稱 `cn.globalprotectionwall.com` 已部署。
- 正式部署只能在取得目前騰訊雲執行環境後，依上述 merge-only 與完整回歸流程執行。
