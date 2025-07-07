// includes oscillators and moving averages

function analyzeOscillators({
    rsi, macd, stochasticK, cci, momentum,
    ao, stochRsi, williamsR, bullBearPower, ultimateOsc
}) {
    const results = [];

    function score(value, bearish, neutral, bullish, weight) {
        let result;
        if (value <= bearish[1]) result = 0;
        else if (value >= bullish[0]) result = 1;
        else result = 0.5;
        return result * weight;
    }

    results.push({
        name: "RSI(14)",
        value: rsi,
        score: score(rsi, [0, 30], [30, 70], [70, 100], 15),
        signal: rsi < 30 ? "Bearish" : rsi > 70 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "MACD(12,26)",
        value: macd,
        score: score(macd, [-Infinity, -1], [-1, 0], [0, Infinity], 15),
        signal: macd < -1 ? "Bearish" : macd > 0 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "Stochastic %K",
        value: stochasticK,
        score: score(stochasticK, [0, 20], [20, 80], [80, 100], 12),
        signal: stochasticK < 20 ? "Bearish" : stochasticK > 80 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "CCI(20)",
        value: cci,
        score: score(cci, [-Infinity, -100], [-100, 100], [100, Infinity], 10),
        signal: cci < -100 ? "Bearish" : cci > 100 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "Momentum(10)",
        value: momentum,
        score: score(momentum, [-Infinity, 0], [0, 10], [10, Infinity], 10),
        signal: momentum < 0 ? "Bearish" : momentum > 10 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "Awesome Oscillator",
        value: ao,
        score: score(ao, [-Infinity, -1], [-1, 0], [0, Infinity], 10),
        signal: ao < -1 ? "Bearish" : ao > 0 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "Stoch RSI Fast",
        value: stochRsi,
        score: score(stochRsi, [0, 20], [20, 80], [80, 100], 8),
        signal: stochRsi < 20 ? "Bearish" : stochRsi > 80 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "Williams %R",
        value: williamsR,
        score: score(williamsR, [-100, -80], [-80, -20], [-20, 0], 8),
        signal: williamsR < -80 ? "Bearish" : williamsR > -20 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "Bull Bear Power",
        value: bullBearPower,
        score: score(bullBearPower, [-Infinity, -1], [-1, 0], [0, Infinity], 7),
        signal: bullBearPower < -1 ? "Bearish" : bullBearPower > 0 ? "Bullish" : "Neutral"
    });

    results.push({
        name: "Ultimate Oscillator",
        value: ultimateOsc,
        score: score(ultimateOsc, [0, 30], [30, 70], [70, 100], 5),
        signal: ultimateOsc < 30 ? "Bearish" : ultimateOsc > 70 ? "Bullish" : "Neutral"
    });

    const oscillatorScore = results.reduce((sum, obj) => sum + obj.score, 0);
    // results for oscillator score
    results.push({
        name: "Summary",
        value: oscillatorScore,
        score: 0,
        signal: 0
    });

    console.log(`Oscillator Analysis | ${oscillatorScore.toFixed(2)}% out of 100`);
    results.forEach(indicator => {
        console.log(`${indicator.name} | ${indicator.value} | ${indicator.signal}`);
    });

    return results;
}

function analyzeMovingAverages(maIndicators, close) {
    const results = [];
    let totalScore = 0;

    function scoreMA({ value, close, weight, thresholdRatio = 0.01 }) {
        const threshold = thresholdRatio * close;

        let status;
        if (value > close + threshold) {
            status = "Bearish";
            return { score: 0, weighted: 0, status };
        } else if (value < close - threshold) {
            status = "Bullish";
            return { score: 1, weighted: weight, status };
        } else {
            status = "Neutral";
            return { score: 0.5, weighted: 0.5 * weight, status };
        }
    }

    maIndicators.forEach(ma => {
        const result = scoreMA({ value: ma.value, close, weight: ma.weight });
        totalScore += result.weighted;
        results.push({
            name: ma.name,
            value: ma.value,
            score: result.score,
            signal: result.status
        });
    });

    // Overall MA score
    results.push({
        name: "Summary",
        value: totalScore,
        score: 0,
        signal: 0
    });

    console.log(`Moving Average Analysis | ${totalScore.toFixed(2)}% out of 100`);


    results.forEach(ma => {
        console.log(`${ma.name} | ${ma.value} | ${ma.signal}`);
    });

    return results;
}

