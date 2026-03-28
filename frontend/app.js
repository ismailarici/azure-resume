// ===== MOBILE MENU =====
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('nav ul');

if (menuToggle && navList) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navList.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', navList.classList.contains('active'));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = document.querySelector('#navbar').offsetHeight;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth',
      });
    }
  });
});

// ===== TYPEWRITER =====
const phrases = [
  'Security Engineer',
  'Cloud Security Specialist',
  'Threat & Vulnerability Manager',
  'ISO 27001 / SOC 2 Practitioner',
];

let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
const typewriterEl = document.getElementById('typewriter');

function typeWriter() {
  if (!typewriterEl) return;
  const current = phrases[phraseIdx];

  if (deleting) {
    typewriterEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeWriter, 400);
      return;
    }
    setTimeout(typeWriter, 38);
  } else {
    typewriterEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) {
      deleting = true;
      setTimeout(typeWriter, 2200);
      return;
    }
    setTimeout(typeWriter, 75);
  }
}

typeWriter();

// ===== SCROLL REVEAL =====
const revealTargets = document.querySelectorAll(
  '.skill-card, .timeline-item, .education-item, .project-card, .cert-card, .section-header'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// ===== VISITOR COUNTER =====
async function updateVisitorCount() {
  const proxyUrl = "__AZURE_FUNCTION_URL__&code=__AZURE_FUNCTION_KEY__";
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      const el = document.getElementById('visitor-count');
      if (el) el.textContent = `[ ${data.visitor_count} visits ]`;
    }
  } catch (err) {
    console.error('Visitor count error:', err);
  }
}

updateVisitorCount();

// ===== LAZY LOADING =====
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach((img) => imgObserver.observe(img));
}
