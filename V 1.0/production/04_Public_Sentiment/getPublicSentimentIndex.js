/*
function getPublicSentimentIndex(SecuritySymbol) {
  fetch(`https://api.allorigins.win/raw?url=https://altindex.com/ticker/${SecuritySymbol}/sentiment`)
    .then(response => response.text())
    .then(html => {
      // Match the first number inside the .clearfix block
      const match = html.match(/<div class="clearfix"[^>]*>\s*<span[^>]*>\s*(\d+)/);

      if (match) {
        const sentimentScore = match[1]; // e.g., "43"
        console.log("Public Sentiment Index |", sentimentScore);

        localStorage.setItem("_data_PublicSentimentIndex", sentimentScore);
        localStorage.setItem("_readystate_PublicSentimentIndex", "1"); // ✅ Set ready state
        
      } else {
        console.log("Sentiment score not found.");
      }
    })
    .catch(error => {
      console.error("Error fetching HTML:", error);
    });
}

// Usage
function Export_PublicSentimentIndex() {
  const PublicSentimentIndex = localStorage.getItem("_data_PublicSentimentIndex");
  if (PublicSentimentIndex) {
    console.log("Public Sentiment Index:", PublicSentimentIndex);
  }
}
*/
// getPublicSentimentIndex("AAPL");
// executeOnReady('_readystate_PublicSentimentIndex', Export_PublicSentimentIndex);

/*
function sentimentToConfidence(S) {
  const m = 0.2;   // 20%
  const p = 1.0;   // 100%
  const c = 75;    // peak at 75
  const a = 0.00123;

  return (m + (p - m) * Math.exp(-a * Math.pow(S - c, 2))) * 100;
}
*/

function getPublicSentimentIndex(SecuritySymbol) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.allorigins.win/raw?url=https://altindex.com/ticker/${SecuritySymbol}/sentiment`)
      .then(response => response.text())
      .then(html => {
        const match = html.match(/<div class="clearfix"[^>]*>\s*<span[^>]*>\s*(\d+)/);

        if (match) {
          const sentimentScore = match[1];
          console.log("Public Sentiment Index |", sentimentScore);

          localStorage.setItem("_data_PublicSentimentIndex", sentimentScore);
          localStorage.setItem("_readystate_PublicSentimentIndex", "1");
          resolve(sentimentScore);  // ✅ Signal done
        } else {
          console.log("Sentiment score not found.");
          reject(new Error("Sentiment score not found"));
        }
      })
      .catch(error => {
        console.error("Error fetching HTML:", error);
        reject(error);
      });
  });
}

function Export_PublicSentimentIndex() {
  const PublicSentimentIndex = localStorage.getItem("_data_PublicSentimentIndex");
  if (PublicSentimentIndex) {
    console.log("Public Sentiment Index:", PublicSentimentIndex);
  }
}