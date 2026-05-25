/*
  Invitación William & Belen
  JavaScript puro
*/

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const envelope = document.getElementById("envelope");
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

  function openInvitation() {
    envelope.classList.add("open");
    intro.classList.add("opening");
    invitation.classList.remove("hidden");
    openButton.disabled = true;
    audioMessage.textContent = "Abriendo invitación...";

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

    setTimeout(() => {
      intro.classList.add("hidden");
      musicToggle.classList.remove("hidden");
      document.body.classList.remove("intro-active");
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.querySelector(".hero")?.classList.add("visible");
      observeRevealElements();
    }, 1650);
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
        if (entry.isIntersecting) {
          const pending = Array.from(revealElements).filter((el) => !el.classList.contains("visible"));
          const index = Math.max(0, pending.indexOf(entry.target));
          entry.target.style.transitionDelay = `${Math.min(index * 75, 225)}ms`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px"
    });

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
