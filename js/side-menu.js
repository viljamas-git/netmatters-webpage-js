(function () {
  const website = document.querySelector('.mc-website');
  const sidebar = document.getElementById('mc-side-menu');
  const stickyHeader = document.querySelector('.mc-sticky-header');

  const menuButtons = [
    document.getElementById('mc-hamburger'),
    document.getElementById('mc-hamburger2')
  ].filter(Boolean);

  const menuBars = [
    document.getElementById('mc-hamburger-inner'),
    document.getElementById('mc-hamburger-inner2')
  ].filter(Boolean);

  if (!website || !sidebar || !menuButtons.length) {
    return;
  }

  // Track previous body styles so scroll locking can be safely reverted.
  const body = document.body;
  let isOpen = false;
  let previousOverflow = '';
  let previousPaddingRight = '';

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  // Used to trap keyboard focus inside the open menu.
  function getFocusableInSidebar() {
    return Array.from(sidebar.querySelectorAll(focusableSelector)).filter(function (el) {
      return !el.hasAttribute('hidden') && el.offsetParent !== null;
    });
  }

  // Keep interactive accessibility attributes aligned with menu state.
  function syncAria(expanded) {
    menuButtons.forEach(function (button) {
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-controls', 'mc-side-menu');
      button.setAttribute('aria-label', expanded ? 'Close main menu' : 'Open main menu');
    });

    sidebar.setAttribute('aria-hidden', String(!expanded));
  }

  // Prevent page scrolling behind the off-canvas navigation panel.
  function lockBodyScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;

    body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = scrollbarWidth + 'px';
    }
  }

  function unlockBodyScroll() {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  }

  // Apply all classes/attributes needed for the expanded navigation state.
  function openMenu() {
    isOpen = true;

    website.classList.add('mc-menu-is-active');
    body.classList.add('mc-menu-open');

    if (stickyHeader) {
      stickyHeader.classList.add('mc-stickyhead-menu-is-active');
    }

    menuBars.forEach(function (bar) {
      bar.classList.add('mc-close-menu');
    });

    lockBodyScroll();
    syncAria(true);

    const firstFocusable = getFocusableInSidebar()[0];
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  function closeMenu() {
    isOpen = false;

    website.classList.remove('mc-menu-is-active');
    body.classList.remove('mc-menu-open');

    if (stickyHeader) {
      stickyHeader.classList.remove('mc-stickyhead-menu-is-active');
    }

    menuBars.forEach(function (bar) {
      bar.classList.remove('mc-close-menu');
    });

    unlockBodyScroll();
    syncAria(false);
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  }

  menuButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });
  });

  website.addEventListener('click', function () {
    if (isOpen) {
      closeMenu();
    }
  });

  sidebar.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  // Support Escape-to-close and focus looping for keyboard users.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen) {
      closeMenu();
      return;
    }

    if (event.key === 'Tab' && isOpen) {
      const focusable = getFocusableInSidebar();
      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Keep side-menu submenu groups expanded by default to match academy behaviour.
  if (window.jQuery) {
    const $ = window.jQuery;
    const $mobileGroups = $('.mc-mobile-list-title');
    const $utilityGroups = $('.mc-side-menu-item').has('.mc-sub-menu');

    $mobileGroups.each(function () {
      const $group = $(this);
      const $header = $group.children('.mc-mobile-list-header');
      const $submenu = $group.children('.mc-mobile-sub-menu');

      $group.addClass('is-expanded');
      $header.attr({ 'aria-expanded': 'true', role: 'button' });
      $submenu.show();
    });

    $mobileGroups.children('.mc-mobile-list-header').on('click', function (event) {
      event.preventDefault();
    });

    $utilityGroups.each(function () {
      const $group = $(this);
      const $title = $group.children('.mc-side-menu-title');
      const $submenu = $group.children('.mc-sub-menu');

      $group.addClass('is-expanded');
      $title.attr('aria-expanded', 'true');
      $submenu.show();
    });

    $utilityGroups.children('.mc-side-menu-title').on('click', function (event) {
      if (window.matchMedia('(max-width: 991px)').matches) {
        return;
      }

      event.preventDefault();
    });
  }

  closeMenu();
})();
