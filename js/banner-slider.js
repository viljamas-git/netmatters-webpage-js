(function () {
  const banner = document.querySelector('.mc-banner');

  if (!banner) {
    return;
  }

  // Ensure keyboard users can focus the carousel region.
  banner.setAttribute('tabindex', '0');

  const slides = Array.from(banner.querySelectorAll('.mc-banner-slide'));

  if (slides.length <= 1) {
    return;
  }

  let currentIndex = Math.max(
    0,
    slides.findIndex((slide) => !slide.classList.contains('is-hidden-for-now'))
  );
  let autoplayTimer = null;

  // Build dot navigation dynamically so it always matches slide count.
  const controls = document.createElement('div');
  controls.className = 'mc-banner-controls';
  controls.setAttribute('aria-label', 'Banner slide controls');

  const dots = slides.map(function (_, index) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'mc-banner-dot';
    dot.dataset.slideIndex = String(index);
    dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
    controls.appendChild(dot);
    return dot;
  });

  banner.appendChild(controls);

  function renderSlides() {
    // Only one slide is visible at a time and dots mirror that state.
    slides.forEach(function (slide, index) {
      const isCurrent = index === currentIndex;
      slide.classList.toggle('is-hidden-for-now', !isCurrent);
      slide.setAttribute('aria-hidden', String(!isCurrent));
    });

    dots.forEach(function (dot, index) {
      const isCurrent = index === currentIndex;
      dot.classList.toggle('is-active', isCurrent);
      dot.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    renderSlides();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function resetAutoplay() {
    // Restart the timer after manual navigation to avoid abrupt auto-advance.
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(nextSlide, 5000);
  }

  // jQuery handles click delegation for dot controls.
  if (window.jQuery) {
    window.jQuery(controls).on('click', '.mc-banner-dot', function () {
      const dotIndex = Number(this.dataset.slideIndex);
      if (!Number.isNaN(dotIndex)) {
        goToSlide(dotIndex);
        resetAutoplay();
      }
    });
  } else {
    // Vanilla JS fallback when jQuery is unavailable.
    controls.addEventListener('click', function (event) {
      const dot = event.target.closest('.mc-banner-dot');
      if (!dot) {
        return;
      }
      const dotIndex = Number(dot.dataset.slideIndex);
      if (!Number.isNaN(dotIndex)) {
        goToSlide(dotIndex);
        resetAutoplay();
      }
    });
  }

  banner.addEventListener('mouseenter', function () {
    // Pause autoplay while the user hovers the banner.
    window.clearInterval(autoplayTimer);
  });

  banner.addEventListener('mouseleave', resetAutoplay);

  banner.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      nextSlide();
      resetAutoplay();
    }

    if (event.key === 'ArrowLeft') {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    }
  });

  renderSlides();
  resetAutoplay();
})();
