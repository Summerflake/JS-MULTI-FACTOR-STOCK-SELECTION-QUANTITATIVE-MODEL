async function fetchAndStoreStockBasicDetails(symbol, apiKey) {
    const url = `https://financialmodelingprep.com/stable/search-symbol?query=${symbol}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            const stockInfo = data[0];

            //console.log("Stock Basic Details:");
            //console.log("Symbol:", stockInfo.symbol);
            //console.log("Name:", stockInfo.name);
            //console.log("Currency:", stockInfo.currency);
            //console.log("Exchange Full Name:", stockInfo.exchangeFullName);
            //console.log("Exchange:", stockInfo.exchange);

            localStorage.setItem('_data_StockBasicDetails', JSON.stringify(stockInfo));

            globalThis.stockBasicDetails = stockInfo;

            const stored = JSON.parse(localStorage.getItem('_data_StockBasicDetails'));
            if (stored) {
                localStorage.setItem('_readystate_StockBasicDetails', '1');
                //console.log("Stock Details (from localStorage):", stored);
                //console.log(`Stock ID: ${stored.symbol}:${stored.exchange}`);
            }

        } else {
            console.warn("No data found for symbol:", symbol);
        }
    } catch (error) {
        console.error('Error fetching stock details:', error);
    }
}

function Export_StockBasicDetails() {
    const stored = JSON.parse(localStorage.getItem('_data_StockBasicDetails'));
    if (stored) { 
        console.log("FROM READY STATE");
        console.log("Stock Details (from localStorage):", stored);
        console.log(`Stock ID: ${stored.symbol}:${stored.exchange}`);
    }
}

/*
fetchAndStoreStockBasicDetails('AAPL', API_KEY); 
executeOnReady('_readystate_StockBasicDetails', Export_StockBasicDetails);
*/