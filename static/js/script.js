(function () {
    "use strict";

    var navToggle = document.querySelector(".nav-toggle");
    var navMenu = document.querySelector(".nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            var open = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", !open);
            navMenu.classList.toggle("is-open", !open);
            document.body.style.overflow = !open ? "hidden" : "";
        });

        navMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener("click", function () {
                navToggle.setAttribute("aria-expanded", "false");
                navMenu.classList.remove("is-open");
                document.body.style.overflow = "";
            });
        });
    }

    var yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    var stats = document.querySelectorAll(".stat__num[data-count]");
    if (stats.length && "IntersectionObserver" in window) {
        var animated = new Set();

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var el = entry.target;
                    var key = el.getAttribute("data-count");
                    if (!key || animated.has(el)) return;
                    animated.add(el);
                    var target = parseInt(key, 10);
                    if (Number.isNaN(target)) return;
                    var start = 0;
                    var duration = 900;
                    var t0 = null;

                    function tick(ts) {
                        if (!t0) t0 = ts;
                        var p = Math.min((ts - t0) / duration, 1);
                        var eased = 1 - Math.pow(1 - p, 3);
                        var val = Math.round(start + (target - start) * eased);
                        el.textContent = val + "+";
                        if (p < 1) requestAnimationFrame(tick);
                    }

                    requestAnimationFrame(tick);
                });
            },
            { threshold: 0.35 }
        );

        stats.forEach(function (el) {
            observer.observe(el);
        });
    }
})();