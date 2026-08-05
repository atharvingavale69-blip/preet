document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("appViewport");
  const cards = document.querySelectorAll(".snap-card");
  const navDots = document.querySelectorAll(".nav-dot");
  const celebrateBtn = document.getElementById("celebrateBtn");
  const muteBtn = document.getElementById("muteBtn");

  let currentIndex = 0;
  let hasPoppedFinale = false;

  // 1. Native Touch Haptic Vibration
  function triggerHaptic() {
    if ("vibrate" in navigator) {
      navigator.vibrate(25);
    }
  }

  // 2. Confetti Explosion Feature (Mobile-Optimized)
  function launchConfetti() {
    triggerHaptic();

    // Center Burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EAB308', '#F97316', '#FFFFFF', '#EC4899', '#3B82F6']
    });

    // Side Cannon Streamers
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

  // 3. Intersection Observer for Active Card Detection & Finale Auto-Pop
  const observerOptions = {
    root: viewport,
    threshold: 0.6
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

          // Auto Confetti pop when user reaches Finale (Chapter 7)
          if (currentIndex === 7 && !hasPoppedFinale) {
            launchConfetti();
            hasPoppedFinale = true;
          }
        }
      }
    });
  }, observerOptions);

  cards.forEach((card) => observer.observe(card));

  // 4. Bottom Nav Dot Click
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

  // 5. Touch Swipe Gesture Engine
  let startY = 0;
  let endY = 0;

  viewport.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    endY = e.changedTouches[0].clientY;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    const diff = startY - endY;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentIndex < cards.length - 1) {
        scrollToCard(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        scrollToCard(currentIndex - 1);
      }
    }
  }

  // 6. Celebration Button Tap Event -> Burst Confetti
  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      launchConfetti();
    });
  }

  // 7. Audio Toggle
  let isMuted = false;
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      muteBtn.textContent = isMuted ? "🔇" : "🔊";
      triggerHaptic();
    });
  }

  // Background Particles Engine
  initCanvas();
});

// Canvas Background Render Engine
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
    radius: Math.random() * 2 + 1,
    color: "rgba(234, 179, 8, 0.4)",
    speedY: Math.random() * 0.5 + 0.2,
    speedX: (Math.random() - 0.5) * 0.2,
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
