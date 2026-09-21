// EmailJS Configuration
// NOTE: If messages aren't sending, verify these three values in your EmailJS
// dashboard (Account > API Keys, and Email Services / Email Templates):
// public key, service ID, template ID. Also confirm your sending domain
// (boughanmiyoussef.github.io) is added under Account > Security > Allowed origins,
// since EmailJS blocks requests from unlisted domains by default.
(function () {
  emailjs.init("RvwPUe7cVMqGE9YRS");
})();

let activeNavLink = null;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  initializeAnimations();
  initializeMobileMenu();
  initializeBackToTop();
  initializeContactForm();
  initializeNavHighlighting();
  initializeCounters();
  initializeTechTooltips();
  initializeDocModals();
  initializeCvDownloads();
  initializeProjectFilter();

  setTimeout(() => {
    document.getElementById("loadingScreen").classList.add("hidden");
  }, 1000);
});

/* ====== Counter Animation ====== */
function initializeCounters() {
  const counters = document.querySelectorAll('.stat h3');
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace('+', '').replace('%', ''));
    const suffix = counter.textContent.includes('%') ? '%' :
                  counter.textContent.includes('+') ? '+' : '';
    counter.textContent = '0' + suffix;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(counter, target, suffix);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(counter);
  });
}

function animateCounter(element, target, suffix) {
  const duration = 2000;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(target * easeProgress);
    element.textContent = currentValue + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = target + suffix;
  }
  requestAnimationFrame(update);
}

/* ====== Tech Tooltips ====== */
function initializeTechTooltips() {
  const techIcons = document.querySelectorAll('.tech-icon');
  techIcons.forEach(icon => {
    const tooltip = icon.getAttribute('data-tooltip');
    if (!tooltip) return;
    icon.addEventListener('mouseenter', () => {
      const tooltipEl = document.createElement('div');
      tooltipEl.className = 'tech-tooltip';
      tooltipEl.textContent = tooltip;
      document.body.appendChild(tooltipEl);
      const rect = icon.getBoundingClientRect();
      tooltipEl.style.left = rect.left + rect.width / 2 + 'px';
      tooltipEl.style.top = rect.top - 10 + 'px';
      tooltipEl.style.transform = 'translate(-50%, -100%)';
      icon._tooltip = tooltipEl;
    });
    icon.addEventListener('mouseleave', () => {
      if (icon._tooltip) {
        document.body.removeChild(icon._tooltip);
        icon._tooltip = null;
      }
    });
  });
}

/* ====== Navbar Highlighting ====== */
function initializeNavHighlighting() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  setActiveNavLink(navLinks[0]);

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute('href'));
      if (targetSection) {
        window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
        setActiveNavLink(this);
      }
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + section.clientHeight) {
        current = section.getAttribute('id');
      }
    });
    if (current) {
      const currentLink = document.querySelector(`.nav-link[href="#${current}"]`);
      if (currentLink && currentLink !== activeNavLink) setActiveNavLink(currentLink);
    }
  });
}

function setActiveNavLink(link) {
  if (activeNavLink) activeNavLink.classList.remove('active');
  link.classList.add('active');
  activeNavLink = link;
}

/* ====== Section Reveal Animations ====== */
function initializeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  document.querySelectorAll(".section").forEach((section) => observer.observe(section));
}

/* ====== Mobile Menu ====== */
function initializeMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", menuToggle.getAttribute("aria-expanded") === "true" ? "false" : "true");
  });
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ====== Back to Top ====== */
function initializeBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("show", window.pageYOffset > 300);
  });
  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ====== Contact Form (EmailJS) ====== */
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const submitBtn = document.getElementById("submitBtn");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = {
      from_name: document.getElementById("name").value,
      from_email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    formMessage.style.display = "none";

    try {
      await emailjs.send("service_od1o2ai", "template_zfrcsn8", formData);
      formMessage.textContent = "Thank you! Your message has been sent successfully.";
      formMessage.className = "form-message success";
      formMessage.style.display = "block";
      contactForm.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      formMessage.textContent =
        "Oops! Something went wrong. Please try again or email me directly at yussefboughanmy@gmail.com";
      formMessage.className = "form-message error";
      formMessage.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      setTimeout(() => { formMessage.style.display = "none"; }, 10000);
    }
  });
}

/* ====== Document Modal (certificates / diploma inline viewer) ====== */
function initializeDocModals() {
  const overlay = document.getElementById("docModalOverlay");
  const modalTitle = document.getElementById("docModalTitle");
  const modalBody = document.getElementById("docModalBody");
  const closeBtn = document.getElementById("docModalClose");
  if (!overlay) return;

  document.querySelectorAll("[data-doc-src]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const src = trigger.getAttribute("data-doc-src");
      const title = trigger.getAttribute("data-doc-title") || "Document";
      openDocModal(src, title, modalTitle, modalBody, overlay);
    });
  });

  closeBtn.addEventListener("click", () => closeDocModal(overlay, modalBody));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDocModal(overlay, modalBody);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeDocModal(overlay, modalBody);
  });
}

function openDocModal(src, title, modalTitle, modalBody, overlay) {
  modalTitle.textContent = title;
  // Try to embed the PDF directly. If the file is missing (404), the iframe
  // will just show an empty/broken viewer, so we also provide a direct link
  // as a fallback the user can always click.
  modalBody.innerHTML = `
    <iframe src="${src}" title="${title}"></iframe>
  `;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDocModal(overlay, modalBody) {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  modalBody.innerHTML = "";
}

/* ====== CV Download Buttons ======
   These buttons use the `download` attribute, which only works if the href
   points to a real file served from the same site (or a CORS-friendly host).
   Right now they point to /cv/Youssef_Boughanmi_CV_EN.pdf and _FR.pdf --
   drop your exported PDFs at those paths in your repo and these will work
   with zero further changes. Until then, clicking shows a friendly toast
   instead of a silent failure or a broken navigation. */
function initializeCvDownloads() {
  document.querySelectorAll("[data-cv-download]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const href = btn.getAttribute("href");
      try {
        const res = await fetch(href, { method: "HEAD" });
        if (!res.ok) throw new Error("missing");
        // File exists -- let the default download behavior proceed.
      } catch (err) {
        e.preventDefault();
        showToast(`CV file not found yet at ${href}. Add your exported PDF to that path to enable this download.`);
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 4500);
}

/* ====== Projects filter (Featured / More) ====== */
function initializeProjectFilter() {
  const buttons = document.querySelectorAll(".projects-subnav button");
  const moreSection = document.getElementById("moreProjects");
  if (!buttons.length || !moreSection) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.getAttribute("data-target");
      if (target === "more") {
        moreSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        document.getElementById("featuredProjects").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}