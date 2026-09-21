const currencyMap = {
  USD: { symbol: '$', locale: 'en-US' },
  GHS: { symbol: 'GH¢', locale: 'en-GH' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' }
};

const getCurrencyFormatter = (currency) => {
  const config = currencyMap[currency] || currencyMap.USD;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  });
};

const applyCurrencyFormatting = (currency) => {
  document.querySelectorAll('[data-currency-value]').forEach((element) => {
    const rawValue = Number(element.dataset.currencyValue || 0);
    if (!Number.isFinite(rawValue)) return;
    element.textContent = getCurrencyFormatter(currency).format(rawValue);
  });

  document.querySelectorAll('[data-currency-price]').forEach((element) => {
    const rawValue = Number(element.dataset.currencyPrice || 0);
    if (!Number.isFinite(rawValue)) return;
    element.textContent = getCurrencyFormatter(currency).format(rawValue);
  });

  const totalPortfolio = document.querySelector('[data-total-portfolio]');
  if (totalPortfolio) {
    const raw = Number(totalPortfolio.dataset.totalPortfolio || 0);
    totalPortfolio.textContent = getCurrencyFormatter(currency).format(raw);
  }
};

const updateBinanceState = () => {
  document.querySelectorAll('.binance-status-dot').forEach((statusDot) => {
    const isActive = Math.random() > 0.25;
    const status = isActive ? 'online' : 'offline';
    statusDot.dataset.binanceStatus = status;
    statusDot.classList.toggle('offline', !isActive);

    const textEl = statusDot.parentElement.querySelector('.binance-status-text');
    if (textEl) textEl.textContent = isActive ? 'Binance Online' : 'Binance Offline';
  });
};

const applyTheme = (theme) => {
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }

  const toggleButton = document.querySelector('.theme-toggle-button');
  if (toggleButton) {
    const icon = toggleButton.querySelector('i');
    toggleButton.classList.toggle('dark', theme === 'dark');
    if (icon) {
      icon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  document.querySelectorAll('.theme-option').forEach((button) => {
    const isActive = button.dataset.theme === theme;
    button.classList.toggle('active', isActive);
  });

  localStorage.setItem('investiq-theme', theme);
};

const setupThemeButtons = () => {
  const themeToggle = document.querySelector('.theme-toggle-button');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  document.querySelectorAll('.theme-option').forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.theme));
  });
};

const setupUserMenu = () => {
  const userMenu = document.querySelector('.user-menu');
  if (!userMenu) return;

  const toggle = userMenu.querySelector('.user-menu-toggle');
  const panel = userMenu.querySelector('.user-menu-panel');

  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    userMenu.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (!userMenu.contains(event.target)) {
      userMenu.classList.remove('open');
    }
  });
};

const setupCurrencySelector = () => {
  const selector = document.querySelector('.currency-select');
  if (!selector) return;

  const savedCurrency = localStorage.getItem('investiq-currency') || 'USD';
  selector.value = savedCurrency;
  applyCurrencyFormatting(savedCurrency);

  selector.addEventListener('change', (event) => {
    const value = event.target.value;
    localStorage.setItem('investiq-currency', value);
    applyCurrencyFormatting(value);
  });
};

const setupMobileNav = () => {
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.mobile-nav-toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
};

// Positions the sliding pill behind whichever nav-link is active.
const setupNavIndicator = () => {
  const nav = document.querySelector('.main-nav');
  const indicator = document.querySelector('.nav-indicator');
  if (!nav || !indicator) return;

  const placeIndicator = (animate) => {
    const active = nav.querySelector('.nav-link.active');
    if (!active) {
      indicator.style.width = '0';
      return;
    }
    indicator.style.transition = animate ? '' : 'none';
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft - 4}px)`;
    if (!animate) {
      // force reflow so the next resize/theme change animates normally
      // eslint-disable-next-line no-unused-expressions
      indicator.offsetHeight;
      indicator.style.transition = '';
    }
  };

  placeIndicator(false);
  window.addEventListener('resize', () => placeIndicator(false));
};

document.addEventListener('DOMContentLoaded', () => {
  updateBinanceState();
  setupThemeButtons();
  setupUserMenu();
  setupCurrencySelector();
  setupMobileNav();
  setupNavIndicator();

  const savedTheme = localStorage.getItem('investiq-theme') || 'light';
  applyTheme(savedTheme);

  // re-place the indicator after the theme swap can change font metrics
  window.requestAnimationFrame(() => {
    const nav = document.querySelector('.main-nav');
    const indicator = document.querySelector('.nav-indicator');
    const active = nav && nav.querySelector('.nav-link.active');
    if (nav && indicator && active) {
      indicator.style.transition = 'none';
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.transform = `translateX(${active.offsetLeft - 4}px)`;
      indicator.offsetHeight;
      indicator.style.transition = '';
    }
  });
});
