const currencyPairs = [
  "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", "AUD/USD",
  "USD/CAD", "NZD/USD", "EUR/JPY", "GBP/JPY", "EUR/GBP"
];

// Replace this with your own Twelve Data API key
const apiKey = "183028b2104b4abc8e4cede89ec43943";

// Fetch price data for a single forex pair
async function fetchPairChange(pair) {
  const [symbol1, symbol2] = pair.split("/");
  const symbol = `${symbol1}/${symbol2}`;

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=2&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || data.values.length < 2) {
      return null;
    }

    const latest = parseFloat(data.values[0].close);
    const previous = parseFloat(data.values[1].close);
    const changePercent = ((latest - previous) / previous) * 100;

    return changePercent;
  } catch (error) {
    console.error(`Error fetching data for ${pair}:`, error);
    return null;
  }
}

// Fetch data for all currency pairs
async function fetchForexData() {
  const result = {};
  for (const pair of currencyPairs) {
    const change = await fetchPairChange(pair);
    if (change !== null) {
      result[pair] = change;
    }
  }
  return result;
}

// Update bubbles on screen
async function updateBubbles() {
  const data = await fetchForexData();
  if (!data) return;

  const container = document.getElementById("bubble-container");
  container.innerHTML = "";

  for (const pair of currencyPairs) {
    const change = data[pair];
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    // Add up/down arrow
    const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "➖";
    bubble.textContent = `${pair}\n${arrow} ${change.toFixed(2)}%`;

    // Style the bubble color
    if (change > 0) {
      bubble.style.backgroundColor = "rgba(0, 200, 0, 0.7)";
    } else if (change < 0) {
      bubble.style.backgroundColor = "rgba(200, 0, 0, 0.7)";
    } else {
      bubble.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    }

    // Random bubble size based on absolute % change
    const size = 50 + Math.min(Math.abs(change) * 5, 100);
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Random position inside the container
    bubble.style.top = `${Math.random() * 80}%`;
    bubble.style.left = `${Math.random() * 80}%`;

    container.appendChild(bubble);
  }
}

// Refresh every 5 minutes (300,000 ms)
setInterval(updateBubbles, 300000);

// Initial load
updateBubbles();
