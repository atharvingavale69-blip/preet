document.addEventListener("DOMContentLoaded", () => {

  // --- Automatic Background Audio Engine ---
  const audio = document.getElementById("bgMusic");
  const muteBtn = document.getElementById("muteBtn");
  const soundIcon = document.getElementById("soundIcon");

  // SVG Paths for Unmuted vs Muted
  const unmutedPath = `M13.5 4.06c0-.52-.39-.96-.9-.99-.52-.04-1 .31-1.1.82l-3.3 6.61H4.5c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h3.7l3.3 6.61c.1.51.58.86 1.1.82.51-.03.9-.47.9-.99V4.06zM18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM16 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z`;
  const mutedPath = `M3.64 2.36a.75.75 0 00-1.06 1.06l18 18a.75.75 0 001.06-1.06l-18-18zM13.5 4.06c0-.52-.39-.96-.9-.99-.52-.04-1 .31-1.1.82l-3.3 6.61H4.5c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h1.22l7.78 7.78V4.06zM18.5 12c0-.82-.23-1.59-.63-2.25l1.52-1.52C20.25 9.38 21 10.61 21 12c0 4.28-2.99 7.86-7 8.77v-2.06c2.89-.86 5-3.54 5-6.71z`;

  function tryAutoPlay() {
    if (!audio) return;
    audio.volume = 0.8;
    
    const promise = audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        removeInteractionListeners();
      }).catch(() => {
        // Autoplay blocked until first user gesture
      });
    }
  }

  function toggleMute() {
    if (!audio) return;
    
    // If paused due to browser autoplay restriction, force play on click
    if (audio.paused) {
      audio.play();
      audio.muted = false;
      soundIcon.querySelector("path").setAttribute("d", unmutedPath);
      muteBtn.classList.remove("is-muted");
      return;
    }

    audio.muted = !audio.muted;
    if (audio.muted) {
      soundIcon.querySelector("path").setAttribute("d", mutedPath);
      muteBtn.classList.add("is-muted");
    } else {
      soundIcon.querySelector("path").setAttribute("d", unmutedPath);
      muteBtn.classList.remove("is-muted");
    }
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", toggleMute);
  }

  // Trigger play on ANY user interaction across page
  const interactionEvents = ["click", "touchstart", "scroll", "wheel", "pointerdown", "mousemove"];

  function handleFirstInteraction() {
    tryAutoPlay();
  }

  function removeInteractionListeners() {
    interactionEvents.forEach(evt => {
      window.removeEventListener(evt, handleFirstInteraction);
      document.removeEventListener(evt, handleFirstInteraction);
    });
  }

  interactionEvents.forEach(evt => {
    window.addEventListener(evt, handleFirstInteraction, { passive: true, once: false });
    document.addEventListener(evt, handleFirstInteraction, { passive: true, once: false });
  });

  // Try playing immediately
  tryAutoPlay();

  // --- Canvas Soft Floating Particles ---
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const count = window.innerWidth < 768 ? 40 : 80;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          speedY: Math.random() * 0.5 + 0.2,
          speedX: Math.sin(Math.random() * Math.PI) * 0.3
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 107, 139, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    });
    
    resizeCanvas();
    drawParticles();
  }

  // --- GSAP ScrollTrigger Stack Tunnel Animation ---
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray(".journey-card");
    const totalCards = cards.length;

    const wrapper = document.querySelector('.stack-wrapper');
    if (wrapper) {
      wrapper.style.height = `${(totalCards + 1) * 100}vh`;
    }

    cards.forEach((card, index) => {
      if (index === 0) {
        gsap.set(card, { scale: 1, opacity: 1, zIndex: 10 });
      } else {
        gsap.set(card, { scale: 0.1, opacity: 0, zIndex: 10 + index });
      }
    });

    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".stack-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const pct = Math.round(self.progress * 100);
          const percentEl = document.getElementById("journeyPercent");
          const fillEl = document.getElementById("journeyFill");
          
          if (fillEl) fillEl.style.width = `${pct}%`;
          if (percentEl) {
            if (pct < 5) percentEl.textContent = "START 🍼";
            else if (pct >= 95) percentEl.textContent = "HBD PREET! 🎂";
            else percentEl.textContent = `${pct}% BDAY ROAD`;
          }
        }
      }
    });

    for (let i = 0; i < totalCards - 1; i++) {
      const currentCard = cards[i];
      const nextCard = cards[i + 1];

      mainTimeline
        .to(nextCard, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.inOut"
        })
        .to(currentCard, {
          scale: 2.5,
          opacity: 0,
          filter: "blur(12px)",
          duration: 1,
          ease: "power2.inOut"
        }, "<");
    }
  }

  // --- Fireworks Event Trigger ---
  const celebrateBtn = document.getElementById("celebrateBtn");
  if (celebrateBtn && typeof confetti !== "undefined") {
    celebrateBtn.addEventListener("click", () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#E86B8B', '#D44D72', '#D4A359', '#FFFFFF']
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#E86B8B', '#D44D72', '#D4A359', '#FFFFFF']
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      })();
    });
  }

});