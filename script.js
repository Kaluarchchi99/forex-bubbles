const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD", "USD/CHF", "EUR/JPY"];
const container = document.getElementById("bubbles-container");
const countdownEl = document.getElementById("countdown");

const API_KEY = "183028b2104b4abc8e4cede89ec43943"; // Replace this with your key

function fetchData() {
  container.innerHTML = "";

  pairs.forEach(pair => {
    const [base, quote] = pair.split("/");
    const symbol = `${base}${quote}`;

    fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        const changePercent = parseFloat(data.percent_change).toFixed(2);
        const bubble = document.createElement("div");
        bubble.className = "bubble " + (changePercent < 0 ? "red" : "green");
        bubble.innerHTML = `
          ${pair}<br/>
          ${changePercent > 0 ? "▲" : "▼"} ${Math.abs(changePercent)}%
        `;
        container.appendChild(bubble);
      })
      .catch(error => {
        console.error("Error fetching data for", pair, error);
      });
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

// Start everything
fetchData();
startCountdown();
