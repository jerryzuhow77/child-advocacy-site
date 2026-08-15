萱萱案「手機版案件經過不可見」安全修補

更新範圍：
- assets/xuanxuan-feature.css

修正內容：
- 讓高度超過手機視窗的案件經過外層保持可見，避免 IntersectionObserver 的 14% 門檻使整段維持透明。
- 其他篇章、戲偶、音樂、瀏覽計數與動畫設定均未變更。

不包含、也不會覆蓋：
- assets/site.js
- assets/site.css
- index.html、en/index.html、ja/index.html
- 特別專題、剴剴案、社會觀察的導覽／收合設定
- 萱萱案三語 HTML 與其他共用資產

部署方式：
將壓縮檔內容解壓到網站根目錄，只會覆蓋萱萱專頁自己的 CSS 檔。
