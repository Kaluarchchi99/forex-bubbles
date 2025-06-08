// Your Twelve Data API Key
const API_KEY = '183028b2104b4abc8e4cede89ec43943';

// Forex pairs you want to show
const forexPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'];

const container = document.getElementById("bubble-container");

// Function to get price change for a pair
async function getForexChange(pair) {
  const symbol = pair.replace('/', '');
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=2&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values || data.values.length < 2) {
  console.warn(`Not enough data for ${pair}`);
  return {
    pair,
    change: 0.0
  };
}

    const [latest, previous] = data.values;
    const change = ((latest.close - previous.close) / previous.close) * 100;

    return {
      pair,
      change: parseFloat(change.toFixed(2))
    };
  } catch (error) {
    console.error(`Fetch failed for ${pair}:`, error);
    return null;
  }
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

    // ✅ Add arrow indicator
    let arrow = change > 0 ? '▲' : change < 0 ? '▼' : '➖';
    bubble.textContent = `${pair}\n${arrow} ${change.toFixed(2)}%`;

    // Bubble color
    if (change > 0) {
      bubble.style.backgroundColor = "rgba(0, 200, 0, 0.7)";
    } else if (change < 0) {
      bubble.style.backgroundColor = "rgba(200, 0, 0, 0.7)";
    } else {
      bubble.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    }

    container.appendChild(bubble);
  }
}

// Main function to load everything
async function loadForexBubbles() {
  container.innerHTML = ""; // Clear old bubbles

  for (const pair of forexPairs) {
    const data = await getForexChange(pair);
    if (data) {
      createBubble(data);
    }
  }
}

loadForexBubbles();// Auto-refresh every 60 seconds (60,000 milliseconds)
setInterval(updateBubbles, 60000);