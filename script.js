/* SteadyState home page script. Settings (WhatsApp number, form endpoints) live in config.js. */

/* WhatsApp links */
const waHref = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)}`;
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = waHref;
  link.target = "_blank";
  link.rel = "noopener";
});

/* Mobile menu */
const header = document.getElementById("site-header");
const navToggle = document.querySelector(".nav-toggle");
const setMenu = (open) => {
  header.dataset.open = String(open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
};
navToggle.addEventListener("click", () => setMenu(header.dataset.open !== "true"));
document.querySelectorAll(".site-nav a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && header.dataset.open === "true") {
    setMenu(false);
    navToggle.focus();
  }
});

/* Course search */
const searchInput = document.getElementById("course-search");
const courses = Array.from(document.querySelectorAll("#course-list li"));
const courseGroups = Array.from(document.querySelectorAll("#course-list .course-group"));
const emptyState = document.getElementById("course-empty");
const emptyTerm = document.getElementById("course-empty-term");

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  let shown = 0;
  courses.forEach((li) => {
    const haystack = `${li.textContent} ${li.dataset.keywords || ""}`.toLowerCase();
    const match = term === "" || haystack.includes(term);
    li.hidden = !match;
    if (match) shown += 1;
  });
  // Hide a year heading when none of its courses match.
  courseGroups.forEach((group) => {
    group.hidden = !group.querySelector("li:not([hidden])");
  });
  emptyTerm.textContent = searchInput.value.trim();
  emptyState.hidden = shown > 0;
});

/* Course suggestions in the registration form, built from the course list */
const courseOptions = document.getElementById("course-options");
courses.forEach((li) => {
  const option = document.createElement("option");
  option.value = li.querySelector("h4").textContent.replace(/\s+/g, " ").trim();
  courseOptions.appendChild(option);
});

/* "Book" buttons pre-select the package in the registration form */
const packageSelect = document.getElementById("package");
document.querySelectorAll("[data-package]").forEach((btn) => {
  btn.addEventListener("click", () => {
    packageSelect.value = btn.dataset.package;
    document.querySelectorAll(".price-table tr.is-picked").forEach((tr) => tr.classList.remove("is-picked"));
    btn.closest("tr").classList.add("is-picked");
  });
});

/* Reviews carousel */
const slides = Array.from(document.querySelectorAll("[data-slide]"));
const reviewCount = document.getElementById("review-count");
let current = 0;
const showSlide = (i) => {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, idx) => { s.hidden = idx !== current; });
  reviewCount.textContent = `${current + 1} of ${slides.length}`;
};
document.querySelector("[data-prev]").addEventListener("click", () => showSlide(current - 1));
document.querySelector("[data-next]").addEventListener("click", () => showSlide(current + 1));

/* Registration form */
const form = document.getElementById("register-form");
const statusEl = document.getElementById("form-status");
const submitBtn = form.querySelector('button[type="submit"]');

const setStatus = (text, state) => {
  statusEl.textContent = text;
  statusEl.dataset.state = state;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!CONFIG.FORM_ENDPOINT) {
    setStatus("This form isn't connected yet. Add your Formspree endpoint to FORM_ENDPOINT in config.js.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  setStatus("", "");

  try {
    const res = await fetch(CONFIG.FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Form service returned ${res.status}`);
    form.reset();
    document.querySelectorAll(".price-table tr.is-picked").forEach((tr) => tr.classList.remove("is-picked"));
    setStatus("Registration sent. We'll message you on WhatsApp within one day.", "ok");
  } catch (err) {
    console.error(err);
    setStatus("Your registration didn't send. Check your connection and try again, or message us on WhatsApp.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send registration";
  }
});

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();
