/* Slate & Cove — progressive enhancement.
   The site works without JavaScript: every page is a real document and the
   nav is a plain list of links. This file adds the small-screen nav toggle
   and client-side feedback on the contact form. */
(function () {
  "use strict";

  /* ---- Small-screen navigation ---------------------------------------- */

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    // The toggle is only meaningful once scripting is available.
    toggle.hidden = false;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("[data-nav-label]").textContent = open ? "Close" : "Menu";
    });

    // Reset to the desktop layout if the viewport grows past the breakpoint.
    var wide = window.matchMedia("(min-width: 901px)");
    var reset = function (event) {
      if (event.matches) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.querySelector("[data-nav-label]").textContent = "Menu";
      }
    };
    if (wide.addEventListener) {
      wide.addEventListener("change", reset);
    } else if (wide.addListener) {
      wide.addListener(reset);
    }
  }

  /* ---- Contact form ---------------------------------------------------- */

  var form = document.querySelector("[data-contact-form]");

  if (form) {
    var status = form.querySelector("[data-form-status]");

    form.addEventListener("submit", function (event) {
      // No submission endpoint is configured yet. Until `action` is set to a
      // real handler, keep the enquiry on the page rather than navigating to
      // a broken URL. Remove this branch once the backend exists.
      if (!form.getAttribute("action")) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        if (status) {
          status.textContent =
            "This form has no submission endpoint yet — set the form's action attribute to wire it up.";
        }
      }
    });
  }
})();
