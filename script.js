/* =========================================================
   RAZ0229.NET — script.js
   Plain, unashamed vanilla JavaScript. No frameworks.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  runLoadingSplash();
  setupNavToggle();
  setupNavHighlighting();
  runClock();
  runVisitorCounter();
  setupQuoteWidget();
  setupMoreProjectsToggle();
  setupGuestbook();
  setYear();
});

/* ---------------------------------------------------------
   1. Fake "loading..." splash screen, just for nostalgia.
      Auto-dismisses; user can also click Skip.
--------------------------------------------------------- */
function runLoadingSplash() {
  var splash = document.getElementById("loadingSplash");
  var bar = document.getElementById("loadBarInner");
  var skipBtn = document.getElementById("skipLoading");
  if (!splash || !bar) return;

  var progress = 0;
  var timer = setInterval(function () {
    progress += Math.random() * 18 + 7;
    if (progress >= 100) {
      progress = 100;
      bar.style.width = progress + "%";
      clearInterval(timer);
      setTimeout(finishLoading, 250);
    } else {
      bar.style.width = progress + "%";
    }
  }, 120);

  function finishLoading() {
    splash.classList.add("hidden");
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", function () {
      clearInterval(timer);
      finishLoading();
    });
  }
}

/* ---------------------------------------------------------
   2. Mobile nav toggle (hamburger-ish, but retro button)
--------------------------------------------------------- */
function setupNavToggle() {
  var toggle = document.getElementById("navToggle");
  var list = document.getElementById("navList");
  if (!toggle || !list) return;

  toggle.addEventListener("click", function () {
    list.classList.toggle("open");
  });

  // close menu after a link is tapped (mobile)
  list.querySelectorAll("a.navBtn").forEach(function (link) {
    link.addEventListener("click", function () {
      list.classList.remove("open");
    });
  });
}

/* ---------------------------------------------------------
   3. Highlight active nav button + update "You are here:"
      breadcrumb based on which section is on screen.
--------------------------------------------------------- */
function setupNavHighlighting() {
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll("nav#mainNav a.navBtn")
  );
  var breadcrumb = document.getElementById("breadcrumbText");
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActive(id, label) {
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
    if (breadcrumb) {
      breadcrumb.textContent = "Home > " + label;
    }
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setActive(
        link.getAttribute("href").replace("#", ""),
        link.textContent.trim()
      );
    });
  });

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var matchingLink = navLinks.filter(function (l) {
              return l.getAttribute("href") === "#" + entry.target.id;
            })[0];
            if (matchingLink) {
              setActive(entry.target.id, matchingLink.textContent.trim());
            }
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      observer.observe(s);
    });
  }
}

