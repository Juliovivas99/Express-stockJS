const axios = require('axios');

const callBody = async () => {
    const url = 'http://localhost:3000/stockprice-body';
  try {
    const response = await axios.post(url, {
      stockSymbol: 'AAPL'
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

callBody();