(function () {
  "use strict";

  const select = (selector, all = false) => all
    ? Array.from(document.querySelectorAll(selector))
    : document.querySelector(selector);

  const header = select("#header");
  const navbar = select("#navbar");
  const navToggle = select(".mobile-nav-toggle");
  const navLinks = select("#navbar .scrollto", true);
  const backToTop = select(".back-to-top");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setScrolledState = () => {
    header?.classList.toggle("header-scrolled", window.scrollY > 20);
    backToTop?.classList.toggle("active", window.scrollY > 120);
  };

  const setActiveNavigation = () => {
    const position = window.scrollY + (header?.offsetHeight || 0) + 80;

    navLinks.forEach((link) => {
      const section = link.hash ? select(link.hash) : null;
      const isActive = section && position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight;
      link.classList.toggle("active", Boolean(isActive));
    });
  };

  const closeMobileNavigation = () => {
    navbar?.classList.remove("navbar-mobile");
    navToggle?.classList.add("bi-list");
    navToggle?.classList.remove("bi-x");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  };

  const scrollToTarget = (hash) => {
    const target = select(hash);
    if (!target) return;

    const offset = header?.offsetHeight || 0;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navbar?.classList.toggle("navbar-mobile");
    navToggle.classList.toggle("bi-list", !isOpen);
    navToggle.classList.toggle("bi-x", isOpen);
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!link.hash || !select(link.hash)) return;
      event.preventDefault();
      closeMobileNavigation();
      scrollToTarget(link.hash);
    });
  });

  window.addEventListener("scroll", () => {
    setScrolledState();
    setActiveNavigation();
  }, { passive: true });

  window.addEventListener("load", () => {
    setScrolledState();
    setActiveNavigation();

    if (window.location.hash) {
      scrollToTarget(window.location.hash);
    }

    if (window.AOS) {
      AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, disable: prefersReducedMotion });
    }
  });
})();
