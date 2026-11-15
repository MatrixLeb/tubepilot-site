/* TubePilot website — small progressive-enhancement script (no dependencies) */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- nav */

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------- footer */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------ demo video tabs */

  var video = document.getElementById("walkthrough");
  var videoTabs = Array.prototype.slice.call(
    document.querySelectorAll("[data-video] [role='tab']")
  );

  if (video && videoTabs.length) {
    var videoCaption = document.querySelector("[data-video-caption]");

    var selectVideo = function (tab) {
      var src = tab.getAttribute("data-src");
      if (!src) return;
      if (video.getAttribute("src") !== src) {
        video.pause();
        video.setAttribute("src", src);
        var poster = tab.getAttribute("data-poster");
        if (poster) video.setAttribute("poster", poster);
        video.load();
      }
      videoTabs.forEach(function (other) {
        var on = other === tab;
        other.setAttribute("aria-selected", on ? "true" : "false");
        other.tabIndex = on ? 0 : -1;
      });
      if (videoCaption) {
        videoCaption.textContent = tab.getAttribute("data-caption") || "";
      }
      var label = tab.getAttribute("data-label");
      if (label) video.setAttribute("aria-label", label);
    };

    var rtl = (document.documentElement.dir || "").toLowerCase() === "rtl";

    videoTabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectVideo(tab);
      });

      tab.addEventListener("keydown", function (event) {
        var step = 0;
        if (event.key === "Home") {
          event.preventDefault();
          selectVideo(videoTabs[0]);
          videoTabs[0].focus();
          return;
        }
        if (event.key === "End") {
          event.preventDefault();
          var last = videoTabs[videoTabs.length - 1];
          selectVideo(last);
          last.focus();
          return;
        }
        if (event.key === "ArrowRight") step = rtl ? -1 : 1;
        if (event.key === "ArrowLeft") step = rtl ? 1 : -1;
        if (!step) return;
        event.preventDefault();
        var next = videoTabs[(index + step + videoTabs.length) % videoTabs.length];
        next.focus();
        selectVideo(next);
      });
    });
  }

  /* ----------------------------------------------------------- downloads */

  var base = window.TUBEPILOT_DOWNLOAD_BASE || "downloads/";
  if (base && base.slice(-1) !== "/") base += "/";
  document.querySelectorAll("[data-download]").forEach(function (link) {
    var file = link.getAttribute("data-download");
    if (file) link.setAttribute("href", base + file);
  });

  /* -------------------------------------------------------- copy buttons */

  var isArabic = (document.documentElement.lang || "").toLowerCase().indexOf("ar") === 0;
  var copyLabel = isArabic ? "نسخ" : "Copy";
  var copiedLabel = isArabic ? "تم النسخ" : "Copied";
  var manualLabel = isArabic ? "اضغط Ctrl+C" : "Press Ctrl+C";
  var copyAria = isArabic ? "نسخ هذا الأمر" : "Copy this command";

  document.querySelectorAll("pre").forEach(function (pre) {
    var code = pre.querySelector("code");
    if (!code) return;
    var holder = pre.closest(".code-block");
    if (!holder) {
      holder = document.createElement("div");
      holder.className = "code-block";
      pre.parentNode.insertBefore(holder, pre);
      holder.appendChild(pre);
    }
    if (holder.querySelector(".copy-btn")) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-btn";
    button.textContent = copyLabel;
    button.setAttribute("aria-label", copyAria);

    button.addEventListener("click", function () {
      var text = code.innerText.replace(/\u00a0/g, " ");
      var done = function () {
        button.textContent = copiedLabel;
        window.setTimeout(function () {
          button.textContent = copyLabel;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          button.textContent = manualLabel;
        });
      } else {
        var range = document.createRange();
        range.selectNodeContents(code);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });

    holder.appendChild(button);
  });

  /* ------------------------------------------------------- docs scrollspy */

  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll(".docs-sidebar a[href^='#']")
  );
  var headings = tocLinks
    .map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });

    var visible = new Set();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });

        var current = null;
        for (var i = 0; i < headings.length; i++) {
          if (visible.has(headings[i].id)) {
            current = headings[i].id;
            break;
          }
        }
        if (!current) {
          var threshold = window.innerHeight * 0.35;
          for (var j = headings.length - 1; j >= 0; j--) {
            if (headings[j].getBoundingClientRect().top <= threshold) {
              current = headings[j].id;
              break;
            }
          }
        }
        tocLinks.forEach(function (link) {
          link.classList.toggle(
            "active",
            link.getAttribute("href").slice(1) === current
          );
        });
      },
      { rootMargin: "-72px 0px -62% 0px", threshold: [0, 1] }
    );

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }

  /* --------------------------------------------------------- docs search */

  var search = document.getElementById("toc-search");
  if (search) {
    var hint = document.getElementById("toc-search-hint");
    var items = Array.prototype.slice.call(
      document.querySelectorAll(".docs-sidebar li")
    );

    search.addEventListener("input", function () {
      var query = search.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (item) {
        var link = item.querySelector("a");
        var label = link ? link.textContent.toLowerCase() : "";
        var match = !query || label.indexOf(query) !== -1;
        item.hidden = !match;
        if (match) shown++;
      });
      if (hint) {
        hint.classList.toggle("show", !!query);
        hint.textContent = query
          ? (isArabic
              ? shown + " قسم مطابق"
              : shown + " matching section" + (shown === 1 ? "" : "s"))
          : "";
      }
    });

    search.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        var first = items.filter(function (item) {
          return !item.hidden;
        })[0];
        var link = first && first.querySelector("a");
        if (link) {
          link.click();
          var target = document.getElementById(link.getAttribute("href").slice(1));
          if (target) target.setAttribute("tabindex", "-1");
          if (target) target.focus({ preventScroll: true });
        }
      }
    });
  }

  /* ------------------------------------------------ current page in nav */

  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#site-nav a[href]").forEach(function (link) {
    if (link.getAttribute("href") === path) {
      link.setAttribute("aria-current", "page");
    }
  });
})();
