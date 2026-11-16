// Default settings, shared by the content script and the popup.
globalThis.NO_SHORTS_DEFAULTS = Object.freeze({
  enabled: true,   // master switch
  hideFeed: true,  // hide Shorts shelves and Shorts videos in feeds, search, sidebars
  hideNav: true,   // hide the Shorts button, channel Shorts tab and "Shorts" filter chips
  redirect: true,  // open /shorts/ID links in the regular /watch?v=ID player
  hideGames: true, // hide YouTube Playables (built-in games): shelf, cards, sidebar entry
});
