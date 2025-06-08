const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD", "USD/CHF", "EUR/JPY"];
const container = document.getElementById("bubbles-container");
const countdownEl = document.getElementById("countdown");

// 🔑 Replace with your real API key
const API_KEY = "183028b2104b4abc8e4cede89ec43943";

// Format pairs for Twelve Data (e.g., "EURUSD,GBPUSD,USDJPY")
const symbols = pairs.map(p => p.replace("/", "")).join(",");

function fetchData() {
  container.innerHTML = "";

  fetch(`https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      pairs.forEach(pair => {
        const symbol = pair.replace("/", "");
        const info = data[symbol];
        const changePercent = parseFloat(info?.percent_change);

        const bubble = document.createElement("div");
        bubble.className = "bubble";

        if (isNaN(changePercent)) {
          bubble.classList.add("red");
          bubble.innerHTML = `${pair}<br/>N/A`;
        } else {
          const direction = changePercent < 0 ? "▼" : "▲";
          bubble.classList.add(changePercent < 0 ? "red" : "green");
          bubble.innerHTML = `${pair}<br/>${direction} ${Math.abs(changePercent).toFixed(2)}%`;
        }

        container.appendChild(bubble);
      });
    })
    .catch(err => {
      console.error("Error fetching data:", err);
    });
}

let countdown = 15;
function startCountdown() {
  countdown = 15;
  const timer = setInterval(() => {
    countdown--;
    countdownEl.textContent = `Next update in: ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(timer);
      fetchData();
      startCountdown();
    }
  }, 1000);
}

// Start
fetchData();
startCountdown();
