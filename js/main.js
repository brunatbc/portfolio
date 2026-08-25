let currentLanguage = "pt";
window.currentLanguage = currentLanguage;

function updateLanguage(language) {
  if (!translations[language]) return;

  currentLanguage = language;
  window.currentLanguage = language;

  const dictionary = translations[language];

  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      "content",
      language === "pt"
        ? "Portfólio de Web Design, UI/UX e WordPress — Bruna Teles."
        : "Web Design, UI/UX and WordPress portfolio — Bruna Teles.",
    );
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key] !== undefined) element.innerHTML = dictionary[key];
  });

  document.querySelectorAll(".lang a").forEach((link) => {
    link.classList.toggle("active", link.dataset.lang === language);
  });

  document.querySelectorAll("[data-alt-pt][data-alt-en]").forEach((image) => {
    image.alt = language === "pt" ? image.dataset.altPt : image.dataset.altEn;
  });

  localStorage.setItem("portfolio-language", language);

  if (typeof window.updateLastFM === "function") {
    window.updateLastFM();
  }
}

document.querySelectorAll(".lang a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    updateLanguage(link.dataset.lang);
  });
});

const savedLanguage = localStorage.getItem("portfolio-language");
updateLanguage(
  savedLanguage === "en" || savedLanguage === "pt" ? savedLanguage : "pt",
);

if (typeof window.updateLastFM === "function") {
  window.updateLastFM();
  setInterval(window.updateLastFM, 30000);
}
