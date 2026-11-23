/* Site settings shared by every page. Edit these before you go live. See README.md. */
const CONFIG = {
  // Your WhatsApp number in international format, digits only (country code first, no + or spaces).
  // Malaysian example: "60123456789".
  WHATSAPP_NUMBER: "0000000000",
  WHATSAPP_MESSAGE: "Hi SteadyState, I'd like to ask about tutoring.",

  // Student registration form (index.html). Text only, so the free Formspree plan works.
  // Paste your Formspree endpoint, for example "https://formspree.io/f/abcdwxyz".
  FORM_ENDPOINT: "",

  // Tutor application form (tutor.html). This form uploads a file.
  // Free option: host on Netlify, turn on form detection, and set this to "/".
  // Paid option: a Formspree plan that includes file uploads, then paste its endpoint here.
  TUTOR_FORM_ENDPOINT: "",

  // Largest qualification file a tutor can upload, in MB. Netlify caps a whole submission at 8 MB.
  MAX_UPLOAD_MB: 5,
};
