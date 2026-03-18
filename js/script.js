// Load HTML sections dynamically
async function loadSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const src = container.getAttribute('data-src');
  if (!src) return;

  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to load ${src}: ${response.status}`);
    }
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error(`Error loading section for ${containerId}:`, error);
  }
}

async function loadAllSections() {
  const containers = document.querySelectorAll('[data-src]');
  await Promise.all(Array.from(containers).map(c => loadSection(c.id)));
  initializeApp();
}

function initializeApp() {
  initializeNav();
  initializeSmoothScroll();
  initializeSectionAnimations();
  initializeGallery();
  initializeGlitchPieces();
}

function initializeNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
}

function initializeSmoothScroll() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function onAnchorClick(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (navLinks && navToggle) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  });
}

function initializeSectionAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document
    .querySelectorAll('.stat-card, .timeline-item, .event-card, .team-card, .contact-person-card')
    .forEach(el => observer.observe(el));
}

function initializeGallery() {
  const galleryContainer = document.getElementById('galleryContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('galleryIndicators');

  if (!galleryContainer || !prevBtn || !nextBtn || !indicatorsContainer) return;

  const originalSlides = Array.from(galleryContainer.querySelectorAll('.gallery-slide'));
  const totalSlides = originalSlides.length;
  if (totalSlides === 0) return;

  let currentIndex = 0;
  let autoScrollTimer = null;
  let isTransitioning = false;

  function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll('.gallery-indicator');
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
  }

  function updateGallery() {
    const isMobile = window.innerWidth <= 600;
    const offset = isMobile ? currentIndex * 100 : currentIndex * (100 / 3);
    galleryContainer.style.transform = `translateX(-${offset}%)`;

    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    slides.forEach((slide, i) => {
      const activeIndex = isMobile ? currentIndex : currentIndex + 1;
      slide.classList.toggle('active', i === activeIndex);
    });

    updateIndicators();
    isTransitioning = false;
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    updateGallery();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoScroll() {
    autoScrollTimer = setInterval(nextSlide, 3000);
  }

  function resetAutoScroll() {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    startAutoScroll();
  }

  indicatorsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('button');
    indicator.className = 'gallery-indicator';
    indicator.addEventListener('click', () => {
      goToSlide(i);
      resetAutoScroll();
    });
    indicatorsContainer.appendChild(indicator);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoScroll();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoScroll();
  });

  window.addEventListener('resize', updateGallery);

  galleryContainer.style.transition = 'transform 0.5s ease-in-out';
  updateGallery();
  startAutoScroll();
}

function initializeGlitchPieces() {
  const container = document.getElementById('heroGlitchPieces');
  if (!container) return;

  const pieces = ['♔', '♕', '♗', '♘', '♖', '♙', '♚', '♛', '♝', '♞', '♜', '♟'];
  const pieceLifetime = 1000;

  function spawnPiece() {
    const el = document.createElement('div');
    el.className = 'glitch-piece';

    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    el.textContent = piece;
    el.setAttribute('data-piece', piece);
    el.style.left = `${Math.random() * 80 + 5}%`;
    el.style.top = `${Math.random() * 70 + 10}%`;
    el.style.fontSize = `${10 + Math.random() * 10}rem`;

    const scanlines = document.createElement('span');
    scanlines.className = 'scanlines';
    el.appendChild(scanlines);

    container.appendChild(el);
    setTimeout(() => el.remove(), pieceLifetime);
  }

  function scheduleSpawn() {
    spawnPiece();
    const nextDelay = 5000 + Math.random() * 400;
    setTimeout(scheduleSpawn, nextDelay);
  }

  scheduleSpawn();
}

document.addEventListener('DOMContentLoaded', loadAllSections);
