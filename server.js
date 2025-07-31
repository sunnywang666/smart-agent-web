const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.message;

    const response = await axios.post(
      'https://appbuilder.baidu.com/api/open/app/conversation',
      {
        app_id: '6e681b08-9c8f-4601-b7d2-a09867e1e370',  // 你的智能体 ID
        query: userInput,
        stream: false,
        session_id: 'test-session-001'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer bce-v3/ALTAK-VVTa0jmrNhDHhIZ0pX1gy/7a645e0e306794559acec2ce192deef390e22b74'
        }
      }
    );

    res.json(response.data);  // 返回智能体原始响应
  } catch (error) {
    console.error('调用失败：', error?.response?.data || error.message);
    res.status(500).json({ error: '智能体 API 调用失败' });
  }
});

app.listen(port, () => {
  console.log(`✅ 智能体服务运行中：http://localhost:${port}`);
});
