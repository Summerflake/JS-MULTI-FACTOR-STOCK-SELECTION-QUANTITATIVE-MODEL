// ESG calculation helper
const lambdaFactor = 0.0277258;
function ESGBullishPercentage(score) {
    return 100 * Math.exp(-lambdaFactor * score);
}

// Fetch ESG data and store it
function getESGRating(SecuritySymbol) {
    const targetUrl = `https://finance.yahoo.com/quote/${SecuritySymbol}/sustainability`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    fetch(proxyUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const ESG = {};

            ESG["Overall"] = parseFloat(doc.querySelector('[data-testid="TOTAL_ESG_SCORE"] h4')?.innerText || "0");
            ESG["RiskLevel"] = doc.querySelector('[data-testid="TOTAL_ESG_SCORE"] .perf')?.innerText.trim() || "Unknown";
            ESG["Environmental"] = parseFloat(doc.querySelector('[data-testid="ENVIRONMENTAL_SCORE"] h4')?.innerText || "0");
            ESG["Sustainability"] = parseFloat(doc.querySelector('[data-testid="SOCIAL_SCORE"] h4')?.innerText || "0");
            ESG["Governance"] = parseFloat(doc.querySelector('[data-testid="GOVERNANCE_SCORE"] h4')?.innerText || "0");

            // Store data
            localStorage.setItem("_data_ESG", JSON.stringify(ESG));
            localStorage.setItem("_readystate_ESG", "1"); // ✅ Set ready state
        })
        .catch(error => {
            console.error("Error fetching ESG HTML:", error);
        });
}

// Callback function to run when ESG data is ready
function Export_ESG() {
    const ESG_StoredData = localStorage.getItem("_data_ESG");
    if (ESG_StoredData) {
        const ESGIndicator = JSON.parse(ESG_StoredData);
        console.log("ESG Data Ready:");
        console.log(ESGIndicator);
        console.log("Bullish %:", ESGBullishPercentage(ESGIndicator.Overall).toFixed(2) + "%");
    } else {
        console.log("❌ ESG data not found in localStorage.");
    }
}

// Start process
/*
getESGRating("AAPL");
executeOnReady("_readystate_ESG", Export_ESG);
*/