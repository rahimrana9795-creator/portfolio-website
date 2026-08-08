/* ==========================================
   NEXT-LEVEL DASHBOARD JAVASCRIPT
========================================== */

/* ---------- Live clock ---------- */
const dateBox = document.getElementById("liveDate");
if (dateBox) {
    function updateClock() {
        dateBox.textContent = new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }
    updateClock();
    setInterval(updateClock, 1000);
}

/* ---------- Greeting ---------- */
const greeting = document.getElementById("greeting");
if (greeting) {
    const hour = new Date().getHours();
    let text = "Good Evening";
    if (hour < 12) text = "Good Morning";
    else if (hour < 18) text = "Good Afternoon";
    greeting.textContent = text;
}

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll(".counter");
counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    if (Number.isNaN(target)) return;

    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else counter.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
});

/* ---------- Chart.js rendering ---------- */
function renderChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    new Chart(canvas.getContext("2d"), config);
}

function areaChartConfig(labels, data, color) {
    return {
        type: "line",
        data: {
            labels,
            datasets: [{
                data,
                borderColor: color,
                backgroundColor: color + "22",
                fill: true,
                tension: 0.45,
                borderWidth: 3,
                pointBackgroundColor: color,
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0f172a",
                    padding: 12,
                    cornerRadius: 10,
                    titleFont: { weight: "700" },
                    displayColors: false,
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#94a3b8", font: { size: 12 } },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "#f1f5f9" },
                    border: { display: false },
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 12 },
                        precision: 0,
                    },
                },
            },
        },
    };
}

window.addEventListener("load", () => {
    if (typeof weeklyLabels !== "undefined" && typeof weeklyData !== "undefined") {
        renderChart("weeklyChart", areaChartConfig(weeklyLabels, weeklyData, "#6366f1"));
    }
    if (typeof trafficLabels !== "undefined" && typeof trafficData !== "undefined") {
        renderChart("trafficChart", areaChartConfig(trafficLabels, trafficData, "#8b5cf6"));
    }
    if (typeof hourlyLabels !== "undefined" && typeof hourlyData !== "undefined") {
        renderChart("hourlyChart", {
            type: "bar",
            data: {
                labels: hourlyLabels,
                datasets: [{
                    data: hourlyData,
                    backgroundColor: "#6366f1cc",
                    borderRadius: 6,
                    borderSkipped: false,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#0f172a",
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: false,
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: "#94a3b8", font: { size: 10 }, maxRotation: 0 },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "#f1f5f9" },
                        border: { display: false },
                        ticks: { color: "#94a3b8", precision: 0 },
                    },
                },
            },
        });
    }
});

/* ---------- Search: filter table rows / message list ---------- */
const searchInput = document.getElementById("globalSearch") || document.getElementById("messageSearch");
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase().trim();
        document.querySelectorAll(".data-table tbody tr, .message-list li").forEach((row) => {
            row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
        });
    });
}

/* ---------- Sidebar active state from URL ---------- */
document.querySelectorAll(".sidebar ul li a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href === "/" || href === "#") return;
    const current = window.location.pathname.replace(/\/$/, "");
    const linkPath = href.replace(/\/$/, "");
    if (current === linkPath || current.startsWith(linkPath + "/")) {
        link.closest("li").classList.add("active");
    }
});

console.log("Dashboard Loaded Successfully!");
