const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3210; // 你可以選擇任何你想要的端口

// 設定 bodyParser 以解析 JSON 資料
app.use(bodyParser.json());

// 設定接收 Line Bot Webhook 的端點
app.post('/webhook', (req, res) => {
    const body = req.body;
    console.log('收到 Line Bot Webhook 請求：', body);

    // 在這裡處理收到的訊息
    res.status(200).end();
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器正在監聽端口 ${port}`);
});
