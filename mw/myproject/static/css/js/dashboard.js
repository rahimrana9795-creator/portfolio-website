/* ==========================================
   DASHBOARD JAVASCRIPT
========================================== */

const counterCards = document.querySelectorAll(".card h2");

counterCards.forEach(counter => {
    const target = parseInt(counter.innerText.replace(/[^0-9]/g, ""), 10);
    if (Number.isNaN(target)) return;

    let count = 0;
    const speed = Math.max(1, Math.ceil(target / 100));

    function updateCounter() {
        if (count < target) {
            count += speed;
            if (count > target) count = target;
            counter.innerText = count.toLocaleString();
            requestAnimationFrame(updateCounter);
        }
    }

    updateCounter();
});

const header = document.querySelector("header");

if (header) {
    const dateBox = document.createElement("div");
    dateBox.id = "liveDate";
    header.appendChild(dateBox);

    function updateClock() {
        const now = new Date();
        dateBox.innerHTML = now.toLocaleString();
    }

    setInterval(updateClock, 1000);
    updateClock();
}

const hour = new Date().getHours();
let greeting = "";

if (hour < 12) {
    greeting = "Good Morning";
} else if (hour < 18) {
    greeting = "Good Afternoon";
} else {
    greeting = "Good Evening";
}

const title = document.querySelector("header h1");
if (title) {
    title.innerHTML = greeting;
}

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px) scale(1.03)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
    });
});

document.querySelectorAll("tbody tr").forEach((row, index) => {
    row.style.opacity = "0";
    row.style.transform = "translateX(-30px)";

    setTimeout(() => {
        row.style.transition = ".5s";
        row.style.opacity = "1";
        row.style.transform = "translateX(0)";
    }, index * 150);
});

window.setTimeout(() => {
    if (window.innerWidth > 768) {
        alert("Welcome to your Dashboard!");
    }
}, 800);

console.log("Dashboard Loaded Successfully!");
