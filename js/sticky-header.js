(function () {
  const stickyHeader = document.querySelector('.mc-sticky-header');
  const mainHead = document.querySelector('.mc-head');

  if (!stickyHeader) {
    return;
  }

  let lastScrollY = window.scrollY;
  let ticking = false;

  function showStickyHeader() {
    if (window.jQuery) {
      window.jQuery(stickyHeader)
        .removeClass('mc-is-hidden mc-hidden-header mc-no-transition')
        .addClass('mc-visible-header')
        .attr('aria-hidden', 'false');
      return;
    }

    stickyHeader.classList.remove('mc-is-hidden', 'mc-hidden-header', 'mc-no-transition');
    stickyHeader.classList.add('mc-visible-header');
    stickyHeader.setAttribute('aria-hidden', 'false');
  }

  function hideStickyHeader() {
    if (window.jQuery) {
      window.jQuery(stickyHeader)
        .removeClass('mc-visible-header mc-no-transition')
        .addClass('mc-hidden-header')
        .attr('aria-hidden', 'true');
      return;
    }

    stickyHeader.classList.remove('mc-visible-header', 'mc-no-transition');
    stickyHeader.classList.add('mc-hidden-header');
    stickyHeader.setAttribute('aria-hidden', 'true');
  }

  function updateStickyHeader() {
    const currentScrollY = window.scrollY;
    const isScrollingUp = currentScrollY < lastScrollY;

    if (currentScrollY <= 0 || isScrollingUp) {
      showStickyHeader();
    } else {
      hideStickyHeader();
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function requestStickyUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyHeader);
      ticking = true;
    }
  }

  if (mainHead) {
    mainHead.setAttribute('aria-hidden', 'true');
  }

  showStickyHeader();
  requestStickyUpdate();

  window.addEventListener('scroll', requestStickyUpdate, { passive: true });

  window.addEventListener('resize', requestStickyUpdate);
})();
