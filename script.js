const API_KEY = "183028b2104b4abc8e4cede89ec43943"; // <-- Replace with your TwelveData API key
const symbols = "EURUSD,USDJPY,GBPUSD,USDCHF,AUDUSD,NZDUSD,USDCAD,EURJPY";
const updateInterval = 60000; // 60 seconds

const mockData = {
  EURUSD: { percent_change: "0.45" },
  USDJPY: { percent_change: "-0.31" },
  GBPUSD: { percent_change: "0.00" },
  USDCHF: { percent_change: "1.2" },
  AUDUSD: { percent_change: "-0.65" },
  NZDUSD: { percent_change: "0.15" },
  USDCAD: { percent_change: "-0.11" },
  EURJPY: { percent_change: "0.05" }
};

function fetchData() {
  fetch(`https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "error" || Object.values(data).some(d => !d || !d.percent_change)) {
        console.warn("⚠️ API failed or returned invalid data. Using mock data.");
        updateBubbles(mockData);
      } else {
        updateBubbles(data);
      }
    })
    .catch(error => {
      console.error("❌ Fetch error:", error);
      console.warn("⚠️ Using mock data instead.");
      updateBubbles(mockData);
    });
}

function updateBubbles(data) {
  const container = document.getElementById("bubbles");
  container.innerHTML = "";

  Object.keys(data).forEach(symbol => {
    const change = parseFloat(data[symbol].percent_change);
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    let colorClass = "neutral";
    if (!isNaN(change)) {
      colorClass = change > 0 ? "green" : change < 0 ? "red" : "neutral";
    }

    bubble.classList.add(colorClass);
    bubble.innerHTML = `<strong>${symbol}</strong><br>${change >= 0 ? "▲" : "▼"} ${isNaN(change) ? "0.00" : Math.abs(change).toFixed(2)}%`;
    container.appendChild(bubble);
  });
}

function startCountdown() {
  const countdown = document.getElementById("countdown");
  let seconds = updateInterval / 1000;

  const timer = setInterval(() => {
    seconds--;
    countdown.textContent = `Next update in: ${seconds}s`;
    if (seconds <= 0) clearInterval(timer);
  }, 1000);
}

function init() {
  fetchData();
  startCountdown();
  setInterval(() => {
    fetchData();
    startCountdown();
  }, updateInterval);
}

init();
