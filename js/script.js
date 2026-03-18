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

  // Initialize
  updateGallery(false);
  startAutoScroll();

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
