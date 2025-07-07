async function fetchFullQuote(securitySymbol, apiKey) {
    const url = `https://financialmodelingprep.com/api/v3/quote/${securitySymbol}?apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Save data to localStorage
        localStorage.setItem('_data_FullQuote', JSON.stringify(data));
        localStorage.setItem('_readystate_FullQuote', '1');

        console.log('✅ FullQuote data saved:', data);

    } catch (error) {
        console.error('❌ Failed to fetch FullQuote data:', error);
    }
}

function Export_FullQuote() {
    const stored = JSON.parse(localStorage.getItem('_data_FullQuote'));
    if (stored) { 
        console.log("FROM READY STATE");
        console.log("Stock Full Quote Details (from localStorage):", stored);
    }
}

//fetchFullQuote('AAPL', API_KEY); 
