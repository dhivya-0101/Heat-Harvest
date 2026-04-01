// Tab Switching Logic
const tabs = {
  dashboard: document.getElementById("dashboard-tab"),
  analytics: document.getElementById("analytics-tab"),
  alerts: document.getElementById("alerts-tab"),
  settings: document.getElementById("settings-tab")
};

const menuItems = {
  dashboard: document.getElementById("menu-dashboard"),
  analytics: document.getElementById("menu-analytics"),
  alerts: document.getElementById("menu-alerts"),
  settings: document.getElementById("menu-settings")
};

function switchTab(target) {
  Object.keys(tabs).forEach(key => {
    tabs[key].classList.add("hidden");
    menuItems[key].classList.remove("active");
  });
  tabs[target].classList.remove("hidden");
  menuItems[target].classList.add("active");
  
  if (target === 'analytics') initAnalyticsChart();
}

Object.keys(menuItems).forEach(key => {
  menuItems[key].addEventListener("click", (e) => {
    e.preventDefault();
    switchTab(key);
  });
});

// Login Logic
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (user === "admin" && pass === "pass123") {
    const overlay = document.getElementById("login-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.display = "none", 500);
    startDataSync();
  } else {
    error.innerText = "Invalid credentials. Try admin / pass123";
    setTimeout(() => error.innerText = "", 3000);
  }
});

// Real-time Data Simulation
const updateInterval = 2000;
let dashboardInitialized = false;

function startDataSync() {
  if (dashboardInitialized) return;
  dashboardInitialized = true;
  setInterval(fetchData, updateInterval);
}

function fetchData() {
  const temp = (74 + Math.random() * 6).toFixed(1);
  const voltage = (1.45 + Math.random() * 0.1).toFixed(2);
  const battery = Math.min(100, Math.max(0, 88 + (Math.random() * 2 - 1))).toFixed(0);
  const power = (2.1 + Math.random() * 0.4).toFixed(1);
  const energy = (0.68 + Math.random() * 0.08).toFixed(2);
  const efficiency = (90 + Math.random() * 5).toFixed(0);

  // Update Stats
  const tempEl = document.getElementById("temp");
  if (tempEl) {
    tempEl.innerText = temp;
    document.getElementById("voltage").innerText = voltage;
    document.getElementById("battery").innerText = battery;
    document.getElementById("power").innerText = power;
    document.getElementById("energy").innerText = `${energy} Wh`;
    document.getElementById("eff-value").innerText = `${efficiency}%`;
    updateCharts(temp, power, efficiency);
  }
}

// Chart.js Instances
let mainChart, effChart, analyticsChart;

function initCharts() {
  const ctxMain = document.getElementById("chart");
  if (!ctxMain) return;

  mainChart = new Chart(ctxMain, {
    type: "line",
    data: {
      labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
      datasets: [
        {
          label: "Temperature",
          data: [72, 75, 78, 74, 79, 77],
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0
        },
        {
          label: "Power (W)",
          data: [1.8, 2.1, 2.3, 2.0, 2.4, 2.2],
          borderColor: "#22c55e",
          borderWidth: 3,
          tension: 0.4,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#64748b" } },
        y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { display: false } }
      }
    }
  });

  const ctxEff = document.getElementById("efficiencyChart");
  effChart = new Chart(ctxEff, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [92, 8],
        backgroundColor: ["#22c55e", "rgba(255, 255, 255, 0.05)"],
        borderWidth: 0,
        circumference: 360,
        rotation: 0,
        cutout: "85%"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }
  });
}

function initAnalyticsChart() {
  const ctx = document.getElementById("analyticsChart");
  if (!ctx || analyticsChart) return;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

  analyticsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
      datasets: [{
        label: "Total Daily Energy (Wh)",
        data: Array.from({length: 30}, () => (0.5 + Math.random() * 0.5).toFixed(2)),
        borderColor: "#3b82f6",
        backgroundColor: gradient,
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#94a3b8" } } },
      scales: {
        x: { ticks: { color: "#64748b", maxRotation: 0 } },
        y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#64748b" } }
      }
    }
  });
}

function updateCharts(temp, power, efficiency) {
  if (effChart) {
    effChart.data.datasets[0].data = [efficiency, 100 - efficiency];
    effChart.update('none');
  }
}

// Download Report Mock
document.getElementById("download-report").addEventListener("click", () => {
  const btn = document.getElementById("download-report");
  const originalText = btn.innerHTML;
  btn.innerHTML = "Generating...";
  btn.disabled = true;
  
  setTimeout(() => {
    alert("Report generated successfully! (HeatHarvest_Daily_Log.pdf)");
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 1500);
});

// Settings Mock
document.querySelectorAll("#settings-tab input").forEach(input => {
  input.addEventListener("change", (e) => console.log(`Setting changed: ${e.target.id} = ${e.target.value}`));
});

// Initial Call
initCharts();
// startDataSync(); // For immediate preview