function extrapolate(array) {
  const result = [...array];
  if (result[2] === null && result[0] !== null && result[1] !== null) {
    result[2] = result[1] + (result[1] - result[0]);
  }
  return result;
}

function calculateSupportBoost(price, supportLevels, decayFactor) {
  let supportBoost = 0;
  for (let i = 0; i < supportLevels.length; i++) {
    let distance = price - supportLevels[i];
    supportBoost += Math.exp(-decayFactor * (distance / supportLevels[i]));
  }
  return supportBoost;
}

function calculateResistancePenalty(price, resistanceLevels, decayFactor) {
  let resistancePenalty = 0;
  for (let i = 0; i < resistanceLevels.length; i++) {
    let distance = resistanceLevels[i] - price;
    resistancePenalty += Math.exp(-decayFactor * (distance / resistanceLevels[i]));
  }
  return resistancePenalty;
}

function calculateBullishPercentage(supportBoost, resistancePenalty) {
  let bullishPercentage = (supportBoost / (supportBoost + resistancePenalty)) * 100;
  return bullishPercentage;
}

function calculateMDemarkBullishPercentage(price, support, resistance, decayFactor) {
  let supportBoost = Math.exp(-decayFactor * (price - support) / support);
  let resistancePenalty = Math.exp(-decayFactor * (resistance - price) / resistance);
  let bullishPercentage = (supportBoost / (supportBoost + resistancePenalty)) * 100;
  return bullishPercentage;
}

function outputSignal(close, support, resists) {

  if (support.some(level => level === null)) {
    console.warn("Support levels contain null values!");
    support = extrapolate(support);
    console.warn(support);
  }

  if (resists.some(level => level === null)) {
    console.warn("Resistance levels contain null values!");
    resists = extrapolate(resists);
    console.warn(resists);
  }

  var supportValue = calculateSupportBoost(close, support, 0.1);
  var resistanceValue = calculateResistancePenalty(close, resists, 0.1);
  var bullishPercentage = calculateBullishPercentage(supportValue, resistanceValue);
  var processedScore = sortScore(bullishPercentage);
  return processedScore;

}

function sortScore(x) {
  if (x >= 70) {
    return ["VERY STRONG BUY", x];
  } else if (x >= 60) {
    return ["STRONG BUY", x];
  } else if (x > 50.1) {
    return ["BUY", x];
  } else if (x >= 49) {
    return ["HOLD", x];
  } else if (x >= 45) {
    return ["SELL/SHORT", x];
  } else {
    return ["STRONG SELL/SHORT", x];
  }
}

function calculateAveragePivotScore(scores) {
  // In order - Weights: [Camarilla, Demark, Fibonacci, Woodie, Classic]
  const weights = [0.30, 0.25, 0.20, 0.15, 0.10];
  const finalScore = scores.reduce((sum, score, index) => sum + score * weights[index], 0);
  return finalScore;
}

