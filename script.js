document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("appViewport");
  const cards = document.querySelectorAll(".snap-card");
  const navDots = document.querySelectorAll(".nav-dot");
  const celebrateBtn = document.getElementById("celebrateBtn");
  const muteBtn = document.getElementById("muteBtn");

  let currentIndex = 0;
  let hasPoppedFinale = false;

  // Background Audio Setup & Browser Autoplay Fix
  const bgAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'); 
  bgAudio.loop = true;
  bgAudio.volume = 0.4;

  let audioInitialized = false;

  // Unlocks browser autoplay on first user interaction
  function initAudioOnUserInteraction() {
    if (!audioInitialized) {
      bgAudio.play().then(() => {
        audioInitialized = true;
        if (muteBtn) muteBtn.textContent = "🔊";
      }).catch((err) => {
        console.log("Audio waiting for user gesture:", err);
      });
    }
  }

  // Event listeners for unlocking audio on first touch/click
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
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00ffcc', '#ff71ce', '#fdbb2d', '#ff007f']
    });

    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 }
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
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

  // Audio Toggle Button logic
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

  const particles = Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    color: "#00ffcc",
    speedY: Math.random() * 0.6 + 0.2,
    speedX: (Math.random() - 0.5) * 0.3,
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    requestAnimationFrame(animate);
  }

  animate();
}
