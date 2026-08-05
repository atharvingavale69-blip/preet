document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("appViewport");
  const cards = document.querySelectorAll(".snap-card");
  const navDots = document.querySelectorAll(".nav-dot");
  const celebrateBtn = document.getElementById("celebrateBtn");
  const muteBtn = document.getElementById("muteBtn");

  let currentIndex = 0;
  let hasPoppedFinale = false;

  // Local Audio File Path Setup
  const bgAudio = new Audio('images/happy-birthday.mp3'); 
  bgAudio.loop = true;
  bgAudio.volume = 0.5;

  let audioInitialized = false;

  // Unlocks browser autoplay restriction on first user gesture
  function initAudioOnUserInteraction() {
    if (!audioInitialized) {
      bgAudio.play().then(() => {
        audioInitialized = true;
        if (muteBtn) muteBtn.textContent = "🔊";
      }).catch((err) => {
        console.log("Audio awaiting user interaction:", err);
      });
    }
  }

  // Event listeners for initializing audio on first touch/scroll/click
  window.addEventListener("click", initAudioOnUserInteraction, { once: true });
  window.addEventListener("touchstart", initAudioOnUserInteraction, { once: true });
  viewport.addEventListener("scroll", initAudioOnUserInteraction, { once: true });

  function triggerHaptic() {
    if ("vibrate" in navigator) {
      navigator.vibrate(25);
    }
  }

  function launchConfetti() {
    triggerHaptic();

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#e5b25d', '#ff2a5f', '#fcf8ed', '#580c1f']
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 }
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 }
      });
    }, 200);
  }

  const observerOptions = {
    root: viewport,
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cards.forEach((c) => c.classList.remove("active-card"));
        entry.target.classList.add("active-card");

        const id = entry.target.id;
        if (id && id.startsWith("chapter-")) {
          currentIndex = parseInt(id.replace("chapter-", ""), 10);
          updateNavDots(currentIndex);
          triggerHaptic();

          if (currentIndex === 7 && !hasPoppedFinale) {
            launchConfetti();
            hasPoppedFinale = true;
          }
        }
      }
    });
  }, observerOptions);

  cards.forEach((card) => observer.observe(card));

  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.getAttribute("data-index"), 10);
      scrollToCard(idx);
    });
  });

  function updateNavDots(index) {
    navDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function scrollToCard(index) {
    const target = document.getElementById(`chapter-${index}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      launchConfetti();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      triggerHaptic();
      if (bgAudio.paused) {
        bgAudio.play();
        muteBtn.textContent = "🔊";
      } else {
        bgAudio.pause();
        muteBtn.textContent = "🔇";
      }
    });
  }

  initCanvas();
});

// Projector Light Dust Particles Engine
function initCanvas() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 0.5,
    color: "rgba(229, 178, 93, 0.35)",
    speedY: Math.random() * 0.4 + 0.1,
    speedX: (Math.random() - 0.5) * 0.2,
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
