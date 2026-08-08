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


【活動紀錄】
新增入口：
activity-records/

目前新增：
activity-records/20260801-ketagal-rally/

活動頁照片、影片請依：
activity-records/20260801-ketagal-rally/MEDIA_UPLOAD_README.txt
操作。

因本次未提供8/1活動的實際照片與影片，網站已先建立照片相簿與影片播放區，
但不以其他圖片冒充活動紀錄。上傳實際媒體後即可顯示。


【法庭漫畫新增兩集】
第一集：
court-comics/episode-01/
Facebook：https://www.facebook.com/share/p/1GQQd8vq95/

第二集：
court-comics/episode-02/
Facebook：https://www.facebook.com/share/p/1EwVcXrwBJ/

目前兩篇使用 Facebook 原始貼文連結。
若要把漫畫圖片直接顯示於官網，請另提供每一集的漫畫圖片檔；
之後可在各集頁面加入「逐張漫畫閱讀」相簿，而不必更改原始 Facebook 來源。


【活動相簿】
活動相簿首頁：
activity-records/albums/

8/1 凱道活動相簿：
activity-records/albums/20260801-ketagal-rally/

新增照片方式請看：
activity-records/albums/20260801-ketagal-rally/UPLOAD_PHOTOS_README.txt


【法庭漫畫分集閱讀版】
法庭漫畫總覽：
court-comics/

第一集：
court-comics/episode-01/
- 已加入 8 張完整漫畫
- pages.json 控制逐頁內容
- 可點擊放大、左右鍵切換
- Facebook 原文：https://www.facebook.com/share/p/1GQQd8vq95/

第二集：
court-comics/episode-02/
- 已建立獨立頁面
- 目前連到 Facebook 原始貼文：https://www.facebook.com/share/p/1EwVcXrwBJ/
- 後續提供第二集圖片即可套用第一集版型


【法庭漫畫第二集完整內容】
第二集：
court-comics/episode-02/
- 法庭紀錄漫畫 VOL.2
- 已加入 9 張完整漫畫
- 第一張作為封面
- pages.json 控制逐頁內容
- 可點擊放大、左右鍵切換
- 與第一集互相導覽
- Facebook 原文：https://www.facebook.com/share/p/1EwVcXrwBJ/

目前法庭漫畫：
VOL.1 第一集：8 頁
VOL.2 第二集：9 頁
兩集均可在官網完整閱讀。
