const express = require('express');
const app = express();
const getStockPrice = require('./utils/getStockPrice');
const connection = require('../db.js'); // Ensure this path is correct.

app.use(express.json());

// Root route to prevent "Cannot GET /" message
app.get('/', (req, res) => {
  res.send('Welcome to the Stock Price Server! Use /stockprice/:symbol to get the price of a stock.');
});

// Route to get stock price by URL parameter
app.get('/stockprice/:symbol', async (req, res) => {
  const stockSymbol = req.params.symbol;
  try {
    const result = await getStockPrice(stockSymbol);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock price.' });
  }
});

// Route to get stock price by request header
app.get('/stockprice-header', async (req, res) => {
  const stockSymbol = req.header('X-Stock-Symbol');
  
  if (!stockSymbol) {
    return res.status(400).json({ error: 'X-Stock-Symbol header is required.' });
  }

  try {
    const result = await getStockPrice(stockSymbol);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock price.' });
  }
});

// Route to get stock price by request body
app.post('/stockprice-body', async (req, res) => {
  const stockSymbol = req.body.stockSymbol;

  if (!stockSymbol) {
    return res.status(400).json({ error: 'stockSymbol field is required in the request body.' });
  }

  try {
    const result = await getStockPrice(stockSymbol);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock price.' });
  }
});

// Catch-all for unhandled routes
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
