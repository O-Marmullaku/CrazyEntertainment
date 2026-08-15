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

  // Reusable project spotlight dialog
  const projectDialog = document.getElementById("project-dialog");
  const projectCards = document.querySelectorAll(".card");
  let projectDialogTrigger = null;
  let projectDialogCloseTimer = 0;

  if (projectDialog) {
    const stage = projectDialog.querySelector(".project-dialog-stage");
    const icon = projectDialog.querySelector(".project-dialog-icon");
    const meta = projectDialog.querySelector(".project-dialog-meta");
    const title = document.getElementById("project-dialog-title");
    const tagline = projectDialog.querySelector(".project-dialog-tagline");
    const description = document.getElementById("project-dialog-description");
    const chips = projectDialog.querySelector(".project-dialog-chips");
    const closeButton = projectDialog.querySelector(".project-dialog-close");
    const liveLink = projectDialog.querySelector(".project-dialog-live-link");

    const clearProjectDialogMedia = () => {
      stage.replaceChildren();
      stage.style.removeProperty("--project-dialog-background");
      liveLink.hidden = true;
      liveLink.removeAttribute("href");
    };

    const installProjectDialogGif = (card, projectTitle) => {
      const demo = new Image();
      demo.className = "project-dialog-demo";
      demo.alt = `${projectTitle} interface demo`;
      demo.addEventListener("error", () => {
        demo.className = "project-dialog-poster";
        demo.src = card.querySelector(".thumbnail-layer--ui").getAttribute("src");
      }, { once: true });
      demo.src = card.dataset.demoGif;
      stage.replaceChildren(demo);
    };

    const openProjectDialog = (card) => {
      clearTimeout(projectDialogCloseTimer);
      projectDialogTrigger = card;
      const projectTitle = card.querySelector("h3").textContent.trim();
      const cardDescription = card.querySelector(":scope > p:not(.tagline)");
      const cardIcon = card.querySelector(".thumbnail-layer--icon");
      const cardBackground = card.querySelector(".thumbnail-layer--background");

      title.textContent = projectTitle;
      tagline.textContent = card.querySelector(".tagline").textContent;
      description.textContent = cardDescription.textContent;
      meta.replaceChildren(card.querySelector(".card-top").cloneNode(true));
      chips.replaceChildren(...[...card.querySelectorAll(".chip")].map((chip) => chip.cloneNode(true)));
      icon.src = cardIcon.getAttribute("src");
      icon.alt = `${projectTitle} icon`;
      stage.style.setProperty("--project-dialog-background", `url("${cardBackground.getAttribute("src")}")`);
      installProjectDialogGif(card, projectTitle);

      projectDialog.classList.remove("is-closing");
      projectDialog.showModal();
      requestAnimationFrame(() => projectDialog.classList.add("is-visible"));
    };

    const requestProjectDialogClose = () => {
      if (!projectDialog.open || projectDialog.classList.contains("is-closing")) return;
      projectDialog.classList.remove("is-visible");
      projectDialog.classList.add("is-closing");
      const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
      projectDialogCloseTimer = window.setTimeout(() => projectDialog.close(), delay);
    };

    projectCards.forEach((card) => {
      const projectTitle = card.querySelector("h3").textContent.trim();
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `Open ${projectTitle} project demo`);
      card.addEventListener("click", () => {
        if (!window.getSelection().toString()) openProjectDialog(card);
      });
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openProjectDialog(card);
      });
    });

    closeButton.addEventListener("click", requestProjectDialogClose);
    projectDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      requestProjectDialogClose();
    });
    projectDialog.addEventListener("click", (event) => {
      if (event.target === projectDialog) requestProjectDialogClose();
    });
    projectDialog.addEventListener("close", () => {
      clearProjectDialogMedia();
      projectDialog.classList.remove("is-visible", "is-closing");
      projectDialogTrigger?.focus();
    });
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
