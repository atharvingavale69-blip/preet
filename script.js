document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("appViewport");
  const cards = document.querySelectorAll(".snap-card");
  const navDots = document.querySelectorAll(".nav-dot");
  const celebrateBtn = document.getElementById("celebrateBtn");
  const muteBtn = document.getElementById("muteBtn");

  let currentIndex = 0;

  // 1. Native Touch Haptic Vibration (If Supported by Browser)
  function triggerHaptic() {
    if ("vibrate" in navigator) {
      navigator.vibrate(15);
    }
  }

  // 2. Intersection Observer for Active Card Detection & Navigation Sync
  const observerOptions = {
    root: viewport,
    threshold: 0.6 // Card 60% view me aate hi active hogi
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
        }
      }
    });
  }, observerOptions);

  cards.forEach((card) => observer.observe(card));

  // 3. Bottom Nav Dot Click to Direct Scroll
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

  // 4. Touch Swipe Gesture Engine (Manual fallback & smooth feel)
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
    if (Math.abs(diff) > 40) { // Touch Threshold 40px
      if (diff > 0 && currentIndex < cards.length - 1) {
        // Swiped Up -> Go to Next
        scrollToCard(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // Swiped Down -> Go to Previous
        scrollToCard(currentIndex - 1);
      }
    }
  }

  // 5. Celebration Event
  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      triggerHaptic();
      alert("🎉 Happy Birthday! Wishing you an amazing year ahead!");
    });
  }

  // 6. Audio Toggle
  let isMuted = false;
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      muteBtn.textContent = isMuted ? "🔇" : "🔊";
      triggerHaptic();
    });
  }

  // 7. Background Floating Gold Particles
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
