const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

app.get('/fetchQuote', async (req, res) => {
  try {
    const src = req.query.src;
    const dst = req.query.dst;
    const amount = req.query.amount;

    const response = await fetch(`https://api.1inch.dev/swap/v5.2/137/quote?src=${src}&dst=${dst}&amount=${amount}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
        'Authorization': `Bearer 7IwHaopJoiFVU1pQGFnQUx7LW9kHHIRD`,
      },
    });
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