async function fetchTechnicalAnalysisData(symbol) {
    const url = `https://scanner.tradingview.com/symbol?symbol=${symbol}&fields=RSI,Stoch.K,CCI20,AO,Mom,MACD.macd,Stoch.RSI.K,W.R,BBPower,UO,EMA10,SMA10,EMA20,SMA20,EMA30,SMA30,EMA50,SMA50,EMA100,SMA100,EMA200,SMA200,Ichimoku.BLine,VWMA,HullMA9,close`;

    try {
        const response = await fetch(url);
        const fields = await response.json();

        return {
            RSI: fields['RSI'],
            StochK: fields['Stoch.K'],
            CCI20: fields['CCI20'],
            AO: fields['AO'],
            MOM: fields['Mom'],
            MACD: fields['MACD.macd'],
            StochRSIK: fields['Stoch.RSI.K'],
            WR: fields['W.R'],
            BBPower: fields['BBPower'],
            UO: fields['UO'],
            EMA10: fields['EMA10'],
            SMA10: fields['SMA10'],
            EMA20: fields['EMA20'],
            SMA20: fields['SMA20'],
            EMA30: fields['EMA30'],
            SMA30: fields['SMA30'],
            EMA50: fields['EMA50'],
            SMA50: fields['SMA50'],
            EMA100: fields['EMA100'],
            SMA100: fields['SMA100'],
            EMA200: fields['EMA200'],
            SMA200: fields['SMA200'],
            IchimokuBLine: fields['Ichimoku.BLine'],
            VWMA: fields['VWMA'],
            HullMA9: fields['HullMA9'],
            Close: fields['close']
        };
    } catch (error) {
        console.error('Error fetching technical analysis data:', error);
    }
}

async function getTechnicalAnalysisScores(symbol) {
    const data = await fetchTechnicalAnalysisData(symbol);

    const oscillatorResults = analyzeOscillators({
        rsi: data.RSI,
        macd: data.MACD,
        stochasticK: data.StochK,
        cci: data.CCI20,
        momentum: data.MOM,
        ao: data.AO,
        stochRsi: data.StochRSIK,
        williamsR: data.WR,
        bullBearPower: data.BBPower,
        ultimateOsc: data.UO
    });

    const MAIndicators = [
        { name: "EMA(10)", value: data.EMA10, weight: 10 },
        { name: "SMA(10)", value: data.SMA10, weight: 10 },
        { name: "EMA(20)", value: data.EMA20, weight: 10 },
        { name: "SMA(20)", value: data.SMA20, weight: 10 },
        { name: "EMA(30)", value: data.EMA30, weight: 10 },
        { name: "SMA(30)", value: data.SMA30, weight: 10 },
        { name: "EMA(50)", value: data.EMA50, weight: 8 },
        { name: "SMA(50)", value: data.SMA50, weight: 8 },
        { name: "EMA(100)", value: data.EMA100, weight: 5 },
        { name: "SMA(100)", value: data.SMA100, weight: 5 },
        { name: "EMA(200)", value: data.EMA200, weight: 2 },
        { name: "SMA(200)", value: data.SMA200, weight: 2 }
    ];

    const maResults = analyzeMovingAverages(MAIndicators, data.Close);

    var formattedOscillatorResults = {};
    oscillatorResults.forEach(indicator => {
        formattedOscillatorResults[indicator.name] = [
            Number(indicator.value.toFixed(5)),
            Number(indicator.score.toPrecision(3)),
            indicator.signal
        ];
    });

    var formattedMAResults = {};
    maResults.forEach(indicator => {
        formattedMAResults[indicator.name] = [
            Number(indicator.value.toFixed(5)),
            Number(indicator.score.toPrecision(3)),
            indicator.signal
        ];
    });

    //console.log("\nLogged Oscillator Results:", formattedOscillatorResults);
    //console.log("\nLogged Moving Average Results:", formattedMAResults);

    localStorage.setItem("_data_OscillatorData", JSON.stringify(formattedOscillatorResults));
    localStorage.setItem("_data_MAData", JSON.stringify(formattedMAResults));
    localStorage.setItem("_readystate_OscillatorData", "1"); // ✅ Set ready state
    localStorage.setItem("_readystate_MAData", "1"); // ✅ Set ready state
}

// Your usage
function Export_OscillatorData() {
    const OscillatorData = JSON.parse(localStorage.getItem("_data_OscillatorData"));
    if (OscillatorData) {
        console.log("Oscillator Data:", OscillatorData);
    }
}

function Export_MAData() {
    const MAData = JSON.parse(localStorage.getItem("_data_MAData"));
    if (MAData) {
        console.log("MA Data:", MAData);
    }
}

// USAGE
// getTechnicalAnalysisScores('NASDAQ:AMZN');
// executeOnReady('_readystate_OscillatorData', Export_OscillatorData);
// executeOnReady('_readystate_MAData', Export_MAData);
