const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

symbols.forEach(symbol => {
    fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
});