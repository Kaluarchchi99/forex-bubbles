const currencyPairs = [
  "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", "AUD/USD",
  "USD/CAD", "NZD/USD", "EUR/JPY", "GBP/JPY", "EUR/GBP"
];

// Replace with your actual API key
const apiKey = "YOUR_AP183028b2104b4abc8e4cede89ec43943";

async function fetchPairChange(pair) {
  const [symbol1, symbol2] = pair.split("/");
  const symbol = `${symbol1}/${symbol2}`;
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=2&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || data.values.length < 2) return null;

    const latest = parseFloat(data.values[0].close);
    const previous = parseFloat(data.values[1].close);
    const changePercent = ((latest - previous) / previous) * 100;

    return changePercent;
  } catch (error) {
    console.error(`Error fetching ${pair}:`, error);
    return null;
  }
}

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

async function updateBubbles() {
  const data = await fetchForexData();
  if (!data) return;

  const container = document.getElementById("bubble-container");
  container.innerHTML = "";

  for (const pair of currencyPairs) {
    const change = data[pair];
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "➖";
    bubble.textContent = `${pair}\n${arrow} ${change.toFixed(2)}%`;

    if (change > 0) {
      bubble.style.backgroundColor = "rgba(0, 200, 0, 0.7)";
    } else if (change < 0) {
      bubble.style.backgroundColor = "rgba(200, 0, 0, 0.7)";
    } else {
      bubble.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    }

    const size = 50 + Math.min(Math.abs(change) * 5, 100);
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.top = `${Math.random() * 80}%`;
    bubble.style.left = `${Math.random() * 80}%`;

    container.appendChild(bubble);
  }
}

setInterval(updateBubbles, 300000); // Every 5 minutes
updateBubbles();
