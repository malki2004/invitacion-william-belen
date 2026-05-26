/*
  Invitación William & Belen - Script Optimizado Completo
  Corrección: el sello rojo ahora oculta completamente la pantalla inicial
  y muestra la invitación principal sin cambiar textos ni contenido.
*/

document.addEventListener("DOMContentLoaded", () => {
  const OPENING_DURATION = 1500; // Mantiene el tiempo de apertura original

  const intro = document.getElementById("intro");
  const openButton = document.getElementById("openInvitation");
  const invitation = document.getElementById("invitation");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const countdownMessage = document.getElementById("countdownMessage");
  const calendarButton = document.getElementById("calendarButton");

  const weddingDate = new Date("2026-06-07T10:00:00-05:00");
  let hasOpened = false;


  function finishOpening() {
    const heroSection = document.querySelector(".hero.reveal");
    if (heroSection) {
      heroSection.classList.add("visible");
    }

    intro.classList.add("finished");
    intro.setAttribute("aria-hidden", "true");
    intro.style.opacity = "0";
    intro.style.visibility = "hidden";
    intro.style.pointerEvents = "none";

    document.body.classList.remove("intro-active");
    invitation.classList.add("ready");
    musicToggle.classList.remove("hidden");
    document.body.classList.add("petals-active");
    observeRevealElements();

    window.setTimeout(() => {
      intro.style.display = "none";
    }, 700);
  }

  function openInvitation(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (hasOpened) return;
    hasOpened = true;

    invitation.classList.remove("hidden");
    document.body.classList.add("petals-active");
    intro.classList.add("opening");
    openButton.disabled = true;

    if (bgMusic) {
      bgMusic.volume = 0.7;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            musicToggle.textContent = "❚❚";
          })
          .catch(() => {
            musicToggle.textContent = "♫";
          });
      }
    }

    window.setTimeout(finishOpening, OPENING_DURATION);
  }

  openButton.addEventListener("click", openInvitation);
  openButton.addEventListener("touchend", openInvitation, { passive: false });

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => { musicToggle.textContent = "❚❚"; }).catch(() => { musicToggle.textContent = "♫"; });
    } else {
      bgMusic.pause();
      musicToggle.textContent = "♫";
    }
  });

  function observeRevealElements() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    const distance = weddingDate.getTime() - now.getTime();

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      countdownMessage.textContent = "¡Hoy celebramos nuestro gran día!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
    countdownMessage.textContent = "Domingo 7 de junio de 2026 · 10:00 a. m.";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  function buildGoogleCalendarLink() {
    const baseUrl = "https://www.google.com/calendar/render";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Boda de William Paredes y Belén Toasa",
      dates: "20260607T150000Z/20260607T210000Z",
      ctz: "America/Guayaquil",
      location: "Iglesia evangélica Bilingüe Getsemaní y recepción en Licán",
      details: "Acompáñanos a celebrar la boda de William Paredes y Belén Toasa."
    });
    return `${baseUrl}?${params.toString()}`;
  }

  calendarButton.href = buildGoogleCalendarLink();
});
