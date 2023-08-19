//console 'node src/app.js' to run
const express = require('express');
const app = express();
const getStockPrice = require('./utils/getStockPrice');

app.use(express.json());


app.get('/stockprice/:symbol', async (req, res) => 
{
    const stockSymbol = req.params.symbol;
    try 
    {
        const result = await getStockPrice(stockSymbol);
        res.json({ message: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock price.' });
    }
});

app.get('/stockprice-header', async (req, res) => 
{
    const stockSymbol = req.header('X-Stock-Symbol');
    
    if (!stockSymbol) 
    {
        return res.status(400).json({ error: 'X-Stock-Symbol header is required.' });
    }

    try 
    {
        const result = await getStockPrice(stockSymbol);
        res.json({ message: result });
    } 
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to fetch stock price.' });
    }
});


app.post('/stockprice-body', async (req, res) => 
{
    const stockSymbol = req.body.stockSymbol;

    if (!stockSymbol) 
    {
        return res.status(400).json({ error: 'stockSymbol field is required in the request body.' });
    }

    try 
    {
        const result = await getStockPrice(stockSymbol);
        res.json({ message: result });
    } 
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to fetch stock price.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => 
{
    console.log(`Server is running on http://localhost:${PORT}`);
});
