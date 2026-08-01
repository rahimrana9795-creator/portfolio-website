/* ============================
   MOBILE MENU
============================ */

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        if (navLinks) {
            const isOpen = navLinks.classList.toggle("show");
            menuBtn.classList.toggle("active", isOpen);
            menuBtn.setAttribute("aria-expanded", String(isOpen));
        }
    });
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks) {
        navLinks.classList.remove("show");
        menuBtn?.classList.remove("active");
        menuBtn?.setAttribute("aria-expanded", "false");
    }
});

/* ============================
   STICKY HEADER
============================ */

const header = document.querySelector("header");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    });
}

/* ============================
   SMOOTH SCROLL
============================ */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }

        if (navLinks) {
            navLinks.classList.remove("show");
        }
    });
});

/* ============================
   ACTIVE MENU
============================ */

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

if (sections.length && navItems.length) {
    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id") || "";
            }
        });

        navItems.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    });
}

/* ============================
   SCROLL TO TOP BUTTON
============================ */

const topBtn = document.createElement("button");
topBtn.type = "button";
topBtn.innerHTML = "^";
topBtn.className = "top-btn";
document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        topBtn.classList.add("show");
    } else {
        topBtn.classList.remove("show");
    }
});

topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* ============================
   FADE-IN ANIMATION
============================ */

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll(".card, .service-box, .about, .contact").forEach(item => {
        item.classList.add("hidden");
        observer.observe(item);
    });
}

console.log("Website Loaded Successfully!");
