(function () {
  // Store consent in localStorage so the panel stays hidden after acceptance.
  const storageKey = 'mcCookiesConsentAccepted';
  const cookieModule = document.getElementById('mc-cookiesConsent');

  if (!cookieModule) {
    return;
  }

  const consentPanel = document.getElementById('mc-cookie-consent');
  const manageButton = cookieModule.querySelector('.mc-cookies-button-manage');
  const acceptButton = cookieModule.querySelector('.mc-cookies-button-accept');
  const changeSettingsButton = cookieModule.querySelector('.mc-cookies-button-settings');

  if (!consentPanel || !manageButton || !acceptButton) {
    return;
  }

  function readConsentState() {
    return window.localStorage.getItem(storageKey) === 'true';
  }

  function writeConsentState() {
    window.localStorage.setItem(storageKey, 'true');
  }

  function updateConsentPanel(isOpen) {
    // Keep visibility classes, ARIA state, and body helper class in sync.
    consentPanel.classList.toggle('mc-cookies-consent-hidden', !isOpen);
    consentPanel.setAttribute('aria-hidden', String(!isOpen));
    manageButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('mc-cookies-consent-open', isOpen);
  }

  function hideConsentPanel() {
    // Use jQuery animation when available to match the rest of the site behaviour.
    if (window.jQuery) {
      window.jQuery(consentPanel).stop(true, true).fadeOut(180, function () {
        updateConsentPanel(false);
      });
      return;
    }

    updateConsentPanel(false);
  }

  function showConsentPanel() {
    // Re-open with a fade so opening and closing use consistent transitions.
    if (window.jQuery) {
      window.jQuery(consentPanel)
        .stop(true, true)
        .removeClass('mc-cookies-consent-hidden')
        .hide()
        .fadeIn(180, function () {
          updateConsentPanel(true);
        });
      return;
    }

    updateConsentPanel(true);
  }

  function acceptCookies(event) {
    if (event) {
      event.preventDefault();
    }

    // Persist acceptance before hiding the panel.
    writeConsentState();
    hideConsentPanel();
  }

  manageButton.addEventListener('click', function () {
    const isHidden = consentPanel.classList.contains('mc-cookies-consent-hidden') || consentPanel.style.display === 'none';

    if (isHidden) {
      showConsentPanel();
      return;
    }

    hideConsentPanel();
  });

  acceptButton.addEventListener('click', acceptCookies);

  if (changeSettingsButton) {
    changeSettingsButton.addEventListener('click', function (event) {
      event.preventDefault();
      hideConsentPanel();
    });
  }

  document.addEventListener('keydown', function (event) {
    // Escape is a universal close shortcut for overlays/panels.
    if (event.key === 'Escape' && !consentPanel.classList.contains('mc-cookies-consent-hidden')) {
      hideConsentPanel();
    }
  });

  if (readConsentState()) {
    updateConsentPanel(false);
  } else {
    updateConsentPanel(true);
  }
})();
