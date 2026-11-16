// No Shorts for YouTube: content script.
//
// The CSS file does the actual hiding. This script:
//   1. loads the settings and reflects them as attributes on <html>,
//   2. sends /shorts/ID pages to the regular /watch?v=ID player,
//   3. tags label-only elements (e.g. the "Shorts" search filter chip) so the
//      CSS can hide them.

(() => {
  'use strict';

  const DEFAULTS = globalThis.NO_SHORTS_DEFAULTS;
  let settings = { ...DEFAULTS };
  let loaded = false;

  const isOn = (key) => Boolean(settings.enabled && settings[key]);

  // ---------------------------------------------------------------------
  // 1. Settings → <html> attributes (read by hide.css)
  // ---------------------------------------------------------------------
  function applyAttributes() {
    const html = document.documentElement;
    if (!html) return;
    html.setAttribute('data-noshorts-feed', isOn('hideFeed') ? 'on' : 'off');
    html.setAttribute('data-noshorts-nav', isOn('hideNav') ? 'on' : 'off');
    html.setAttribute('data-noshorts-games', isOn('hideGames') ? 'on' : 'off');
  }

  // ---------------------------------------------------------------------
  // 2. Redirect Shorts to the regular player
  // ---------------------------------------------------------------------
  const SHORTS_PATH = /^\/shorts\/([A-Za-z0-9_-]+)/;
  let redirecting = false;

  function watchUrlFor(href) {
    let url;
    try {
      url = new URL(href, location.href);
    } catch {
      return null;
    }
    if (!/(^|\.)youtube\.com$/.test(url.hostname)) return null;
    const match = url.pathname.match(SHORTS_PATH);
    return match ? `${url.origin}/watch?v=${match[1]}` : null;
  }

  function checkLocation() {
    if (!loaded || redirecting || !isOn('redirect')) return;
    const target = watchUrlFor(location.href);
    if (target) {
      redirecting = true;
      location.replace(target);
    }
  }

  // Catch clicks on Shorts links before YouTube's in-page router does, so the
  // Shorts player never starts. Modified clicks (new tab etc.) are left alone;
  // the new tab gets redirected when it loads.
  function onClick(event) {
    if (!isOn('redirect')) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event
      .composedPath()
      .find((node) => node instanceof HTMLAnchorElement && node.href);
    if (!anchor) return;
    const target = watchUrlFor(anchor.href);
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.assign(target);
  }

  window.addEventListener('click', onClick, true);

  // YouTube is a single-page app: catch in-page navigations to a Short too.
  for (const type of ['yt-navigate-start', 'yt-navigate-finish', 'state-navigateend']) {
    document.addEventListener(type, checkLocation, true);
  }
  window.addEventListener('popstate', checkLocation);
  if (window.navigation) {
    window.navigation.addEventListener('currententrychange', checkLocation);
  } else {
    // Older browsers: cheap polling fallback.
    let lastHref = location.href;
    setInterval(() => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        checkLocation();
      }
    }, 500);
  }

  // ---------------------------------------------------------------------
  // 3. Tag elements that can only be recognised by their "Shorts" label
  // ---------------------------------------------------------------------
  const LABELLED_TARGETS = [
    'yt-chip-cloud-chip-renderer',
    'ytm-chip-cloud-chip-renderer',
    'chip-view-model',
    'yt-chip-view-model',
    'yt-tab-shape',
    'tp-yt-paper-tab',
    'ytm-pivot-bar-item-renderer',
  ].join(',');
  const MARK = 'data-noshorts-nav-hide';

  function isShortsLabel(el) {
    const label =
      el.getAttribute('tab-title') ||
      el.getAttribute('aria-label') ||
      el.textContent ||
      '';
    return label.trim().toLowerCase() === 'shorts';
  }

  function scanLabels() {
    for (const el of document.querySelectorAll(LABELLED_TARGETS)) {
      // YouTube recycles elements, so re-check (and un-tag) every time.
      const match = isShortsLabel(el);
      if (match !== el.hasAttribute(MARK)) el.toggleAttribute(MARK, match);
    }
  }

  let scanQueued = false;
  function queueScan() {
    if (scanQueued || !isOn('hideNav')) return;
    scanQueued = true;
    setTimeout(() => {
      scanQueued = false;
      scanLabels();
    }, 150);
  }

  new MutationObserver(queueScan).observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // ---------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------
  function onSettingsChanged() {
    applyAttributes();
    checkLocation();
    queueScan();
  }

  chrome.storage.sync.get(DEFAULTS, (stored) => {
    settings = { ...DEFAULTS, ...stored };
    loaded = true;
    onSettingsChanged();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key in DEFAULTS) settings[key] = newValue ?? DEFAULTS[key];
    }
    onSettingsChanged();
  });
})();
