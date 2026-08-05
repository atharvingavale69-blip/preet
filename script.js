document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".mobile-card");
  const navDots = document.querySelectorAll(".nav-dot");
  const entryOverlay = document.getElementById("entryOverlay");
  const startBtn = document.getElementById("startBtn");
  const celebrateBtn = document.getElementById("celebrateBtn");
  const muteBtn = document.getElementById("muteBtn");

  // Intersection Observer for Smooth Animations and Dynamic Nav Dot Updates
  const observerOptions = {
    threshold: 0.25, // Card 25% visible hote hi active ho jayegi
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Active card ko visible animation trigger karein
        entry.target.classList.add("is-visible");

        // Dynamic Bottom Nav Dot Update
        const id = entry.target.id;
        if (id && id.startsWith("chapter-")) {
          const index = parseInt(id.replace("chapter-", ""), 10);
          navDots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === index);
          });
        }
      }
    });
  }, observerOptions);

  cards.forEach((card) => observer.observe(card));

  // Overlay Dismiss Event
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      entryOverlay.style.opacity = "0";
      setTimeout(() => {
        entryOverlay.style.display = "none";
      }, 400);
    });
  }

  // Celebration Final Button Event
  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      alert("🎉 Happy Birthday! Wishing you an unforgettable year ahead!");
    });
  }

  // Floating Mute / Unmute Control
  let isMuted = false;
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      muteBtn.textContent = isMuted ? "🔇" : "🔊";
    });
  }

  // Initialize Particle Background
  initCanvas();
});

// Scroll to specific chapter when clicking navigation dots
function scrollToChapter(index) {
  const target = document.getElementById(`chapter-${index}`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Background Floating Gold Dust Particles
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

  // Particle configuration
  const particles = Array.from({ length: 25 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    color: "rgba(197, 155, 39, 0.35)",
    speedY: Math.random() * 0.4 + 0.1,
    speedX: (Math.random() - 0.5) * 0.2,
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;

      // Loop particles around boundaries
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
