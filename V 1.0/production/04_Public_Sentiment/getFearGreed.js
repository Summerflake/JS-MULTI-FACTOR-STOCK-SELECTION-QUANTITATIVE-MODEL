// Let x = FearGreedScore (0 ≤ x ≤ 100)
// Define center c = 57.5 (middle of 55 and 60)
// Define left boundary l = 20, right boundary r = 79
// Peak confidence p = 0.8 (80%)
// Min confidence m = 0.2 (20%)

// Confidence function:
// For x ∈ [l, r]:
// confidence(x) = m + (p - m) * (1 - ((x - c) / (c - l))^2 )  for x ≤ c
// confidence(x) = m + (p - m) * (1 - ((x - c) / (r - c))^2 )  for x > c

// For x < l or x > r:
// confidence(x) = m

function fearGreedToPercentageConfidence(x) {
  const l = 20;
  const r = 79;
  const c = 57.5;
  const p = 0.8;  // 80%
  const m = 0.2;  // 20%
  
  if (x <= l || x >= r) {
    return m * 100;  // 20%
  }
  
  if (x <= c) {
    let ratio = (x - c) / (c - l);
    return (m + (p - m) * (1 - ratio * ratio)) * 100;
  } else {
    let ratio = (x - c) / (r - c);
    return (m + (p - m) * (1 - ratio * ratio)) * 100;
  }
}

async function fetchFearAndGreedIndex() {
    const url = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata';

    try {
        const response = await fetch(url);
        const data = await response.json();

        var fearAndGreed = data.fear_and_greed;
        var score = fearAndGreed.score;
        var percentageScore = fearGreedToPercentageConfidence(score);
        fearAndGreed["percentageScore"] = percentageScore;
        
        localStorage.setItem("_data_FearGreedData", JSON.stringify(fearAndGreed));
        localStorage.setItem("_readystate_FearGreedData", "1"); // ✅ Set ready state

        globalThis.fearAndGreedData = fearAndGreed;

    } catch (error) {
        console.error('Failed to fetch CNN Fear & Greed Index:', error);
    }
}

// Your usage
function Export_FearGreedData() {
    const FearAndGreedData = JSON.parse(localStorage.getItem("_data_FearGreedData"));
    if (FearAndGreedData) {
        console.log("Fear & Greed Data:", FearAndGreedData);
        console.log("Rating:", FearAndGreedData.rating);
        console.log("Score:", FearAndGreedData.score);
    }
}

// fetchFearAndGreedIndex();
// executeOnReady('_readystate_FearGreedData', Export_FearGreedData);

