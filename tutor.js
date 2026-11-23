/* Tutor application form (tutor.html). Settings live in config.js. */
const tutorForm = document.getElementById("tutor-form");
const tutorStatus = document.getElementById("tutor-status");
const tutorSubmit = tutorForm.querySelector('button[type="submit"]');
const fileInput = document.getElementById("qualification-file");
const fileInfo = document.getElementById("file-info");

const MAX_BYTES = CONFIG.MAX_UPLOAD_MB * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXT = /\.(pdf|jpe?g|png)$/i;

document.querySelectorAll("[data-max-mb]").forEach((el) => { el.textContent = CONFIG.MAX_UPLOAD_MB; });

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const setTutorStatus = (text, state) => {
  tutorStatus.textContent = text;
  tutorStatus.dataset.state = state;
};

/* Check the file as soon as it's chosen, so a wrong file is caught before sending. */
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileInput.setCustomValidity("");
  fileInfo.dataset.state = "";

  if (!file) {
    fileInfo.textContent = "";
    return;
  }

  const typeOk = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXT.test(file.name);
  if (!typeOk) {
    fileInput.setCustomValidity("Choose a PDF, JPG or PNG file.");
  } else if (file.size > MAX_BYTES) {
    fileInput.setCustomValidity(`This file is ${formatSize(file.size)}. Choose a file up to ${CONFIG.MAX_UPLOAD_MB} MB, or scan it at a lower resolution.`);
  }

  if (fileInput.validationMessage) {
    fileInfo.textContent = fileInput.validationMessage;
    fileInfo.dataset.state = "error";
  } else {
    fileInfo.textContent = `Selected: ${file.name} (${formatSize(file.size)})`;
    fileInfo.dataset.state = "ok";
  }
});

tutorForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!CONFIG.TUTOR_FORM_ENDPOINT) {
    setTutorStatus("This form isn't connected yet. Set TUTOR_FORM_ENDPOINT in config.js. See README.md, section 3.", "error");
    return;
  }

  tutorSubmit.disabled = true;
  tutorSubmit.textContent = "Sending...";
  setTutorStatus("Uploading your application. Keep this page open.", "");

  try {
    // Send FormData as-is. Don't set Content-Type: the browser adds the multipart boundary for the file.
    const res = await fetch(CONFIG.TUTOR_FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(tutorForm),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Form service returned ${res.status}`);
    tutorForm.reset();
    fileInfo.textContent = "";
    fileInfo.dataset.state = "";
    setTutorStatus("Application sent. We'll reply by email within 3 working days.", "ok");
  } catch (err) {
    console.error(err);
    setTutorStatus("Your application didn't send. Check your connection and file size, then try again.", "error");
  } finally {
    tutorSubmit.disabled = false;
    tutorSubmit.textContent = "Send application";
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
