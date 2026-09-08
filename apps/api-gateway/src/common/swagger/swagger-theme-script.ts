export const SWAGGER_THEME_SCRIPT = `
(() => {
  const storageKey = 'study-tasks-swagger-theme';
  const toggleId = 'swagger-theme-toggle';

  const isTheme = (value) => value === 'light' || value === 'dark';

  const readStoredTheme = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return isTheme(value) ? value : null;
    } catch {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  };

  const updateToggle = (theme) => {
    const toggle = document.getElementById(toggleId);
    if (!toggle) {
      return;
    }

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    toggle.textContent = nextTheme === 'dark' ? 'Dark theme' : 'Light theme';
    toggle.setAttribute('aria-label', 'Switch to ' + nextTheme + ' theme');
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.title = 'Switch to ' + nextTheme + ' theme';
  };

  const applyTheme = (theme, persist) => {
    document.documentElement.dataset.swaggerTheme = theme;
    updateToggle(theme);

    if (persist) {
      storeTheme(theme);
    }
  };

  const mountToggle = () => {
    if (document.getElementById(toggleId)) {
      return;
    }

    const toggle = document.createElement('button');
    toggle.id = toggleId;
    toggle.type = 'button';
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.swaggerTheme;
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
    });

    document.body.appendChild(toggle);
  };

  const initialize = () => {
    const storedTheme = readStoredTheme();
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const theme = storedTheme || systemTheme;

    mountToggle();
    applyTheme(theme, false);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
`;
