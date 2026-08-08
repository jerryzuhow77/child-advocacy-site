護童行動聯盟官網｜繁簡＋法庭漫畫＋旁聽紀錄

GitHub Pages：main / (root)

【新增法庭漫畫】
1. 上傳圖片至 court-comics/images/
2. 建議英文檔名，例如 20260807-court-01.jpg
3. 編輯 data/court-comics.json，新增：
{
  "date":"2026-08-07",
  "title":"8月7日法庭漫畫",
  "summary":"簡介",
  "image":"images/20260807-court-01.jpg",
  "alt":"8月7日法庭漫畫"
}

【新增旁聽紀錄】
編輯 data/hearing-records.json，新增：
{
  "date":"2026-08-07",
  "title":"某案二審準備程序旁聽紀錄",
  "court":"臺灣高等法院｜刑事第○法庭",
  "body":"完整內容。\n\n第二段內容。"
}

【繁簡切換】
右上角「简／繁」可切換，並記住選擇。
目前介面與常用詞可自動轉換；長篇文章若要做到完整、精準繁簡轉換，建議未來再改成 OpenCC 或雙語資料欄位。


【本版新增：土城兩歲男童命案旁聽紀錄】
旁聽紀錄首頁：hearing-records/index.html
獨立文章頁：hearing-records/tucheng-two-year-old-20260806/index.html
封面圖片：hearing-records/images/tucheng-two-year-old-20260806.jpg
列表資料：data/hearing-records.json

【未來新增旁聽紀錄的建議方式】
1. 封面圖片放到 hearing-records/images/，使用英文檔名。
2. 每一篇完整文章建立獨立資料夾，例如：
   hearing-records/20260820-case-name/index.html
3. 在 data/hearing-records.json 新增 date、title、court、summary、image、url。
4. Commit changes 後，旁聽紀錄首頁會自動新增卡片與「閱讀完整紀錄」按鈕。
