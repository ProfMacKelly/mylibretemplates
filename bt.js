/**
 * Scoped Custom JavaScript for Textbook Components
 * All component initialization is restricted to elements within
 * the main '.textbook-content' container for cross-platform safety.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Identify the main textbook content container
  const textbookContainer = document.querySelector(".textbook-content");

  // If the container is not present on the page, stop execution
  if (!textbookContainer) {
    return;
  }

  // --- ELIDE FUNCTIONALITY ---

  function makeElideNode(innerNodes) {
    const wrapper = document.createElement("span");
    wrapper.className = "elide-wrapper";

    const ellipsis = document.createElement("button");
    ellipsis.type = "button";
    ellipsis.className = "elide-ellipsis";
    ellipsis.setAttribute("aria-expanded", "false");
    ellipsis.innerHTML = '[<strong class="elide-dots">…</strong>]';

    const content = document.createElement("span");
    content.className = "elide-content";
    content.setAttribute("hidden", "");

    const hideBtn = document.createElement("button");
    hideBtn.type = "button";
    hideBtn.className = "hide-btn";
    hideBtn.innerHTML = '[<span class="hide-word">hide</span>]';

    innerNodes.forEach((n) => content.appendChild(n));
    content.appendChild(hideBtn);

    ellipsis.addEventListener("click", () => {
      const expanded = ellipsis.getAttribute("aria-expanded") === "true";
      if (expanded) {
        content.setAttribute("hidden", "");
        ellipsis.setAttribute("aria-expanded", "false");
      } else {
        content.removeAttribute("hidden");
        ellipsis.setAttribute("aria-expanded", "true");
      }
    });

    hideBtn.addEventListener("click", () => {
      content.setAttribute("hidden", "");
      ellipsis.setAttribute("aria-expanded", "false");
      ellipsis.focus();
    });

    wrapper.appendChild(ellipsis);
    wrapper.appendChild(content);
    return wrapper;
  }

  function enhanceElides() {
    // Query elements only inside the textbookContainer
    const els = textbookContainer.querySelectorAll(".elide");
    els.forEach((el) => {
      if (el.dataset.enhanced === "true") return;
      el.dataset.enhanced = "true";
      const nodes = Array.from(el.childNodes).map((n) => n.cloneNode(true));
      const newNode = makeElideNode(nodes);
      el.replaceWith(newNode);
    });
  }

  enhanceElides(); // Run the elide enhancement

  // --- COLLAPSIBLE FUNCTIONALITY ---

  // Query elements only inside the textbookContainer
  var coll = textbookContainer.querySelectorAll(".collapsible");

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }

  // --- EXPANDABLE (EDITORIAL/ATTRIBUTIONS) FUNCTIONALITY ---
  // Note: Since this functionality relies on global calls from the HTML (e.g., onclick="toggleCustomExpandable('id', 'id')"),
  // the global functions (slideToggleContent, toggleCustomExpandable) must remain available in the window scope.
  // We will ensure the functions are defined outside the DOMContentLoaded listener and simply use the scoped logic inside them.

  // The functions are already using document.getElementById, which works globally.
  // The assumption is the IDs for editorial/attributions content are unique and reside within your main content structure.
  // Since the structure of these functions is clean, they do not need to be heavily modified, only ensured they are globally accessible.
});

/**
 * Toggles the content with a smooth slide-down/slide-up transition.
 * NOTE: This function remains globally accessible because it is called via onclick events.
 * @param {HTMLElement} element The content element to slide.
 * @param {boolean} isOpening True if the content should open (slide down).
 */
function slideToggleContent(element, isOpening) {
  if (isOpening) {
    // ... (opening logic remains the same)
    element.style.height = "auto";
    const contentHeight = element.scrollHeight;
    element.style.height = "0";
    requestAnimationFrame(() => {
      element.style.height = contentHeight + "px";
    });
    element.addEventListener("transitionend", function handler() {
      element.style.height = "auto";
      element.removeEventListener("transitionend", handler);
    });
  } else {
    // ... (closing logic remains the same)
    element.style.height = element.scrollHeight + "px";
    requestAnimationFrame(() => {
      element.style.height = "0";
    });
    element.addEventListener("transitionend", function handler() {
      element.classList.add("is-hidden");
      element.removeEventListener("transitionend", handler);
    });
  }
}

/**
 * Main toggle function called by the header click.
 * NOTE: This function remains globally accessible because it is called via onclick events.
 */
function toggleCustomExpandable(headerId, contentId) {
  // These IDs are unique, so document.getElementById is the best approach.
  const header = document.getElementById(headerId);
  const content = document.getElementById(contentId);

  // Ensure both elements exist before proceeding
  if (!header || !content) {
    console.error(
      `Missing expandable elements: Header: ${headerId}, Content: ${contentId}`
    );
    return;
  }

  const isCurrentlyHidden = content.classList.contains("is-hidden");
  header.classList.toggle("is-open");

  if (isCurrentlyHidden) {
    content.classList.remove("is-hidden");
    slideToggleContent(content, true);
  } else {
    slideToggleContent(content, false);
  }
}
