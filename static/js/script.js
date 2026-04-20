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

    var modal = document.getElementById("project-modal");
    var modalImage = modal ? modal.querySelector(".project-modal__image") : null;
    var modalTitle = modal ? modal.querySelector(".project-modal__title") : null;
    var modalThumbs = document.getElementById("project-modal-thumbs");
    var prevBtn = modal ? modal.querySelector(".project-modal__nav--prev") : null;
    var nextBtn = modal ? modal.querySelector(".project-modal__nav--next") : null;
    var activeGallery = [];
    var activeIndex = 0;

    function renderModalImage() {
        if (!modalImage || !activeGallery.length) return;
        modalImage.src = activeGallery[activeIndex];
        modalImage.alt = (modalTitle ? modalTitle.textContent : "Project image") + " " + (activeIndex + 1);

        if (!modalThumbs) return;
        modalThumbs.innerHTML = "";
        activeGallery.forEach(function (src, index) {
            var thumb = document.createElement("button");
            thumb.type = "button";
            thumb.className = "project-modal__thumb" + (index === activeIndex ? " is-active" : "");
            thumb.setAttribute("aria-label", "Image " + (index + 1));
            thumb.addEventListener("click", function () {
                activeIndex = index;
                renderModalImage();
            });

            var img = document.createElement("img");
            img.src = src;
            img.alt = "";
            img.loading = "lazy";
            thumb.appendChild(img);
            modalThumbs.appendChild(thumb);
        });
    }

    function openProjectModal(title, gallery) {
        if (!modal || !modalImage || !gallery.length) return;
        activeGallery = gallery;
        activeIndex = 0;
        if (modalTitle) modalTitle.textContent = title || "Project";
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        renderModalImage();
    }

    function closeProjectModal() {
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = "";
    }

    document.querySelectorAll(".js-open-project").forEach(function (trigger) {
        trigger.addEventListener("click", function (event) {
            event.preventDefault();
            var title = trigger.getAttribute("data-project-title") || "Project";
            var galleryRaw = trigger.getAttribute("data-gallery") || "";
            var gallery = galleryRaw
                .split(",")
                .map(function (item) { return item.trim(); })
                .filter(function (item) { return item.length > 0; });
            openProjectModal(title, gallery);
        });
    });

    if (modal) {
        modal.querySelectorAll(".js-close-project-modal").forEach(function (el) {
            el.addEventListener("click", closeProjectModal);
        });

        modal.addEventListener("click", function (event) {
            if (event.target === modal) closeProjectModal();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            if (!activeGallery.length) return;
            activeIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;
            renderModalImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            if (!activeGallery.length) return;
            activeIndex = (activeIndex + 1) % activeGallery.length;
            renderModalImage();
        });
    }

    document.addEventListener("keydown", function (event) {
        if (!modal || modal.hidden) return;
        if (event.key === "Escape") closeProjectModal();
        if (event.key === "ArrowLeft") {
            activeIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;
            renderModalImage();
        }
        if (event.key === "ArrowRight") {
            activeIndex = (activeIndex + 1) % activeGallery.length;
            renderModalImage();
        }
    });
})();