  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
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
    if(window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
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

  // Gallery Horizontal Auto-Scroll
  const galleryContainer = document.getElementById('galleryContainer');
  const slides = document.querySelectorAll('.gallery-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('galleryIndicators');
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
  galleryWrapper.addEventListener('mouseenter', () => clearInterval(autoScrollTimer));
  galleryWrapper.addEventListener('mouseleave', startAutoScroll);

  // Initialize
  updateGallery(false);
  startAutoScroll();