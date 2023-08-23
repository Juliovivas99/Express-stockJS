const axios = require('axios');

const fetchStockPrice = async () => {
  const url = 'http://localhost:3000/stockprice-header';
  
  try {
    const response = await axios.get(url, { //(url,) is the 'where', {'headers:{X-Stock-Symbol':' '}} is the 'how' of the get request
      headers: { //"Make a GET request to this URL, and while you're doing it, use these headers."
        'X-Stock-Symbol': 'AAPL'  // The stock symbol goes here
      }
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error:', error);
  }
};

fetchStockPrice();
