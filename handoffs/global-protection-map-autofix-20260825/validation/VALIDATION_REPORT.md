# 驗證報告｜Global Protection Map Autofix 20260825

## 結論

**修正版建置、靜態完整性、桌機／手機互動預覽及部署／回滾仿真均通過。**

此報告證明修正資產本身可用；不等同於正式主機已寫入。所有線上探測均為只讀。

## 線上只讀快照

| 項目 | 台灣站 | 香港／大陸站 |
|---|---|---|
| 首頁 | HTTP 200 | HTTP 200 |
| 地球 JS | `guardian-wall-D4pS1Kwy.js` | `guardian-wall-2CHQLdmM.js` |
| 原始 JS SHA-256 | `010d6fd66c40…e35c2fbf` | `03fc9fc35842…184a3cf` |
| CSS | `index-1prVp_H8.css` | `index-CA0ym-VZ.css` |
| 原始 CSS SHA-256 | `5afbe1fcbfc6…84c9a2a0` | `0253e6791000…3fe6224` |

兩站紙雕地球材質 SHA-256 相同：`da5e3d44796b…8b3534fe`。兩站公開留言 API 快照相同：16 則；可定位為 GB 1、TW 8、CN 5，另 2 則不公開／未定位。

完整紀錄：`evidence/live-asset-capture.json`。

## 問題根因

### 1. 大地球先出現又消失

線上 JavaScript 的通用 GSAP reveal 會把 `.map-stage` 預設設為 `autoAlpha: 0`，等待 ScrollTrigger 再顯示。首頁重排、黏性工具列或初次載入計算若讓觸發點錯失，就會出現「伺服器 HTML 先顯示，前端初始化後反而隱藏」的現象。

熱修正同時使用 CSS `!important` 與水合後 inline important，確保 `.map-stage` 維持 `opacity:1`、`visibility:visible`；原旋轉動畫仍保留。

### 2. 亮點點擊缺乏明確選單回饋

原版 marker 的 click handler其實已切換 region state，留言過濾也已包含 `message.regionCode === selectedRegionCode`。缺的是可見、可鍵盤操作且能同步狀態的地區選單。

熱修正不重寫資料與篩選器，而是把新 `<select>` 接到原 marker click 與既有清除 chip，因此不會形成第二套狀態。

### 3. 倫敦定位錯誤

原亮點基準約為 `252,175`，在這張藝術化紙雕材質上落到中亞附近。依實際材質網格校正後，倫敦有效座標採 `102,163`；在現有 marker 結構中以 `translate(-150 -12)` 套到兩份循環地圖副本。校正依據見：

- `evidence/london-coordinate-grid.png`
- `evidence/europe-grid-crop.png`

## 瀏覽器回歸驗證

執行：

```bash
python ops/validate_preview.py
```

結果：`validation/preview-validation.json` → `pass: true`。

| 驗證項目 | 結果 |
|---|---|
| 地區選單存在 | PASS |
| 選項含全部、GB、TW、CN | PASS |
| 點倫敦亮點後選單同步為 GB | PASS |
| 點倫敦後留言數 1 | PASS |
| 選台灣後留言數 8 | PASS |
| 選大陸後留言數 5 | PASS |
| 清除後留言數 16 | PASS |
| 倫敦目標 `102,163` | PASS |
| 透明 hit target 半徑 30 | PASS |
| 桌機地球可見且高度 850px | PASS |
| 手機地球與選單可見 | PASS |
| Page errors | 0 |
| Console errors | 0 |
| HTTP 404 | 0 |

預覽 shell 對瀏覽次數、投稿統計與官方快報等非地球依賴提供只讀 mock；地球材質、client modules 與公開留言 API 使用線上擷取快照，因此回歸測試不受外部網路與裝飾資產影響。

## 靜態與完整性驗證

執行：

```bash
python validation/check_overlay_static.py
```

結果：`validation/static-validation.json` → `pass: true`。

修正版 SHA-256：

| 站點 | JavaScript | CSS |
|---|---|---|
| TW | `1df97e33c6f5…256792b8` | `24451637a662…f13b6ac3` |
| HK | `a3df847cdfe8…0565c98c` | `44599172f037…f6418457` |

兩份 JavaScript 皆通過 `node --check`；overlay guard、倫敦座標、選單同步、hit target、可見性 override 與 canonical label 都只有一套生效邏輯。

## 部署腳本仿真

在分離的仿真目錄，使用兩站原始快照執行：

1. 乾跑定位與 SHA 核對：PASS
2. `--execute` 備份與原子替換：PASS
3. 寫入後 SHA 與 patch marker：PASS
4. 第二次乾跑辨識「已修正」：PASS
5. 兩站自動產生回滾腳本：PASS
6. 執行回滾後恢復原始 SHA：PASS

部署腳本本身亦通過 `bash -n`。

## 安全聲明

本修正未寫入或轉換任何留言；未呼叫投稿／審核寫入 API；未變更登入、會員、管理、Email、IP、資料庫、DNS 或跨站同步設定。

正式部署後仍應完成：

- CDN 資產 URL purge 或等效快取刷新。
- 無痕視窗與既有瀏覽器各驗證一次。
- 桌機點倫敦／台灣／大陸亮點。
- 手機從地區選單切換三區。
- 確認投稿、登入與管理中心 smoke test 不受影響。
