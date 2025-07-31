require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { HmacSHA256 } = require('crypto-js');
const uuid = require('uuid');
const axios = require('axios');
const dayjs = require('dayjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const AK = process.env.BAIDU_API_KEY;
const SK = process.env.BAIDU_SECRET_KEY;
const BOT_NAME = process.env.BAIDU_BOT_NAME || 'your-bot-name'; // 记得替换为你的智能体英文名

app.post('/chat', async (req, res) => {
    try {
        const body = {
            messages: req.body.messages,
        };
        const host = 'aip.baidubce.com';
        const path = `/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions/${BOT_NAME}`;
        const url = `https://${host}${path}`;

        const method = 'POST';
        const timestamp = dayjs().toISOString();
        const authStringPrefix = `bce-auth-v1/${AK}/${timestamp}/1800`;

        const signingKey = HmacSHA256(authStringPrefix, SK).toString();

        // 创建CanonicalRequest
        const canonicalHeaders = `host:${host}`;
        const signedHeaders = 'host';
        const canonicalRequest = `${method}\n${path}\n\n${canonicalHeaders}`;
        const signature = HmacSHA256(canonicalRequest, signingKey).toString();

        const authorization = `${authStringPrefix}/${signedHeaders}/${signature}`;

        const response = await axios.post(url, body, {
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json',
                'Host': host
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
