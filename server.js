require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/conversation', async (req, res) => {
  const { messages, app_id } = req.body;

  try {
    const response = await axios.post(
      'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro',
      {
        messages,
        app_id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('请求出错：', error.response?.data || error.message);
    res.status(500).json({
      error: '服务器请求失败',
      detail: error.response?.data || error.message
    });
  }
});

app.listen(3000, () => {
  console.log('服务器已启动，监听端口 ${port}');
});