//fetchPivotData(symbol = 'NASDAQ:NVDA')
async function fetchPivotData(symbol) {
  const url = `https://scanner.tradingview.com/symbol?symbol=${symbol}&fields=Pivot.M.Classic.R3,Pivot.M.Classic.R2,Pivot.M.Classic.R1,Pivot.M.Classic.Middle,Pivot.M.Classic.S1,Pivot.M.Classic.S2,Pivot.M.Classic.S3,Pivot.M.Fibonacci.R3,Pivot.M.Fibonacci.R2,Pivot.M.Fibonacci.R1,Pivot.M.Fibonacci.Middle,Pivot.M.Fibonacci.S1,Pivot.M.Fibonacci.S2,Pivot.M.Fibonacci.S3,Pivot.M.Camarilla.R3,Pivot.M.Camarilla.R2,Pivot.M.Camarilla.R1,Pivot.M.Camarilla.Middle,Pivot.M.Camarilla.S1,Pivot.M.Camarilla.S2,Pivot.M.Camarilla.S3,Pivot.M.Woodie.R3,Pivot.M.Woodie.R2,Pivot.M.Woodie.R1,Pivot.M.Woodie.Middle,Pivot.M.Woodie.S1,Pivot.M.Woodie.S2,Pivot.M.Woodie.S3,Pivot.M.Demark.R1,Pivot.M.Demark.Middle,Pivot.M.Demark.S1,close`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const fields = data;

    const FibonacciSupport = [fields['Pivot.M.Fibonacci.S1'], fields['Pivot.M.Fibonacci.S2'], fields['Pivot.M.Fibonacci.S3']];
    const FibonacciResist = [fields['Pivot.M.Fibonacci.R1'], fields['Pivot.M.Fibonacci.R2'], fields['Pivot.M.Fibonacci.R3']];

    const CamarillaSupport = [fields['Pivot.M.Camarilla.S1'], fields['Pivot.M.Camarilla.S2'], fields['Pivot.M.Camarilla.S3']];
    const CamarillaResist = [fields['Pivot.M.Camarilla.R1'], fields['Pivot.M.Camarilla.R2'], fields['Pivot.M.Camarilla.R3']];

    const WoodieSupport = [fields['Pivot.M.Woodie.S1'], fields['Pivot.M.Woodie.S2'], fields['Pivot.M.Woodie.S3']];
    const WoodieResist = [fields['Pivot.M.Woodie.R1'], fields['Pivot.M.Woodie.R2'], fields['Pivot.M.Woodie.R3']];

    const ClassicSupport = [fields['Pivot.M.Classic.S1'], fields['Pivot.M.Classic.S2'], fields['Pivot.M.Classic.S3']];
    const ClassicResist = [fields['Pivot.M.Classic.R1'], fields['Pivot.M.Classic.R2'], fields['Pivot.M.Classic.R3']];

    const Close = fields['close'];

    const MDSupport = fields['Pivot.M.Demark.S1'];
    const MDResist = fields['Pivot.M.Demark.R1'];

    const result = {
      ClassicSupport,
      ClassicResist,
      FibonacciSupport,
      FibonacciResist,
      CamarillaSupport,
      CamarillaResist,
      WoodieSupport,
      WoodieResist,
      MDSupport,
      MDResist,
      Close
    };

    console.log(result);

    localStorage.setItem("_data_RawPivotIndicators", JSON.stringify(result));
    localStorage.setItem("_readystate_RawPivotIndicators", "1"); // Set ready state

    return {
      ClassicSupport,
      ClassicResist,
      FibonacciSupport,
      FibonacciResist,
      CamarillaSupport,
      CamarillaResist,
      WoodieSupport,
      WoodieResist,
      MDSupport,
      MDResist,
      Close
    };

  } catch (error) {
    console.error('Error fetching pivot data:', error);
  }
}
function getPivotScores(symbol) {
  fetchPivotData(symbol).then(pivotData => {

    var returnClassic = outputSignal(pivotData.Close, pivotData.ClassicSupport, pivotData.ClassicResist);
    //console.log(`CLASSIC | ${returnClassic[0]} | ${returnClassic[1]}`);

    var returnFibonacci = outputSignal(pivotData.Close, pivotData.FibonacciSupport, pivotData.FibonacciResist);
    //console.log(`FIBONACCI | ${returnFibonacci[0]} | ${returnFibonacci[1]}`);

    var returnCamarilla = outputSignal(pivotData.Close, pivotData.CamarillaSupport, pivotData.CamarillaResist);
    //console.log(`CAMARILLA | ${returnCamarilla[0]} | ${returnCamarilla[1]}`);

    var returnWoodie = outputSignal(pivotData.Close, pivotData.WoodieSupport, pivotData.WoodieResist);
    //console.log(`WOODIE | ${returnWoodie[0]} | ${returnWoodie[1]}`);

    var MDBullishPercentage = calculateMDemarkBullishPercentage(pivotData.Close, pivotData.MDSupport, pivotData.MDResist, 0.1);
    var returnMDemark = sortScore(MDBullishPercentage);
    //console.log(`M DEMARK | ${returnMDemark[0]} | ${returnMDemark[1]}`);

    var finalScore = calculateAveragePivotScore([returnCamarilla[1], returnMDemark[1], returnFibonacci[1], returnWoodie[1], returnClassic[1]]);
    var returnFinalScore = sortScore(finalScore);
    //console.log(`AVERAGE | ${returnFinalScore[0]} | ${returnFinalScore[1]}`);

    const technicalIndicators = {};

    technicalIndicators["Classic"] = [`${returnClassic[0]}`, `${returnClassic[1]}`];
    technicalIndicators["Fibonacci"] = [`${returnFibonacci[0]}`, `${returnFibonacci[1]}`];
    technicalIndicators["Camarilla"] = [`${returnCamarilla[0]}`, `${returnCamarilla[1]}`];
    technicalIndicators["Woodie"] = [`${returnWoodie[0]}`, `${returnWoodie[1]}`];
    technicalIndicators["M_Demark"] = [`${returnMDemark[0]}`, `${returnMDemark[1]}`];
    technicalIndicators["Average"] = [`${returnFinalScore[0]}`, `${returnFinalScore[1]}`];

    // Store data
    localStorage.setItem("_data_PivotIndicators", JSON.stringify(technicalIndicators));
    localStorage.setItem("_readystate_PivotIndicators", "1"); // Set ready state
  });
}

// Callback function to run when ESG data is ready
function Export_PivotIndicators() {
  const pivotIndicatorsData = localStorage.getItem("_data_PivotIndicators");
  if (pivotIndicatorsData) {
    const parsedPivotIndicators = JSON.parse(pivotIndicatorsData);
    console.log("✅ Pivot Indicators Ready:");
    console.log(parsedPivotIndicators);
  } else {
    console.log("❌ Pivot indicators data not found in localStorage.");
  }
}

function Export_RawPivotIndicators() {
  const rawPivotIndicatorsData = localStorage.getItem("_data_RawPivotIndicators");
  if (rawPivotIndicatorsData) {
    const parsedRawPivotIndicators = JSON.parse(rawPivotIndicatorsData);
    console.log("✅ Raw Pivot Indicators Ready:");
    console.log(parsedRawPivotIndicators);
  } else {
    console.log("❌ Raw pivot indicators data not found in localStorage.");
  }
}


// USAGE
/*
getPivotScores('NASDAQ:AMZN');
executeOnReady("_readystate_PivotIndicators", Export_PivotIndicators);
executeOnReady("_readystate_RawPivotIndicators", Export_RawPivotIndicators);
*/
