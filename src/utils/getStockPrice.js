const axios = require('axios');
const connection = require('../../db.js');
require('dotenv').config();

async function getStockPrice(stockSymbol) 
{
    const apiKey = process.env.AlphaVantageAPIKey;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=1min&apikey=${apiKey}`;

    const findStockSql = 'SELECT * FROM stock_prices WHERE symbol = ?';
  
  return new Promise((resolve, reject) => {
    connection.query(findStockSql, [stockSymbol], async (err, results) => {
      if (err) return reject(`Database query failed: ${err}`);
      
      // If found in the database
      if (results.length > 0) {
        const now = new Date();
        const lastUpdated = new Date(results[0].last_updated);
        
        const diffInMinutes = Math.floor((now - lastUpdated) / 60000);
        
        // If the last update was more than 5 minutes ago, update the stock info
        if (diffInMinutes > 5) {
          try {
            const response = await axios.get(url);
            const data = response.data;
            if (data && data['Time Series (1min)']) {
              const latestTime = Object.keys(data['Time Series (1min)'])[0];
              const stockPrice = data['Time Series (1min)'][latestTime]['4. close'];

              // SQL to update the stock info
              const updateStockSql = 'UPDATE stock_prices SET price = ?, last_updated = ? WHERE symbol = ?';

              connection.query(updateStockSql, [stockPrice, new Date(), stockSymbol], (err, results) => {
                if (err) return reject(`Database update failed: ${err}`);

                resolve(`The latest stock price for ${stockSymbol} is ${stockPrice}`);
              });
            }
          } catch (err) {
            reject(`Error fetching stock price for ${stockSymbol}: ${err}`);
          }
        } else {
          resolve(`The latest stock price for ${stockSymbol} is ${results[0].price}`);
        }
      } else{
        // If not found in the database, fetch and insert the stock info
        try {
          const response = await axios.get(url);
          const data = response.data;
          
          if (data && data['Time Series (1min)']) {
            const latestTime = Object.keys(data['Time Series (1min)'])[0];
            const stockPrice = data['Time Series (1min)'][latestTime]['4. close'];
            
            // SQL to insert the new stock info
            const insertStockSql = 'INSERT INTO stock_prices (symbol, price, last_updated) VALUES (?, ?, ?)';
            
            connection.query(insertStockSql, [stockSymbol, stockPrice, new Date()], (err, results) => {
              if (err) return reject(`Database insertion failed: ${err}`);

              resolve(`The latest stock price for ${stockSymbol} is ${stockPrice}`);
            });
          }
        } catch (err) {
          reject(`Error fetching stock price for ${stockSymbol}: ${err}`);
        }
      }
    });
  });
}

module.exports = getStockPrice;