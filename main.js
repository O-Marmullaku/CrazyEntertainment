// Crazy Entertainment — small, dependency-free interactions.
(() => {
  "use strict";
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const links = document.getElementById("navlinks");

  // Nav border/blur on scroll
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  if (burger && links) {
    const toggle = (open) => {
      const isOpen = open ?? !links.classList.contains("open");
      links.classList.toggle("open", isOpen);
      burger.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    };
    burger.addEventListener("click", () => toggle());
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });
  }

  // Scroll reveal
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();
