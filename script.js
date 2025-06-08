const API_KEY = "183028b2104b4abc8e4cede89ec43943"; // Replace with your real API key
const pairs = [
  "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF",
  "AUD/USD", "NZD/USD", "USD/CAD", "EUR/JPY"
];
const symbols = pairs.map(p => p.replace("/", "")).join(",");
const container = document.getElementById("bubble-container");
const countdownEl = document.getElementById("countdown");

let countdown = 30;
let intervalId;

function updateCountdown() {
  countdown--;
  if (countdown <= 0) {
    fetchData();
    countdown = 30;
  }
  countdownEl.textContent = `Next update in: ${countdown}s`;
}

function fetchData() {
  fetch(`https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      pairs.forEach(pair => {
        const symbol = pair.replace("/", "");
        const info = data[symbol];

        const bubble = document.createElement("div");
        bubble.className = "bubble";

        if (!info || !info.percent_change || isNaN(info.percent_change)) {
          bubble.classList.add("gray");
          bubble.innerHTML = `${pair}<br/>N/A`;
        } else {
          const change = parseFloat(info.percent_change);
          const direction = change < 0 ? "▼" : "▲";
          bubble.classList.add(change < 0 ? "red" : "green");
          bubble.innerHTML = `${pair}<br/>${direction} ${Math.abs(change).toFixed(2)}%`;
        }

        container.appendChild(bubble);
      });
    })
    .catch(err => {
      console.error("API fetch error:", err);
      // Don't clear container, just skip this cycle
    });
}

// Start app
fetchData();
intervalId = setInterval(updateCountdown, 1000);
