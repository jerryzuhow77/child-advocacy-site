活動相簿｜新增照片方式

GitHub Pages 是靜態網站，因此不支援直接從官網後台上傳照片。
最簡單方式是透過 GitHub Repository 上傳。

【新增照片】
1. 到 GitHub Repository：
   activity-records/albums/20260801-ketagal-rally/images/

2. 按：
   Add file → Upload files

3. 上傳圖片，建議使用英文檔名，例如：
   rally-03.jpg
   rally-04.jpg
   rally-05.jpg

4. 再編輯：
   activity-records/albums/20260801-ketagal-rally/photos.json

5. 在 JSON 裡新增：
{
  "src": "images/rally-03.jpg",
  "caption": "活動現場照片",
  "alt": "8月1日凱道活動現場"
}

每一筆之間要用逗號分隔。

【注意】
- 建議先將人物臉部打碼後再公開。
- 單張圖片建議控制在 1–3 MB 左右，網站載入會更快。
- GitHub Pages 不適合做真正的會員後台／即時上傳。
- 若未來希望直接在官網登入後上傳照片，需要再串接 Cloudinary、Supabase、Firebase 或其他後台服務。


【目前相簿照片數】
15 張（原有 2 張＋本次新增 13 張）
