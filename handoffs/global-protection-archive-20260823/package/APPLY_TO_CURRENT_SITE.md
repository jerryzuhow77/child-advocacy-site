# 套用至目前正式站

## 1. 建立可回復版本

在正式站目前最新原始碼建立部署前標記或分支，例如：

```bash
git switch -c backup/global-protection-before-archive-20260823
git switch -c feature/global-protection-archive-20260823
```

若正式站由 Docker 部署，另保留目前映像標籤與 `docker compose config` 輸出；不得清空資料卷或資料庫。

## 2. 合併前台元件

以 `patches/guardian-wall.archive.patch` 為主，將下列區塊合併至目前正式版 `GuardianWall`：

- `ArchiveMessage`、`ArchiveCopy` 與四語文案。
- 案件、年份、時間、雜湊與長期推薦計分函式。
- 典藏搜尋與篩選狀態。
- 每日再讀、本月再讀、低曝光文章與相關文章的衍生資料。
- `archive` 探索頁籤、首頁舊文橋接卡、典藏館、守護書架、文章內相關閱讀。
- 桌機導覽、手機底部導覽與頁尾的典藏入口。

**不得以舊參考元件完整覆蓋較新的正式元件。**

## 3. 合併樣式

先以 `patches/globals.archive.patch` 乾跑；若正式站 CSS 已有後續改動，改為逐段合併新增的典藏 selector，禁止刪除現有正式樣式。

## 4. 資料相容

本功能可直接使用目前 `GuardianMessage` 必備欄位。以下欄位均為選用：

```ts
{
  title?: string;
  createdAt?: string;
  publishedAt?: string;
  tags?: string[];
  case?: string;
  caseName?: string;
  caseLabel?: string;
  featured?: boolean;
  pinned?: boolean;
  viewCount?: number;
}
```

API 不提供選用欄位時仍可運作：年份從 `month` 嘗試辨識，案件從內文保守辨識，其餘使用既有互動數與內容深度排序。

## 5. 回歸測試

發布前至少完成：

- 首頁公開留言 API 載入成功。
- 免登入投稿、照片上傳、國家／地區、標題與正文限制維持正式站設定。
- 一般會員、主要管理員與審核員權限不變。
- 台灣與香港／大陸投稿仍進入正確待審流程，通知信仍可送達。
- 按讚、回覆、分享、檢舉功能正常。
- 四語典藏頁籤、篩選、空狀態與相關閱讀正確顯示。
- 360、390、430、768、1024、1440px 無水平溢位。
- reduced-motion 下沒有持續動畫。
- 搜尋、多重篩選與四種排序可交叉使用。
- 當日「今天，再讀一篇」重新整理後保持同一篇，隔日才輪替。
- OAuth callback、PWA、service worker、快取及瀏覽計數正常。

## 6. 發布與回復

全部測試通過才發布。任一登入、投稿、審核、通知或資料讀寫測試失敗，立即停止並保留目前正式版。

回復時只撤回典藏元件與 CSS 差異；本更新沒有資料庫 migration，不得以重建資料庫作為回復方法。
