// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const APP_ID = '6e681b08-9c8f-4601-b7d2-a098671e1370';
const apiUrl = 'https://qianfan.baidubce.com/v2/app/conversation';

app.post('/chat', async (req, res) => {
  const message = req.body.message;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`
  };

  const body = JSON.stringify({
    app_id: APP_ID,
    messages: [
      {
        role: "user",
        content: message
      }
    ]
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Qianfan API:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
