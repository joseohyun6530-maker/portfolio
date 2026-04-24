(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector("#site-nav");
  var navLinks = siteNav ? siteNav.querySelectorAll("a[href^=\"#\"]") : [];
  var sections = Array.prototype.slice
    .call(document.querySelectorAll("main section[id]"))
    .filter(function (s) {
      return s.id;
    });

  function setMenuOpen(open) {
    if (!header || !navToggle) return;
    header.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    document.body.style.overflow = open ? "hidden" : "";
  }

  function setActiveNav(id) {
    if (!navLinks || !navLinks.length) return;
    navLinks.forEach(function (a) {
      var isActive = a.getAttribute("href") === "#" + id;
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      setMenuOpen(!header.classList.contains("is-open"));
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setMenuOpen(false);
      }

      var href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var headerH = header ? header.getBoundingClientRect().height : 0;
      var y = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      setMenuOpen(false);
    }
  });

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });

    // initial
    setActiveNav(sections[0].id);
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var form = document.getElementById("contact-form");
  if (!form) return;

  var fields = {
    name: { el: document.getElementById("name"), err: document.getElementById("name-error") },
    email: { el: document.getElementById("email"), err: document.getElementById("email-error") },
    subject: { el: document.getElementById("subject"), err: document.getElementById("subject-error") },
    message: { el: document.getElementById("message"), err: document.getElementById("message-error") },
  };

  var statusEl = document.getElementById("form-status");

  function clearErrors() {
    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      if (f.err) f.err.textContent = "";
      if (f.el) f.el.classList.remove("invalid");
    });
  }

  function showError(key, message) {
    var f = fields[key];
    if (f.err) f.err.textContent = message;
    if (f.el) f.el.classList.add("invalid");
  }

  function validate() {
    clearErrors();
    var ok = true;

    if (!fields.name.el.value.trim()) {
      showError("name", "이름을 입력해 주세요.");
      ok = false;
    }

    var email = fields.email.el.value.trim();
    if (!email) {
      showError("email", "이메일을 입력해 주세요.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("email", "올바른 이메일 형식이 아닙니다.");
      ok = false;
    }

    if (!fields.subject.el.value.trim()) {
      showError("subject", "제목을 입력해 주세요.");
      ok = false;
    }

    if (!fields.message.el.value.trim()) {
      showError("message", "메시지를 입력해 주세요.");
      ok = false;
    }

    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (statusEl) {
      statusEl.textContent = "";
      statusEl.classList.remove("is-success");
    }

    if (!validate()) {
      if (statusEl) {
        statusEl.textContent = "입력 내용을 확인해 주세요.";
      }
      return;
    }

    if (statusEl) {
      statusEl.textContent = "전송되었습니다. (데모: 실제 서버로는 전송되지 않습니다)";
      statusEl.classList.add("is-success");
    }
    form.reset();
    clearErrors();
  });
})();
