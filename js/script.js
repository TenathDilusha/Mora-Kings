// Load HTML sections dynamically
async function loadSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const src = container.getAttribute('data-src');
  if (!src) return;
  
  try {
    const response = await fetch(src);
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error(`Error loading section for ${containerId}:`, error);
  }
}

// Load all sections from containers with data-src attribute
async function loadAllSections() {
  const containers = document.querySelectorAll('[data-src]');
  
  // Load all sections
  await Promise.all(
    Array.from(containers).map(container => loadSection(container.id))
  );

  // Initialize after all sections are loaded
  initializeApp();
  
  // Initialize enhanced features
  initializeCountdown();
  initializeHeroStats();
}

// Countdown Timer for Events
function initializeCountdown() {
  const countdownTimer = document.querySelector('.countdown-timer');
  if (!countdownTimer) return;

  const targetDate = new Date('2026-04-03T00:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('countdown-days').textContent = '00';
      document.getElementById('countdown-hours').textContent = '00';
      document.getElementById('countdown-minutes').textContent = '00';
      document.getElementById('countdown-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Animated Number Counter for Hero Stats
function initializeHeroStats() {
  const statValues = document.querySelectorAll('.hero-stat .stat-value');
  if (!statValues.length) return;

  const animateValue = (element, start, end, duration) => {
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  };

  // Use Intersection Observer to trigger animation when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.dataset.target) || 0;
        animateValue(element, 0, target, 2000);
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(stat => observer.observe(stat));
}

// Initialize all interactive features after sections are loaded
function initializeApp() {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks) {
          navLinks.classList.remove('active');
          navToggle.classList.remove('active');
        }
      }
    });
  });

  // Active Nav Link on Scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if(scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove('active');
      if(item.getAttribute('href') === '#' + current) {
        item.classList.add('active');
      }
    });

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    if(navbar) {
      if(window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stat-card, .timeline-item, .event-card, .team-card').forEach(el => {
    observer.observe(el);
  });

  // Initialize Gallery
  initializeGallery();

  // Initialize Hacker-style glitch pieces
  initializeGlitchPieces();
}

// Gallery Horizontal Auto-Scroll
function initializeGallery() {
  const galleryContainer = document.getElementById('galleryContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('galleryIndicators');
  
  if (!galleryContainer || !prevBtn || !nextBtn || !indicatorsContainer) {
    return; // Gallery not found, skip initialization
  }

  const slides = document.querySelectorAll('.gallery-slide');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoScrollTimer;
  let isTransitioning = false;

  // Clone first 3 slides and append to end
  for (let i = 0; i < 3; i++) {
    const clone = slides[i].cloneNode(true);
    clone.classList.add('clone');
    galleryContainer.appendChild(clone);
  }

  // Clone last 3 slides and prepend to beginning
  for (let i = totalSlides - 1; i >= totalSlides - 3; i--) {
    const clone = slides[i].cloneNode(true);
    clone.classList.add('clone');
    galleryContainer.insertBefore(clone, galleryContainer.firstChild);
  }

  // Start at the first real slide (after prepended clones)
  currentIndex = 3;

  // Create indicators (only for real slides)
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('button');
    indicator.classList.add('gallery-indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => {
      goToSlide(i + 3); // +3 to account for prepended clones
      resetAutoScroll();
    });
    indicatorsContainer.appendChild(indicator);
  }

  const indicators = document.querySelectorAll('.gallery-indicator');

  function updateGallery(transition = true) {
    const slideWidth = 100 / 3;
    const offset = currentIndex * slideWidth;
    
    if (transition) {
      galleryContainer.style.transition = 'transform 0.5s ease-in-out';
    } else {
      galleryContainer.style.transition = 'none';
    }
    
    galleryContainer.style.transform = `translateX(-${offset}%)`;

    // Update active class for center slide
    const allSlides = galleryContainer.children;
    Array.from(allSlides).forEach((slide, i) => {
      // The middle visible slide is at currentIndex + 1
      slide.classList.toggle('active', i === currentIndex + 1);
    });

    // Update indicators (map to real slides)
    const realIndex = (currentIndex - 3 + totalSlides) % totalSlides;
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === realIndex);
    });
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    updateGallery(true);

    setTimeout(() => {
      // Check if we're on a clone and need to jump to real slide
      const allSlides = galleryContainer.children.length;
      
      if (currentIndex >= allSlides - 3) {
        // At the end clones, jump to beginning real slides
        currentIndex = 3;
        updateGallery(false);
      } else if (currentIndex < 3) {
        // At the beginning clones, jump to end real slides
        currentIndex = allSlides - 6;
        updateGallery(false);
      }
      
      isTransitioning = false;
    }, 500);
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
    clearInterval(autoScrollTimer);
    startAutoScroll();
  }

  // Event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoScroll();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoScroll();
  });

  // Pause on hover
  const galleryWrapper = document.querySelector('.gallery-wrapper');
  if (galleryWrapper) {
    galleryWrapper.addEventListener('mouseenter', () => clearInterval(autoScrollTimer));
    galleryWrapper.addEventListener('mouseleave', startAutoScroll);
  }

  // Initialize
  updateGallery(false);
  startAutoScroll();
}

// Hacker-style glitch chess pieces spawner
function initializeGlitchPieces() {
  const container = document.getElementById('heroGlitchPieces');
  if (!container) return;

  const pieces = ['♔', '♕', '♗', '♘', '♖', '♙', '♚', '♛', '♝', '♞', '♜', '♟'];
  const PIECE_LIFETIME = 1000; // 1 second appearance

  function spawnPiece() {
    const el = document.createElement('div');
    el.className = 'glitch-piece';

    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    el.textContent = piece;
    el.setAttribute('data-piece', piece);

    // Random position
    el.style.left = Math.random() * 80 + 5 + '%';
    el.style.top = Math.random() * 70 + 10 + '%';

    // Random size (very big, faded pieces)
    const size = 10 + Math.random() * 10; // 10rem to 20rem
    el.style.fontSize = size + 'rem';

    // Add scanline overlay
    const scanlines = document.createElement('span');
    scanlines.className = 'scanlines';
    el.appendChild(scanlines);

    container.appendChild(el);

    // Remove after animation completes
    setTimeout(() => {
      el.remove();
    }, PIECE_LIFETIME);
  }

  // Spawn one piece every ~3 seconds
  function scheduleSpawn() {
    spawnPiece();
    const nextDelay = 5000 + Math.random() * 400; // ~5s gap
    setTimeout(scheduleSpawn, nextDelay);
  }

  // Start spawning
  scheduleSpawn();
}

// Load all sections when DOM is ready
document.addEventListener('DOMContentLoaded', loadAllSections);
