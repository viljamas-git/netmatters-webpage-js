(function () {
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
    consentPanel.classList.toggle('mc-cookies-consent-hidden', !isOpen);
    consentPanel.setAttribute('aria-hidden', String(!isOpen));
    manageButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('mc-cookies-consent-open', isOpen);
  }

  function hideConsentPanel() {
    if (window.jQuery) {
      window.jQuery(consentPanel).stop(true, true).fadeOut(180, function () {
        updateConsentPanel(false);
      });
      return;
    }

    updateConsentPanel(false);
  }

  function showConsentPanel() {
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
