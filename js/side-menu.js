(function () {
  const website = document.querySelector('.mc-website');
  const sidebar = document.querySelector('.mc-sidebar');
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

  let isOpen = false;

  function syncAria(expanded) {
    menuButtons.forEach(function (button) {
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-controls', 'mc-side-menu');
    });
  }

  function openMenu() {
    isOpen = true;
    website.classList.add('mc-menu-is-active');
    document.body.classList.add('mc-menu-open');

    if (stickyHeader) {
      stickyHeader.classList.add('mc-stickyhead-menu-is-active');
    }

    menuBars.forEach(function (bar) {
      bar.classList.add('mc-close-menu');
    });

    syncAria(true);
  }

  function closeMenu() {
    isOpen = false;
    website.classList.remove('mc-menu-is-active');
    document.body.classList.remove('mc-menu-open');

    if (stickyHeader) {
      stickyHeader.classList.remove('mc-stickyhead-menu-is-active');
    }

    menuBars.forEach(function (bar) {
      bar.classList.remove('mc-close-menu');
    });

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

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });

  // jQuery accordion for mobile menu blocks.
  if (window.jQuery) {
    const $ = window.jQuery;
    const $mobileMenuGroups = $('.mc-mobile-list-title');

    $mobileMenuGroups.children('.mc-mobile-sub-menu').hide();

    $mobileMenuGroups.children('.mc-mobile-list-header').on('click', function (event) {
      event.preventDefault();

      const $group = $(this).closest('.mc-mobile-list-title');
      const $submenu = $group.children('.mc-mobile-sub-menu');

      $mobileMenuGroups.not($group).removeClass('is-expanded').children('.mc-mobile-sub-menu').stop(true, true).slideUp(180);

      $group.toggleClass('is-expanded');
      $submenu.stop(true, true).slideToggle(180);
    });
  } else {
    // Vanilla JS fallback for submenu expansion.
    const mobileHeaders = Array.from(document.querySelectorAll('.mc-mobile-list-header'));

    mobileHeaders.forEach(function (header) {
      const parent = header.closest('.mc-mobile-list-title');
      const submenu = parent ? parent.querySelector('.mc-mobile-sub-menu') : null;
      if (submenu) {
        submenu.style.display = 'none';
      }

      header.addEventListener('click', function (event) {
        event.preventDefault();

        mobileHeaders.forEach(function (otherHeader) {
          const otherParent = otherHeader.closest('.mc-mobile-list-title');
          const otherSubmenu = otherParent ? otherParent.querySelector('.mc-mobile-sub-menu') : null;

          if (otherParent && otherParent !== parent) {
            otherParent.classList.remove('is-expanded');
            if (otherSubmenu) {
              otherSubmenu.style.display = 'none';
            }
          }
        });

        if (!parent || !submenu) {
          return;
        }

        const isExpanded = parent.classList.toggle('is-expanded');
        submenu.style.display = isExpanded ? 'block' : 'none';
      });
    });
  }

  closeMenu();
})();
