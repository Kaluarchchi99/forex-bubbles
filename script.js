const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD", "USD/CHF", "EUR/JPY"];
const container = document.getElementById("bubbles-container");
const countdownEl = document.getElementById("countdown");

// 🔑 Replace with your real API key
const API_KEY = "183028b2104b4abc8e4cede89ec43943";

// Format pairs for Twelve Data (e.g., "EURUSD,GBPUSD,USDJPY")
const symbols = pairs.map(p => p.replace("/", "")).join(",");

function fetchData() {
  fetch(`https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      container.innerHTML = "";

      pairs.forEach(pair => {
        const symbol = pair.replace("/", "");
        const info = data[symbol];

        const bubble = document.createElement("div");
        bubble.className = "bubble";

        if (!info || !info.percent_change || isNaN(info.percent_change)) {
          // Display as unavailable
          bubble.classList.add("gray");
          bubble.innerHTML = `${pair}<br/>N/A`;
        } else {
          const changePercent = parseFloat(info.percent_change);
          const direction = changePercent < 0 ? "▼" : "▲";
          bubble.classList.add(changePercent < 0 ? "red" : "green");
          bubble.innerHTML = `${pair}<br/>${direction} ${Math.abs(changePercent).toFixed(2)}%`;
        }

        container.appendChild(bubble);
      });
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      // Keep old bubbles visible (don’t clear)
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
