# 全球守護留言牆｜守護文章典藏與舊文再浮現

**目標站點：** https://cn.globalprotectionwall.com/  
**更新模式：** merge-only 前台更新  
**建立日期：** 2026-08-23（Asia/Taipei）

## 已備妥交接包

- Library：`/Sites/Global-Protection/Global-Protection_Content-Archive_20260823.zip`
- SHA-256：`cf97ab82b819b9f5caae75931c226f85e49c38b7904ffde9e30ee2a7ba5d06f3`
- 驗證檔：`/Sites/Global-Protection/Global-Protection_Content-Archive_20260823.sha256`
- 基準：`Global-Protection_Sites_Auto-Handoff_20260821`

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

交接包保留原有 `/api/public/messages`、`/api/public/messages/:id/engagement`、`/api/reports` 參照，沒有資料庫 migration。

## 安全套用方式

1. 從目前正式站最新原始碼建立可回復版本。
2. 讀取交接包中的 `APPLY_TO_CURRENT_SITE.md`、`PATCH_MANIFEST.json` 與 `VALIDATION_REPORT.txt`。
3. 以 `patches/guardian-wall.archive.patch` 合併典藏邏輯，不得以舊基準完整覆蓋目前正式元件。
4. 將 `styles/guardian-archive.css` 追加至目前正式樣式尾端。
5. 保留目前正式站投稿表單與所有 API 整合。
6. 執行桌機、手機、四語、登入、投稿、審核、通知、回覆、檢舉與資料讀寫回歸測試。
7. 全部通過才沿用原網址發布；任一測試失敗即停止發布並保留目前正式版。

## 驗證摘要

- TypeScript／TSX 語法：通過
- TypeScript 結構檢查：通過
- PostCSS 結構：通過
- 既有 API 參照集合：未改變
- protected integration markers：通過
- 資料庫 migration：無

## 部署狀態

本分支與交接包已完成；目前連線工具未包含騰訊雲主機原始碼／執行環境，因此此提交不宣稱 `cn.globalprotectionwall.com` 已部署。正式部署必須在可存取目前騰訊雲應用程式來源的環境中，依上述 merge-only 流程執行。