// 引用linebot SDK
const linebot = require('linebot');
require('dotenv').config();

const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});
// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
    // // event.message.text是使用者傳給bot的訊息
    // // 準備要回傳的內容
    console.log(event.message.text);
    // const replyMsg = `Hello你剛才說的是:${event.message.text}`;
    // // 透過event.reply(要回傳的訊息)方法將訊息回傳給使用者
    // event.reply(replyMsg).then(function (data) {
    //     // 當訊息成功回傳後的處理
    // }).catch(function (error) {
    //     // 當訊息回傳失敗後的處理
    // });
});

// Bot所監聽的webhook路徑與port
bot.listen(`/${process.envURL_ROOT}`, 3210, function () {
    console.log('[BOT已準備就緒]');
    console.log(`URL:https://${process.env.DOMAIN_NAME}/${process.env.URL_ROOT}`)
});