/* ---------------------------------------------------------
   4. A little digital clock, because every good homepage
      circa 2003 had one somewhere on the page.
--------------------------------------------------------- */
function runClock() {
  var el = document.getElementById("liveClock");
  if (!el) return;

  function tick() {
    var now = new Date();
    var h = now.getHours();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    var m = String(now.getMinutes()).padStart(2, "0");
    var s = String(now.getSeconds()).padStart(2, "0");
    var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    el.textContent =
      days[now.getDay()] + "  " + h + ":" + m + ":" + s + " " + ampm;
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   5. Visitor counter — the ultimate Web 1.0 status symbol.
      Uses localStorage so it persists (per-browser, of course,
      just like the real counters only counted their own logs).
--------------------------------------------------------- */
function runVisitorCounter() {
  var el = document.getElementById("visitorCount");
  if (!el) return;

  var STARTING_COUNT = 0; // a suitably implausible starting number
  var stored = 0;
  try {
    stored = parseInt(localStorage.getItem("raz0229_visits") || "0", 10);
    if (!stored) {
      stored = STARTING_COUNT;
    }
    stored += 1;
    localStorage.setItem("raz0229_visits", String(stored));
  } catch (e) {
    stored = STARTING_COUNT;
  }

  var digits = String(stored).padStart(7, "0").split("");
  el.textContent = digits.join(" ");
}

/* ---------------------------------------------------------
   6. Quote of the Day widget (button cycles quotes)
--------------------------------------------------------- */
function setupQuoteWidget() {
  var quoteText = document.getElementById("quoteText");
  var quoteAuthor = document.getElementById("quoteAuthor");
  var newQuoteBtn = document.getElementById("newQuoteBtn");
  if (!quoteText || !newQuoteBtn) return;

  var quotes = [
    ["Talk is cheap. Show me the code.", "Linus Torvalds"],
    ["Premature optimization is the root of all evil.", "Donald Knuth"],
    ["Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", "Martin Fowler"],
    ["It works on my machine.", "Every developer, ever"],
    ["There are only two hard things in Computer Science: cache invalidation and naming things.", "Phil Karlton"],
    ["First, solve the problem. Then, write the code.", "John Johnson"],
    ["Simplicity is the soul of efficiency.", "Austin Freeman"],
    ["Ship it, then fix it.", "Anonymous sysadmin wisdom"]
  ];

  var idx = Math.floor(Math.random() * quotes.length);

  function render() {
    quoteText.textContent = "\u201C" + quotes[idx][0] + "\u201D";
    if (quoteAuthor) quoteAuthor.textContent = "\u2014 " + quotes[idx][1];
  }
  render();

  newQuoteBtn.addEventListener("click", function () {
    idx = (idx + 1) % quotes.length;
    render();
  });
}

/* ---------------------------------------------------------
   7. "Show more projects" toggle
--------------------------------------------------------- */
function setupMoreProjectsToggle() {
  var btn = document.getElementById("moreProjectsBtn");
  var wrap = document.getElementById("moreProjectsWrap");
  if (!btn || !wrap) return;

  btn.addEventListener("click", function () {
    var isOpen = wrap.style.display === "block";
    wrap.style.display = isOpen ? "none" : "block";
    btn.textContent = isOpen
      ? "▼ Show More Stuff I've Built"
      : "▲ Hide Extra Projects";
  });
}

/* ---------------------------------------------------------
   8. Guestbook — purely client-side (no server, this is a
      static homepage!). Entries live only for this session.
--------------------------------------------------------- */
function setupGuestbook() {
  var form = document.getElementById("guestbookForm");
  var entriesWrap = document.getElementById("guestbookEntries");
  if (!form || !entriesWrap) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nameField = document.getElementById("gbName");
    var msgField = document.getElementById("gbMessage");
    var name = (nameField.value || "Anonymous Visitor").trim();
    var message = (msgField.value || "").trim();

    if (!message) {
      showRetroAlert("Hey, you forgot to actually write a message! :)");
      return;
    }

    var entry = document.createElement("div");
    entry.className = "guestEntry";
    var now = new Date();
    var dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();

    var nameEl = document.createElement("b");
    nameEl.textContent = escapeHtmlText(name) + " ";
    var dateEl = document.createElement("span");
    dateEl.className = "gDate";
    dateEl.textContent = "(" + dateStr + ")";
    var msgEl = document.createElement("div");
    msgEl.textContent = escapeHtmlText(message);

    entry.appendChild(nameEl);
    entry.appendChild(dateEl);
    entry.appendChild(msgEl);

    entriesWrap.insertBefore(entry, entriesWrap.firstChild);
    form.reset();

    showRetroAlert("Thanks for signing the guestbook, " + escapeHtmlText(name) + "! ✔");
  });
}

function escapeHtmlText(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.textContent;
}

/* ---------------------------------------------------------
   9. Retro "MessageBox"-style alert (instead of ugly native alert)
--------------------------------------------------------- */
function showRetroAlert(message) {
  var overlay = document.getElementById("retroAlertOverlay");
  var msgEl = document.getElementById("retroAlertMessage");
  var okBtn = document.getElementById("retroAlertOk");
  if (!overlay || !msgEl) {
    window.alert(message);
    return;
  }
  msgEl.textContent = message;
  overlay.classList.add("show");

  function close() {
    overlay.classList.remove("show");
    okBtn.removeEventListener("click", close);
  }
  okBtn.addEventListener("click", close);
}

/* ---------------------------------------------------------
   10. Footer copyright year + "last updated" stamp
--------------------------------------------------------- */
function setYear() {
  var yearEl = document.getElementById("copyrightYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
