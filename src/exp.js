//console 'node src/exp.js' to run

const axios = require('axios');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

const app = express();

async function getStockPrice(stockSymbol) 
{
    const apiKey = process.env.AlphaVantageAPIKey;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=1min&apikey=${apiKey}`;

    try 
    {
        const response = await axios.get(url);
        const data = response.data;

        if (data && data['Time Series (1min)'])
        {
            const latestTime = Object.keys(data['Time Series (1min)'])[0];
            const stockPrice = data['Time Series (1min)'][latestTime]['4. close'];
            const result = `The latest stock price for ${stockSymbol} is ${stockPrice} \n`;

            fs.appendFile('stock-price.txt', result, (error) => 
            {
                if (error) throw error;
                console.log('The file has been saved!');
            });

            return result;
        } 
        else 
        {
            return `Unable to fetch stock price for ${stockSymbol}`;
        }
    } 
    catch (error) 
    {
        return `Error fetching stock price for ${stockSymbol}: ${error}`;
    }
}

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

const PORT = 3000;
app.listen(PORT, () => 
{
    console.log(`Server is running on http://localhost:${PORT}`);
});
// http://localhost:3000/stockprice/:symbol