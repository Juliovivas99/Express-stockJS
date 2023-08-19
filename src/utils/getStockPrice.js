const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

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

module.exports = getStockPrice;
