# 2026-11-06 陳尚潔案｜A2 印刷檔

本資料夾提供四款 A2 直式印刷檔：水墨／藍紅兩種視覺，各有繁體與簡體版本。每款均提供可再編輯 SVG 與已將字型轉外框的 PDF。

- 成品尺寸：A2，420 × 594 mm，單頁 PDF。
- 文字、線條、法院建築意象與 QR 均為向量；QR 分別導向護童官網與既有 LINE 社群連結。
- 請以 PDF 原尺寸、100% 比例輸出，勿在列印對話框選擇「符合頁面」或額外放大。
- 底圖為重新編排的向量水墨／幾何設計，保留現有紅黑金與藍紅的視覺方向；它不是把 1229 × 1536 的網頁 JPEG 改寫 DPI 的檔案。

網站首頁使用的 `chen-shangjie-20261106-poster-ink.jpg` 與 `chen-shangjie-20261106-poster-neon.jpg` 是 1229 × 1536 px 的網頁預覽素材；請勿將它們作為 A2 印刷原檔。

原始可重建腳本：`scripts/build_chen_shangjie_a2_print.py`。執行後使用 Inkscape 匯出 PDF：

```sh
python3 scripts/build_chen_shangjie_a2_print.py
for svg in downloads/chen-shangjie-20261106-a2-print/chen-shangjie-20261106-a2-*.svg; do
  inkscape "$svg" --export-filename="${svg%.svg}.pdf" --export-text-to-path --export-area-page
done
```
