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


【2026/08/09 AI藝術主視覺＋美術升級】
1. 新增旁聽紀錄 AI 藝術廣告圖：
   assets/art/hearing-tucheng-ai-poster.jpg

2. 新增 8/1 凱道活動 AI 藝術廣告圖：
   assets/art/rally-20260801-ai-poster.jpg

3. 活動「照片紀錄」已加強連結：
   activity-records/albums/20260801-ketagal-rally/

4. 首頁重新設計：
   - 深藍／暖金／珊瑚／青綠品牌色
   - 上傳 LOGO 藝術作為主視覺與守護意象
   - 最新紀錄雙主題卡
   - 官網導覽與社群區塊美化

5. 上傳的品牌視覺經網頁優化後存放：
   assets/brand-art/


【本次修正 2026/08/09】
1. 8/1 凱道活動頁：
   - 刪除頁面下方重複的「照片紀錄」區塊
   - 刪除兩張重複照片、照片說明及「點擊照片可查看原尺寸」
   - 保留完整活動相簿連結與影片紀錄

2. 法庭漫畫：
   - 第一集 8 張、第二集 9 張全部直接嵌入 HTML
   - 不再依賴 pages.json / fetch 動態載入
   - 每張漫畫圖片本身均為可點擊連結，可直接開啟原尺寸圖片
   - 適合 GitHub Pages 靜態部署

3. 主要商標：
   - 以本次指定的 4 張圖片作為主要品牌識別
   - primary-logo-01：全站 Header 與首頁主視覺
   - primary-logo-01～04：首頁「主要商標」完整展示
   - 新增 favicon


【本次修正版】
1. 繁簡切換已重寫：
   - 只轉換文字節點，不再改寫 <a> 內容
   - 不會再把圖片、按鈕內的 HTML、卡片圖片刪掉
   - 簡體模式統一使用 Microsoft YaHei / Noto Sans SC / Source Han Sans SC 字型序列

2. 主商標：
   - 全站 Header、首頁主視覺與 favicon 改用「雨傘守護」primary-logo-03
   - 首頁四款品牌圖仍完整保留，雨傘守護排列第一

3. 法庭漫畫：
   - 第一集 8 頁、第二集 9 頁直接顯示於 HTML
   - 主漫畫圖片取消超連結，不需要點擊即可閱讀
   - 上方縮圖仍可跳到各頁

4. AI 藝術廣告圖：
   - 首頁「最新紀錄」旁聽／活動卡直接使用 AI 主視覺
   - 旁聽紀錄列表、活動紀錄列表與文章頁均使用 AI 主視覺
   - 所有子網頁底部新增「專題導覽」兩張 AI 圖卡
   - 根目錄另有 poster-hearing.jpg、poster-rally.jpg，方便 GitHub Pages 穩定載入


【官方社群與志工LOGO更新】
Instagram：https://www.instagram.com/child_protection_aa
Threads：https://www.threads.com/@child_protection_aa
Instagram / Threads 帳號：@child_protection_aa

新增官方社群獨立子頁：
social/index.html

首頁第一張大型主視覺：
家庭守護 primary-logo-02

「主要商標」改為「志工 LOGO」，順序：
1. 雨傘守護
2. 家庭守護
3. 點燈前行
4. 燈火守護

每款均加入 藝術意象說明。
所有既有子頁的專題導覽增加帶 AI 廣告圖片的「官方社群」圖卡。


【2026/08/09 本次更新】
1. 「AI 藝術意象」文字改為「藝術意象」。
2. 首頁第一張大型主視覺強制改為「家庭守護」primary-logo-02。
3. 官方社群三平台圖卡縮小：
   - 首頁預覽圖縮小
   - /social/ 三平台改為桌面三欄式卡片，圖片高度降低
4. 法庭漫畫：
   - 閱讀區寬度由 1100px 調整至 980px
   - 漫畫主圖最大顯示寬度約 800px
5. 首頁增加廣告美術：
   - CHILD PROTECTION ACTION 識別章
   - 家庭守護主圖說明牌
   - 法院／街頭／社群三項行動資訊
   - 深藍金色 OUR PROMISE 宣傳橫幅
   - 強化暖色背景、光暈與品牌裝飾
6. 8/1 凱道活動頁：
   - 新增本地 MP4 直接內嵌播放
   - 保留 Facebook 影片外部連結


【2026/08/09 手機版＋首頁頁尾更新】
1. 全站手機版新增下拉式導覽選單：
   首頁／法庭漫畫／旁聽紀錄／活動紀錄／活動相簿／官方社群／繁簡切換。
2. 手機版重新整理：
   首頁主視覺、最新紀錄、志工LOGO、社群卡、法庭漫畫、專題導覽及頁尾均有手機專用排版。
3. 首頁前往子網頁的主要按鈕加入可愛小圖示。
4. 首頁最下方加入「我們的信念」設計：
   - 桌面版直接使用完整設計圖。
   - Facebook、Instagram、Threads 三個圓形圖示區域可直接點擊。
   - 手機版使用同風格的響應式重排，避免整張橫圖縮小後文字看不清楚。


【2026/08/09 繁簡完整轉換修正】
- 舊版只靠詞組清單，會殘留部分繁體字。
- 新版採三層轉換：
  1. 全站現有文字精確對照（272 組）
  2. 原有語境詞組
  3. ICU 產生的繁體中文字元備援（3074 字）
- title、aria-label、alt、placeholder 也同步轉換。
- 動態新增的文字節點在簡體模式下也會自動轉換。
- 「我們的信念」桌面版原本是一整張繁體圖片；簡體模式會自動切換為可轉換的 HTML 版。
- LOGO、法庭漫畫、活動照片等「圖片內嵌文字」屬圖像內容，不會由網頁文字轉換器改字。


【2026/08/09 首頁第一屏＋最新紀錄美術升級】
1. 第一屏改為更簡潔的品牌式 Hero：
   - 家庭守護作為唯一主視覺
   - 核心標語＋一段簡介
   - 旁聽紀錄／法庭漫畫兩個主要入口
   - 移除第一屏過多的小卡與資訊
   - 新增柔和光暈、同心圓、品牌標籤與英文底線導覽

2. 「最新紀錄」改為正式媒體式編排：
   - 左側大型焦點：土城兩歲男童命案旁聽紀錄
   - 右上：8/1 凱道活動紀錄
   - 右下：法庭紀錄漫畫 VOL.2
   - 加入日期、分類標籤、摘要與快速入口
   - 手機版自動改為單欄閱讀
