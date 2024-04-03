// 引用linebot SDK
const FormData = require("form-data");
const linebot = require("linebot");
require("dotenv").config();

const fs = require("fs-extra");
const axios = require("axios");

const { Webhook } = require("discord-webhook-node");
const dchook = new Webhook(process.env.DISCORD_WEBHOOK_URL);

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

function Logger(...messages) {
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  const formattedMessages = messages.map(
    (message) => `[${timestamp}] ${message}`
  );

  console.log(...formattedMessages);

  const logText = formattedMessages.join(" ") + "\n";
  fs.appendFile("log.txt", logText, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

var sendTimestamp = 0;

// 當有人傳送訊息給Bot時
bot.on("message", function (event) {
  // event.message.text是使用者傳給bot的訊息
  Logger(event); // 文字內容
  // 準備要回傳的內容
  // console.log(event.message.text); // 文字內容
  // console.log(event.source.userId); // 使用者ID
  // const pattern = /^(?=.*班長|班代)(?!大一|大二|大四|二技)[\s\S]*$/;
  if (matchPattern(event.message.text)) {
    // console.log("字串符合模式");
    // if (event.source.userId == process.env.LINE_TARGET_USER_ID) {
    // 暫時用不到 "LINE_TARGET_USER_ID"
    if (event.source.userId == process.env.LINE_TARGET_USER_ID) {
      // 正式版本
      // 在這裡處理 userId 符合條件的情況
      // 傳送訊息至我要的目標
      const axios_options = {
        method: "post",
        url: "https://notify-api.line.me/api/notify",
        headers: {
          Authorization: `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          message: event.message.text,
        },
      };

      sendTimestamp = event.timestamp;

      axios(axios_options)
        .then((response) => {
          if (response.status === 200) {
            Logger("Line Notify sent successfully!");
          } else {
            Logger(
              `Line Notify sent failed! not send message content: ${event.message.text}`
            );
            dchook.warning(
              `**班代群組訊息沒有傳送**`,
              `傳送失敗 - 不可逆原因沒有傳送成功-2`,
              `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`
            );
          }
        })
        .catch((error) => {
          Logger(error.stack);
          dchook.warning(
            `**班代群組訊息沒有傳送**`,
            `傳送失敗 - 不可逆原因沒有傳送成功-1`,
            `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}\n${error}\n${error.stack}`
          );
        });
    } else {
      // 在這裡處理 userId 不符合條件的情況
      dchook.warning(
        `**班代群組訊息沒有傳送**`,
        `遇到連過濾器都不能決定的可傳訊息 - 不是 Emily 傳送的 需要手動審查`,
        `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`
      );
      // return;
    }
  } else if (
    event.message.type === "image" &&
    sendTimestamp + 60 * 1000 > event.timestamp &&
    event.source.userId == process.env.LINE_TARGET_USER_ID
  ) {
    // console.log("圖片訊息");
    Logger("圖片訊息");
    // console.log(event.message);
    // console.log(event.message.contentProvider.originalContentUrl;
    getImages(event.message.id).then((res) => {
      Logger("res");
      try {
        const form = new FormData();
        const file = fs.createReadStream("out.jpeg");
        form.append("imageFile", file);
        form.append("message", "out.jpeg"); // :??
        const axios_options = {
          method: "post",
          url: "https://notify-api.line.me/api/notify",
          headers: {
            Authorization: `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
            "Content-Type": "multipart/form-data",
          },
          data: form,
        };

        axios(axios_options)
          .then((response) => {
            if (response.status === 200) {
              Logger("Line Notify sent successfully!");
            } else {
              Logger(
                `Line Notify sent failed! not send message content: ${event.message.text}`
              );
              dchook.warning(
                `**班代群組訊息沒有傳送 IMAGE**`,
                `傳送失敗 - 不可逆原因沒有傳送成功!`,
                `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`
              );
            }
          })
          .catch((error) => {
            console.error(error);
            dchook.warning(
              `**班代群組訊息沒有傳送 IMAGE**`,
              `傳送失敗 - 不可逆原因沒有傳送成功!`,
              `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`
            );
          });
      } catch (error) {
        console.error(error);
        dchook.warning(
          `**班代群組訊息沒有傳送 IMAGE CATRY ERRO**`,
          `遇到連過濾器都不能決定的可傳訊息 - pattern.test(event.message.text) 被刷掉的`,
          `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}\n${error}\n${error.stack}`
        );
      }
    });
  } else {
    sendTimestamp = 0;
    dchook.warning(
      `**班代群組訊息沒有傳送 IMAGE**`,
      `遇到連過濾器都不能決定的可傳訊息 - pattern.test(event.message.text) 被刷掉的`,
      `<@${process.env.DISCORD_WEBHOOK_TAG_USER}> \n由: ${event.source.userId}\n 內文訊息: ${event.message.text}`
    );
  }
});

// Bot所監聽的webhook路徑與port
bot.listen(`/${process.env.URL_ROOT}`, process.env.URL_PORT, function () {
  Logger("[BOT已準備就緒]");
  Logger(`URL:https://${process.env.DOMAIN_NAME}/${process.env.URL_ROOT}`);
  Logger("[BOT已準備就緒]");
});

function getImages(messageId) {
  return new Promise((resolve) => {
    const axios_options = {
      method: "get",
      url: `https://api-data.line.me/v2/bot/message/${messageId}/content`,
      responseType: "stream",
      headers: {
        Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
      },
    };

    axios(axios_options).then((response) => {
      if (response.status === 200) {
        var stream = response.data.pipe(fs.createWriteStream("out.jpeg"));
        stream.on("finish", function () {
          Logger("stream end");
          stream.end();
          setTimeout(() => {
            resolve(true);
          }, 1000);
        });
      } else {
        resolve(null);
      }
    });
  });
}

function matchPattern(text) {
  if (text.match(/^(?=.*班長|班代)[\s\S]*$/)) {
    if (text.match(/(大三)/gi)) {
      return true;
    } else if (text.match(/(大一|大二|大四|二技)/gi)) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}
