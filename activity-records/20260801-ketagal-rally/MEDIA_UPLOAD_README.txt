8/1 凱道大遊行｜照片與影片上傳方式

一、照片
1. 將照片上傳到：
   activity-records/20260801-ketagal-rally/images/
2. 建議英文檔名：
   rally-01.jpg
   rally-02.jpg
   rally-03.jpg
3. 編輯同資料夾的 media.json：
{
  "photos": [
    {"src":"images/rally-01.jpg","caption":"活動現場","alt":"8月1日凱道活動現場"},
    {"src":"images/rally-02.jpg","caption":"被害者家屬與支持者","alt":"凱道大遊行活動紀錄"}
  ],
  "videos": []
}

二、本機 MP4 影片
1. 上傳 MP4 到：
   activity-records/20260801-ketagal-rally/videos/
2. 在 media.json 加入：
{"type":"file","src":"videos/rally-video-01.mp4","title":"8月1日凱道活動影片"}

注意：GitHub 單一檔案及儲存庫不適合放非常大的影片。大型影片建議上傳 YouTube，再用下面方式嵌入。

三、YouTube
在 media.json videos 中加入：
{"type":"youtube","src":"https://www.youtube.com/embed/影片ID","title":"8月1日活動影片"}

四、Facebook / Instagram / Threads 等外部影片
可先使用連結按鈕：
{"type":"link","src":"完整影片網址","title":"8月1日活動影片"}

新增或修改 media.json 後 Commit changes，GitHub Pages 重新部署完成即會顯示。


【目前已設定 Facebook 影片】
https://www.facebook.com/share/r/1F5fSCYw5i/

【目前已加入活動照片】
images/rally-01.png
images/rally-02.png

兩張照片均使用本次提供的臉部打碼版本。
照片已顯示於活動文章的「照片紀錄」區塊，
並使用 rally-01.png 作為活動總覽實景封面。
