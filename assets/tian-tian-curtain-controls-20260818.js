(() => {
  "use strict";

  const initialise = () => {
    document.querySelectorAll("[data-tt-ending]").forEach((ending) => {
      const button = ending.querySelector("[data-tt-ending-skip]");
      const theatre = ending.querySelector(".tt-ending-theatre");
      const copy = ending.querySelector(".tt-ending-copy");
      if (!button || !theatre || !copy) return;

      button.addEventListener("click", () => {
        ending.classList.add("is-epilogue-skipped");
        theatre.setAttribute("aria-hidden", "true");
        button.hidden = true;

        copy.setAttribute("tabindex", "-1");
        requestAnimationFrame(() => {
          copy.focus({ preventScroll: true });
          window.setTimeout(() => copy.removeAttribute("tabindex"), 1200);
        });
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
