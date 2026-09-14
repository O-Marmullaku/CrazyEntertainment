// Crazy Entertainment — dependency-free, progressively enhanced interactions.
(() => {
  "use strict";
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const links = document.getElementById("navlinks");

  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (nav && burger && links) {
    const mobile = matchMedia("(max-width: 820px)");
    const toggle = (open = !links.classList.contains("open"), restoreFocus = false) => {
      links.classList.toggle("open", open);
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      // A translated-offscreen menu must not keep invisible keyboard targets.
      links.inert = mobile.matches && !open;
      if (restoreFocus) burger.focus();
    };
    burger.addEventListener("click", () => toggle());
    links.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggle(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && links.classList.contains("open")) toggle(false, true);
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) toggle(false);
    });
    mobile.addEventListener("change", () => toggle(false));
    toggle(false);
    nav.classList.add("nav-ready");
  }

  const cards = document.querySelectorAll(".card");
  // Restored source media is opt-in; missing templates never trigger requests.
  cards.forEach((card) => {
    const template = card.querySelector(".project-media");
    if (template?.dataset.images !== "ready") return;
    const visual = card.querySelector(".card-visual");
    const thumbnail = template.content.firstElementChild.cloneNode(true);
    const showFallback = () => {
      thumbnail.remove();
      visual.classList.remove("has-thumbnail");
    };
    thumbnail.querySelectorAll("img").forEach((image) => image.addEventListener("error", showFallback, { once: true }));
    visual.append(thumbnail);
    visual.classList.add("has-thumbnail");
  });

  const dialog = document.getElementById("project-dialog");
  if (dialog && typeof dialog.showModal === "function") {
    const stage = dialog.querySelector(".project-dialog-stage");
    const icon = dialog.querySelector(".project-dialog-icon");
    const meta = dialog.querySelector(".project-dialog-meta");
    const title = document.getElementById("project-dialog-title");
    const tagline = dialog.querySelector(".project-dialog-tagline");
    const description = document.getElementById("project-dialog-description");
    const chips = dialog.querySelector(".project-dialog-chips");
    const closeButton = dialog.querySelector(".project-dialog-close");
    const actions = dialog.querySelector(".project-dialog-actions");
    const liveLink = dialog.querySelector(".project-dialog-live-link");
    const fallbackButton = dialog.querySelector(".project-dialog-fallback");
    const MEDIA_TIMEOUT = 8000;
    let trigger = null;
    let closeTimer = 0;
    let disposeMedia = () => {};

    const message = (loading = false) => {
      const notice = document.createElement("p");
      notice.className = loading ? "project-dialog-loading" : "project-dialog-unavailable";
      notice.textContent = loading ? "Loading preview…" : "Preview unavailable. Project details are shown alongside this preview area.";
      return notice;
    };

    // Each media session owns its timers and events. Late loads after close or
    // a fallback cannot overwrite a subsequently selected project's stage.
    const beginMedia = () => {
      disposeMedia();
      const controller = new AbortController();
      const timers = new Set();
      const images = new Set();
      disposeMedia = () => {
        controller.abort();
        timers.forEach(clearTimeout);
        images.forEach((image) => image.removeAttribute("src"));
      };
      return {
        signal: controller.signal,
        image: () => { const image = new Image(); images.add(image); return image; },
        later: (callback) => { const timer = setTimeout(callback, MEDIA_TIMEOUT); timers.add(timer); return timer; },
      };
    };

    const restoreStageFocus = () => {
      if (stage.contains(document.activeElement) || document.activeElement === fallbackButton) closeButton.focus();
    };

    const installPreview = (card, projectTitle) => {
      restoreStageFocus();
      const media = beginMedia();
      fallbackButton.hidden = true;
      const template = card.querySelector(".project-media");
      const hasImages = template.dataset.images === "ready";
      const hasDemo = template.dataset.demo === "ready";
      const notice = message(hasImages || hasDemo);
      stage.replaceChildren(notice);
      let posterReady = false;
      let demoReady = false;
      if (hasImages) {
        const poster = media.image();
        poster.className = "project-dialog-poster";
        poster.alt = `${projectTitle} interface preview`;
        poster.addEventListener("load", () => {
          posterReady = true;
          if (!demoReady) stage.replaceChildren(poster);
        }, { once: true, signal: media.signal });
        poster.addEventListener("error", () => {
          if (!demoReady) stage.replaceChildren(message());
        }, { once: true, signal: media.signal });
        poster.src = template.content.querySelector(".thumbnail-layer--ui").getAttribute("src");
      }
      if (hasDemo) {
        const demo = media.image();
        demo.className = "project-dialog-demo";
        demo.alt = `${projectTitle} interface demo`;
        demo.addEventListener("load", () => {
          demoReady = true;
          stage.replaceChildren(demo);
        }, { once: true, signal: media.signal });
        demo.addEventListener("error", () => {
          if (!posterReady) stage.replaceChildren(message());
        }, { once: true, signal: media.signal });
        demo.src = card.dataset.demoGif;
      }
      media.later(() => {
        if (!posterReady && !demoReady) stage.replaceChildren(message());
      });
    };

    const installLiveDemo = (card, projectTitle) => {
      const media = beginMedia();
      const frame = document.createElement("iframe");
      frame.className = "project-dialog-frame";
      frame.title = `${projectTitle} live demo`;
      frame.loading = "eager"; // Already explicitly activated by the visitor.
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      const notice = message(true);
      stage.replaceChildren(frame, notice);
      actions.hidden = false;
      fallbackButton.hidden = false;
      liveLink.href = card.dataset.demoLink || card.dataset.demoUrl;
      const usePreview = () => installPreview(card, projectTitle);
      const timer = media.later(usePreview);
      frame.addEventListener("load", () => {
        clearTimeout(timer);
        notice.remove();
        stage.querySelector(".project-dialog-poster")?.remove();
      }, { once: true, signal: media.signal });
      frame.addEventListener("error", usePreview, { once: true, signal: media.signal });
      // Cross-origin framing failures are not reliably observable. The visitor
      // can always choose the local preview or open the full demo separately.
      fallbackButton.onclick = usePreview;
      const template = card.querySelector(".project-media");
      if (template.dataset.images === "ready") {
        const poster = media.image();
        poster.className = "project-dialog-poster";
        poster.alt = `${projectTitle} interface preview`;
        poster.addEventListener("load", () => {
          if (notice.isConnected) { notice.remove(); stage.append(poster); }
        }, { once: true, signal: media.signal });
        poster.src = template.content.querySelector(".thumbnail-layer--ui").getAttribute("src");
      }
      frame.src = card.dataset.demoUrl;
    };

    const clearMedia = () => {
      disposeMedia();
      stage.replaceChildren();
      icon.removeAttribute("src");
      icon.hidden = true;
      actions.hidden = true;
      fallbackButton.onclick = null;
      liveLink.removeAttribute("href");
    };
    icon.addEventListener("error", () => { icon.hidden = true; icon.removeAttribute("src"); });

    const open = (card) => {
      if (dialog.open) return;
      clearTimeout(closeTimer);
      clearMedia();
      trigger = card;
      const projectTitle = card.querySelector("h3").textContent.trim();
      title.textContent = projectTitle;
      tagline.textContent = card.querySelector(".tagline").textContent;
      description.textContent = card.querySelector(":scope > p:not(.tagline)").textContent;
      meta.replaceChildren(card.querySelector(".card-top").cloneNode(true));
      chips.replaceChildren(...[...card.querySelectorAll(".chip")].map((chip) => chip.cloneNode(true)));
      const template = card.querySelector(".project-media");
      if (template.dataset.images === "ready") {
        icon.src = template.content.querySelector(".thumbnail-layer--icon").getAttribute("src");
        icon.alt = `${projectTitle} icon`;
        icon.hidden = false;
      }
      dialog.classList.remove("is-closing");
      dialog.showModal();
      document.body.classList.add("project-open");
      closeButton.focus();
      if (card.dataset.demoUrl) installLiveDemo(card, projectTitle);
      else installPreview(card, projectTitle);
      requestAnimationFrame(() => { if (dialog.open) dialog.classList.add("is-visible"); });
    };

    const close = () => {
      if (!dialog.open || dialog.classList.contains("is-closing")) return;
      dialog.classList.remove("is-visible");
      dialog.classList.add("is-closing");
      const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
      closeTimer = setTimeout(() => dialog.close(), delay);
    };
    cards.forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `Open ${card.querySelector("h3").textContent.trim()} project demo`);
      card.addEventListener("click", () => { if (!window.getSelection()?.toString()) open(card); });
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open(card);
      });
    });
    closeButton.addEventListener("click", close);
    dialog.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
    dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
    dialog.addEventListener("close", () => {
      clearTimeout(closeTimer);
      clearMedia();
      document.body.classList.remove("project-open");
      dialog.classList.remove("is-visible", "is-closing");
      trigger?.focus({ preventScroll: true });
    });
  }

  // Content remains visible with scripting disabled or unsupported observers.
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.remove("reveal-pending"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("reveal-pending");
      observer.observe(element);
    });
  }
})();
