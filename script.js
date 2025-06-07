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

// Build and show the bubble
function createBubble(data) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = `${data.pair}\n${data.change}%`;

  bubble.style.backgroundColor = data.change >= 0 ? "#4caf50" : "#f44336";
  const size = 80 + Math.abs(data.change) * 100;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  container.appendChild(bubble);
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