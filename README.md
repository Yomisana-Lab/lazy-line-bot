# lazy-line-bot
對...你看到的一切都是真實的，我還公開

# Feature
- 只會讀取關鍵文字
- 影音暫時沒有想法如何判斷是否連貫(預計功能會採用如果10秒內有傳送都會傳送，沒有傳送到的匯傳送到 Discord webhook)

# How to work?
首先你要有一個 LINE BOT 這個 LINE BOT 就是一隻機器人，把它放到目標群組。
然後藉由這個 lazy-line-bot 專案 建立一個端點來接收處理 LINE BOT 傳送回來的訊息資訊，如果 符合ID 並且 符合 訊息規則將會傳送至 LINE notify 上(採用Token方式，並且 LINE notify 有加入到目標要轉傳的群組或是與notify1對1聊天內)，其他則會傳送到 Discord webhook 上

- 示意圖
LINE GROUP(A) => LINE BOT(In A group) => lazy-line-bot => LINE notify(In B group) => LINE GRUOP(B)
