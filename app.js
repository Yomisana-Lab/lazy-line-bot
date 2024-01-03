// 引用linebot SDK
const linebot = require('linebot');
require('dotenv').config();

const axios = require('axios');

const { Webhook } = require('discord-webhook-node');
const dchook = new Webhook(process.env.DISCORD_WEBHOOK_URL);

const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
    // event.message.text是使用者傳給bot的訊息
    console.log(event); // 文字內容
    // 準備要回傳的內容
    // console.log(event.message.text); // 文字內容
    // console.log(event.source.userId); // 使用者ID
    const pattern = /^(?=.*班長|班代)(?!大一|大二|大四|二技)[\s\S]*$/;
    if (pattern.test(event.message.text)) {
        // console.log("字串符合模式");
        if (event.source.userId == process.env.LINE_TARGET_USER_ID) { // 正式版本
            // 在這裡處理 userId 符合條件的情況
            // 傳送訊息至我要的目標
            const options = {
                method: "post",
                url: "https://notify-api.line.me/api/notify",
                headers: {
                    "Authorization": `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: {
                    message: message,
                },
            };
    
            axios(options)
                .then(response => {
                    if(response.status === 200){
                        console.log('Line Notify sent successfully!');
                    }else{
                        console.log(`Line Notify sent failed! not send message content: ${event.message.text}`);
                        dchook.warning(`**班代群組訊息沒有傳送**`, `傳送失敗 - 不可逆原因沒有傳送成功!`, `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`);
                    }
                })
                .catch(error => {
                    console.error(error);
                    dchook.warning(`**班代群組訊息沒有傳送**`, `傳送失敗 - 不可逆原因沒有傳送成功!`, `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`);
                });
        } else {
            // 在這裡處理 userId 不符合條件的情況
            dchook.warning(`**班代群組訊息沒有傳送**`, `遇到連過濾器都不能決定的可傳訊息 - 不是 Emily 傳送的 需要手動審查`, `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`);
            return;
        }
    } else {
        dchook.warning(`**班代群組訊息沒有傳送**`, `遇到連過濾器都不能決定的可傳訊息 - pattern.test(event.message.text) 被刷掉的`, `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`);
    }
});

// Bot所監聽的webhook路徑與port
bot.listen(`/${process.env.URL_ROOT}`, 3210, function () {
    console.log('[BOT已準備就緒]');
    console.log(`URL:https://${process.env.DOMAIN_NAME}/${process.env.URL_ROOT}`)
    console.log('[BOT已準備就緒]');
});