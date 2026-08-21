/* Gee, Tea, Eh, Seven? — reveal on scroll + cup progress */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Staggered reveal ---- */
  var items = document.querySelectorAll(".reveal");

  items.forEach(function (el) {
    var d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d);
  });

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Hero background video: pause below the fold, drop for reduced motion ---- */
  var heroVideo = document.querySelector(".hero__media video");
  if (heroVideo) {
    if (reduce) {
      heroVideo.remove();
    } else if ("IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            heroVideo.play().catch(function () {});
          } else {
            heroVideo.pause();
          }
        });
      }, { threshold: 0 });
      vio.observe(heroVideo);
    }
  }

  /* ---- Cup fills as you read ---- */
  var cup = document.querySelector(".cup");
  var fill = document.querySelector(".cup__fill");
  if (!cup || !fill) return;

  var ticking = false;

  function updateCup() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    fill.style.height = (pct * 100).toFixed(1) + "%";
    cup.classList.toggle("is-filling", pct > 0.08);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateCup);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", updateCup, { passive: true });
  updateCup();
})();
