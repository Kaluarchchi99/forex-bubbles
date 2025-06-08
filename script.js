const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD", "USD/CHF", "EUR/JPY"];
const container = document.getElementById("bubbles-container");
const countdownEl = document.getElementById("countdown");

// ⛳ Replace this with your actual Twelve Data API key
const API_KEY = "183028b2104b4abc8e4cede89ec43943";

function fetchData() {
  container.innerHTML = "";

  pairs.forEach(pair => {
    const [base, quote] = pair.split("/");
    const symbol = `${base}${quote}`;

    fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        let changePercent = data.percent_change;

        if (!changePercent || isNaN(parseFloat(changePercent))) {
          changePercent = null; // Invalid or missing data
        } else {
          changePercent = parseFloat(changePercent).toFixed(2);
        }

        const bubble = document.createElement("div");
        let direction = "";
        let colorClass = "green";

        if (changePercent === null) {
          bubble.innerHTML = `${pair}<br/>N/A`;
        } else {
          direction = changePercent < 0 ? "▼" : "▲";
          colorClass = changePercent < 0 ? "red" : "green";
          bubble.innerHTML = `${pair}<br/>${direction} ${Math.abs(changePercent)}%`;
        }

        bubble.className = `bubble ${colorClass}`;
        container.appendChild(bubble);
      })
      .catch(error => {
        console.error(`Error fetching ${pair}:`, error);
        const bubble = document.createElement("div");
        bubble.className = "bubble red";
        bubble.innerHTML = `${pair}<br/>Error`;
        container.appendChild(bubble);
      });
  });
}

// Countdown timer
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

// Initialize
fetchData();
startCountdown();
