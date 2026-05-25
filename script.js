/*
  Invitación William & Belen
  Entrada reconstruida con secuencia cinematográfica
*/

document.addEventListener("DOMContentLoaded", () => {
  const OPENING_DURATION = 4300;
  const HERO_REVEAL_DELAY = 320;

  const intro = document.getElementById("intro");
  const openButton = document.getElementById("openInvitation");
  const invitation = document.getElementById("invitation");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const audioMessage = document.getElementById("audioMessage");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const countdownMessage = document.getElementById("countdownMessage");

  const whatsappButton = document.getElementById("whatsappButton");
  const guestName = document.getElementById("guestName");
  const attendance = document.getElementById("attendance");
  const calendarButton = document.getElementById("calendarButton");

  const weddingDate = new Date("2026-06-07T10:00:00-05:00");

  let hasOpened = false;

  function openInvitation() {
    if (hasOpened) return;
    hasOpened = true;

    // 1. La invitación entra detrás desde el primer instante.
    invitation.classList.remove("hidden");
    invitation.classList.add("behind-opening");
    invitation.classList.remove("ready");

    // Forzar que el navegador registre el estado inicial antes de animar.
    requestAnimationFrame(() => {
      intro.classList.add("opening");
      invitation.classList.add("opening-live");
      openButton.disabled = true;
      audioMessage.textContent = "Abriendo invitación...";
    });

    bgMusic.volume = 0.72;
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicToggle.textContent = "❚❚";
          audioMessage.textContent = "";
        })
        .catch(() => {
          audioMessage.textContent = "La música está lista. Puedes activarla con el botón ♫.";
          musicToggle.textContent = "♫";
        });
    }

    // 2. La portada ya está visible y se aclara mientras la carta se abre.
    window.setTimeout(() => {
      invitation.classList.add("ready");
      document.querySelector(".hero")?.classList.add("visible");
    }, HERO_REVEAL_DELAY);

    // 3. El intro desaparece solo cuando ya no se nota el cambio.
    window.setTimeout(() => {
      intro.classList.add("finished");
    }, OPENING_DURATION - 420);

    window.setTimeout(() => {
      intro.classList.add("hidden");
      musicToggle.classList.remove("hidden");
      document.body.classList.remove("intro-active");
      invitation.classList.remove("behind-opening", "opening-live");
      invitation.classList.add("ready");
      window.scrollTo({ top: 0, behavior: "smooth" });
      observeRevealElements();
      window.setTimeout(() => {
        document.body.classList.add("petals-active");
        console.log("petals-active on");
      }, 1500);
    }, OPENING_DURATION);
  }

  openButton.addEventListener("click", openInvitation);

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play()
        .then(() => {
          musicToggle.textContent = "❚❚";
        })
        .catch(() => {
          musicToggle.textContent = "♫";
        });
    } else {
      bgMusic.pause();
      musicToggle.textContent = "♫";
    }
  });

  function observeRevealElements() {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (entry.isIntersecting) {
          target.style.transitionDelay = target.dataset.delay || "0ms";
          target.classList.add("visible");
          return;
        }

        // Re-activa suavemente solo si el elemento queda bastante abajo.
        if (entry.boundingClientRect.top > window.innerHeight * 1.12) {
          target.classList.remove("visible");
          target.style.transitionDelay = "0ms";
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px"
    });

    revealElements.forEach((element, index) => {
      element.dataset.delay = `${Math.min(index * 36, 144)}ms`;
      observer.observe(element);
    });
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

  function buildWhatsAppMessage() {
    const name = guestName.value.trim();
    const willAttend = attendance.value === "si";

    if (!name) {
      guestName.focus();
      alert("Por favor, escribe tu nombre antes de confirmar.");
      return null;
    }

    if (willAttend) {
      return `Hola, confirmo mi asistencia a la boda de William Paredes y Belen Toasa. Mi nombre es: ${name}. Muchas gracias.`;
    }

    return `Hola, gracias por la invitación a la boda de William Paredes y Belen Toasa. Mi nombre es: ${name}. Lamentablemente no podré asistir. Muchas gracias.`;
  }

  whatsappButton.addEventListener("click", () => {
    const message = buildWhatsAppMessage();
    if (!message) return;

    const phone = "593990925919";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });

  function buildGoogleCalendarLink() {
    const baseUrl = "https://www.google.com/calendar/render";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Boda de William Paredes y Belen Toasa",
      dates: "20260607T150000Z/20260607T210000Z",
      ctz: "America/Guayaquil",
      location: "Iglesia evangélica Bilingüe Getsemaní y recepción en Licán",
      details: "Acompáñanos a celebrar la boda de William Paredes y Belen Toasa. Ceremonia a las 10:00 a. m. en Iglesia evangélica Bilingüe Getsemaní y recepción a las 12:00 p. m. en Licán."
    });

    return `${baseUrl}?${params.toString()}`;
  }

  calendarButton.href = buildGoogleCalendarLink();

  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
  }
});
