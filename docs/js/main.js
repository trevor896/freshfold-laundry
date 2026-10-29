const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const menuIcon = menuToggle.querySelector("img");
const header = document.querySelector(".site-header");
const brandLink = document.querySelector(".brand");
const hero = document.querySelector(".hero");
const bookingSection = document.querySelector("#booking");
const heroPickupForm = document.querySelector("#hero-pickup-form");
const heroAddressInput = document.querySelector("#hero-address");
const pickupPeriod = document.querySelector("#pickup-period");
const pickupWindowInput = document.querySelector("#pickup-window");
const floatingBook = document.querySelector(".floating-book");
const progressBar = document.querySelector(".scroll-progress span");

function updatePickupPeriod() {
  const hour = new Date().getHours();
  const period = hour >= 5 && hour < 12
    ? "Morning"
    : hour >= 12 && hour < 17
      ? "Afternoon"
      : "Tonight";

  pickupPeriod.textContent = period;
  pickupWindowInput.value = period;
}

updatePickupPeriod();
window.setInterval(updatePickupPeriod, 60_000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updatePickupPeriod();
});

heroAddressInput.addEventListener("input", () => {
  heroAddressInput.setCustomValidity("");
});

heroPickupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const address = heroAddressInput.value.trim();
  if (!address) {
    heroAddressInput.setCustomValidity("Please enter your pickup address.");
    heroAddressInput.reportValidity();
    return;
  }

  heroAddressInput.value = address;
  document.querySelector("#customer-area").value = address;
  updatePickupPeriod();
  bookingSection.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
  document.querySelector("#customer-name").focus({ preventScroll: true });
});

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  siteNav.classList.toggle("open", isOpen);
  menuIcon.src = isOpen
    ? "assets/lucide-icons/icons/x.svg"
    : "assets/lucide-icons/icons/menu.svg";
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

siteNav.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.querySelector("#booking-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = formData.get("name").trim();
  const area = formData.get("area").trim();
  const service = formData.get("service");
  const notes = formData.get("notes").trim();
  const pickupWindow = formData.get("pickupWindow");
  const message = [
    "Hi FreshFold, I would like to book a pickup.",
    `Name: ${name}`,
    `Pickup area / address: ${area}`,
    pickupWindow ? `Preferred pickup window: ${pickupWindow}` : "",
    `Service: ${service}`,
    notes ? `Notes: ${notes}` : "",
  ].filter(Boolean).join("\n");
  const whatsappUrl = `https://wa.me/26771000000?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroVideo = document.querySelector(".hero-video");
const revealElements = document.querySelectorAll(
  ".section-heading, .service-card, .process-intro, .process-step, .care-image, .care-copy, .pricing-copy, .price-card, .areas-layout > *, .testimonial-heading, .testimonial-card, .faq-intro, .faq-item, .booking-copy, .booking-form",
);

if (reducedMotion) {
  heroVideo.pause();
}

if (!reducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("scroll-effects");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

const navigationSections = [...siteNav.querySelectorAll('a[href^="#"]')]
  .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
  .filter(({ section }) => section);

function updateActiveNavigation() {
  const activationLine = header.getBoundingClientRect().bottom + 32;
  const activeSection = [...navigationSections].reverse().find(({ section }) =>
    section.getBoundingClientRect().top <= activationLine,
  );

  navigationSections.forEach(({ link, section }) => {
    if (activeSection?.section === section) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
  if (activeSection) {
    brandLink.removeAttribute("aria-current");
  } else {
    brandLink.setAttribute("aria-current", "location");
  }
}
updateActiveNavigation();

let scrollFrame = 0;
function updateScrollChrome() {
  const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableDistance > 0 ? window.scrollY / scrollableDistance : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  header.classList.toggle("is-scrolled", window.scrollY > 24);

  const hasPassedHero = hero.getBoundingClientRect().bottom < window.innerHeight * 0.35;
  const bookingIsNear = bookingSection.getBoundingClientRect().top < window.innerHeight * 0.65;
  floatingBook.classList.toggle("is-visible", hasPassedHero && !bookingIsNear);
  updateActiveNavigation();
  scrollFrame = 0;
}

window.addEventListener("scroll", () => {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(updateScrollChrome);
  }
}, { passive: true });

window.addEventListener("resize", updateScrollChrome);
updateScrollChrome();