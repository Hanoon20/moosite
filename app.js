// ---------- Loader ----------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hide'), 1500);
});

// ---------- Custom cursor ----------
const cursor = document.getElementById('cursor');
if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .why-card, .g-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ---------- Header on scroll ----------
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// ---------- Hero particle canvas ----------
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
function initParticles() {
  particles = [];
  const count = window.innerWidth < 700 ? 26 : 55;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.6,
      vy: Math.random() * 0.35 + 0.08,
      vx: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.5 + 0.15
    });
  }
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.y -= p.vy;
    p.x += p.vx;
    if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,169,106,${p.o})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
resizeCanvas();
initParticles();
drawParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// ---------- Product 3D tilt on mouse ----------
const productImg = document.getElementById('productImg');
const heroStage = document.querySelector('.hero-stage');
let tiltX = 0, tiltY = 0, curX = 0, curY = 0;
heroStage.addEventListener('mousemove', e => {
  const rect = heroStage.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  tiltX = py * -18;
  tiltY = px * 22;
});
heroStage.addEventListener('mouseleave', () => { tiltX = 0; tiltY = 0; });

let scrollRot = 0;
function animateTilt() {
  curX += (tiltX - curX) * 0.06;
  curY += (tiltY - curY) * 0.06;
  productImg.style.transform =
    `rotateX(${curX}deg) rotateY(${curY + scrollRot}deg) translateY(${Math.sin(Date.now()/1500)*8}px)`;
  requestAnimationFrame(animateTilt);
}
animateTilt();

window.addEventListener('scroll', () => {
  scrollRot = Math.min(window.scrollY * 0.06, 40);
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---------- Count-up numbers ----------
const healthNums = document.querySelectorAll('.health-num');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const span = el.querySelector('span');
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        cur += step;
        if (cur >= target) { span.textContent = target; return; }
        span.textContent = cur;
        requestAnimationFrame(tick);
      };
      tick();
      countIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });
healthNums.forEach(el => countIO.observe(el));

// ---------- Smooth-ish scroll offset for anchor links (accounts for fixed header) ----------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ---------- Reduced motion respect ----------
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.ring-1, .ring-2').forEach(r => r.style.animation = 'none');
}
