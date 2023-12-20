// 引用linebot SDK
const linebot = require('linebot');
require('dotenv').config();

const axios = require('axios');

const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
    // event.message.text是使用者傳給bot的訊息
    // 準備要回傳的內容
    // console.log(event.message.text);
    const options = {
        method: "post",
        url: "https://notify-api.line.me/api/notify",
        headers: {
            "Authorization": `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `message=\n${event.message.text}`,
    };

    axios(options)
        .then(response => {
            console.log(response.data);
            res.send('Line Notify sent successfully!');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error sending Line Notify');
        });
});

// Bot所監聽的webhook路徑與port
bot.listen(`/${process.env.URL_ROOT}`, 3210, function () {
    console.log('[BOT已準備就緒]');
    console.log(`URL:https://${process.env.DOMAIN_NAME}/${process.env.URL_ROOT}`)
    console.log('[BOT已準備就緒]');
});