// SECTION: Metric weights and benchmarks
const weights = {
  valuationRatios: {
    evToSales: 25,
    evToOperatingCashFlow: 20,
    evToFreeCashFlow: 20,
    evToEBITDA: 20,
    netDebtToEBITDA: 15,
  },
  profitabilityRatios: {
    returnOnAssets: 20,
    returnOnEquity: 20,
    returnOnInvestedCapital: 20,
    returnOnCapitalEmployed: 20,
    returnOnTangibleAssets: 20,
  },
  liquidityRatios: {
    currentRatio: 40,
    workingCapital: 30,
    netCurrentAssetValue: 30,
  },
  efficiencyRatios: {
    daysOfSalesOutstanding: 20,
    daysOfInventoryOutstanding: 20,
    daysOfPayablesOutstanding: 20,
    operatingCycle: 20,
    cashConversionCycle: 20,
  },
  cashFlowRatios: {
    freeCashFlowYield: 35,
    earningsYield: 25,
    incomeQuality: 20,
    capexToOperatingCashFlow: 10,
    capexToDepreciation: 10,
  },
};

const benchmarks = {
  evToSales: 5,
  evToOperatingCashFlow: 15,
  evToFreeCashFlow: 20,
  evToEBITDA: 12,
  netDebtToEBITDA: 1.5,
  
  returnOnAssets: 0.08,
  returnOnEquity: 0.15,
  returnOnInvestedCapital: 0.12,
  returnOnCapitalEmployed: 0.1,
  returnOnTangibleAssets: 0.08,

  currentRatio: 1.0,
  workingCapital: 0, // Should be > 0
  netCurrentAssetValue: 0, // Should be > 0

  daysOfSalesOutstanding: 45,
  daysOfInventoryOutstanding: 30,
  daysOfPayablesOutstanding: 60,
  operatingCycle: 75,
  cashConversionCycle: 0, // Negative is better

  freeCashFlowYield: 0.05,
  earningsYield: 0.04,
  incomeQuality: 1,
  capexToOperatingCashFlow: 0.25,
  capexToDepreciation: 1.0,
};

function evaluateMetric(metric, value, benchmark, higherIsBetter = false) {
  if (value === null || value === undefined) return [value, 'N/A'];
  const comparison = higherIsBetter
    ? value >= benchmark
    : value <= benchmark;
  return [value, comparison ? 'positive' : 'negative'];
}

async function analyzeFinancials(symbol, apikey) {
  const res = await fetch(
    `https://financialmodelingprep.com/stable/key-metrics?symbol=${symbol}&apikey=${apikey}`
  );
  const data = await res.json();
  const latest = data[0];

  let valuationRatios = {}, profitabilityRatios = {}, liquidityRatios = {}, efficiencyRatios = {}, cashFlowRatios = {};
  let summaries = {
    valuationRatios: 0,
    profitabilityRatios: 0,
    liquidityRatios: 0,
    efficiencyRatios: 0,
    cashFlowRatios: 0,
  };

  const processSection = (section, sectionData) => {
    for (const key in weights[section]) {
      const value = latest[key];
      const [v, status] = evaluateMetric(
        key,
        value,
        benchmarks[key],
        ['returnOn', 'earningsYield', 'freeCashFlowYield', 'incomeQuality'].some(prefix => key.startsWith(prefix)) || key === 'daysOfPayablesOutstanding'
      );
      const weight = weights[section][key];
      if (status === 'positive') summaries[section] += weight;
      sectionData[key] = [v, status, weight];
    }
  };

  processSection('valuationRatios', valuationRatios);
  processSection('profitabilityRatios', profitabilityRatios);
  processSection('liquidityRatios', liquidityRatios);
  processSection('efficiencyRatios', efficiencyRatios);
  processSection('cashFlowRatios', cashFlowRatios);

  valuationRatios['summary'] = [summaries.valuationRatios];
  profitabilityRatios['summary'] = [summaries.profitabilityRatios];
  liquidityRatios['summary'] = [summaries.liquidityRatios];
  efficiencyRatios['summary'] = [summaries.efficiencyRatios];
  cashFlowRatios['summary'] = [summaries.cashFlowRatios];

  //console.log("valuationRatios", valuationRatios);
  //console.log("profitabilityRatios", profitabilityRatios);
  //console.log("liquidityRatios", liquidityRatios);
  //console.log("efficiencyRatios", efficiencyRatios);
  //console.log("cashFlowRatios", cashFlowRatios);

const sectionWeights = {
  valuationRatios: 20,
  profitabilityRatios: 25,
  liquidityRatios: 15,
  efficiencyRatios: 15,
  cashFlowRatios: 25,
};

let overallScore = 0;
let calculationSteps = [];

for (const section in sectionWeights) {
  const score = summaries[section];
  const weight = sectionWeights[section] / 100;
  overallScore += score * weight;
  calculationSteps.push(`${score} * ${weight}`);
}

console.log("Overall Score: ", overallScore);
console.log("[calculation]", calculationSteps.join(" + ") + ` = ${overallScore}`);

// store 5 endpoint data in one array
var fundamentalAnalysis = {
    valuationRatios: valuationRatios,
    profitabilityRatios: profitabilityRatios,
    liquidityRatios: liquidityRatios,
    efficiencyRatios: efficiencyRatios,
    cashFlowRatios: cashFlowRatios,
    summary: overallScore
}

//console.log(fundamentalAnalysis);

localStorage.setItem("_data_FundamentalAnalysis", JSON.stringify(fundamentalAnalysis));
localStorage.setItem("_readystate_FundamentalAnalysis", "1"); // Set ready state

}
// end of logic code

function Export_FundamentalAnalysis() {
    const FundamentalAnalysis = JSON.parse(localStorage.getItem("_data_FundamentalAnalysis"));
    if (FundamentalAnalysis) {
        console.log("Fundamental Analysis:", FundamentalAnalysis);
    }
}

// Example usage:
// const API_KEY = 'API_KEY';
// analyzeFinancials("AAPL", API_KEY);

// executeOnReady('_readystate_FundamentalAnalysis', Export_FundamentalAnalysis); 
