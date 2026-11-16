# No Shorts for YouTube

A small Chrome extension (Manifest V3) that removes YouTube Shorts and YouTube's built-in games (Playables).

## Updating from an earlier version

Replace the old `no-shorts` folder with the new one (same location), then click the reload icon on the extension's card in `chrome://extensions` and refresh any open YouTube tabs.

## What it does

- **Hides Shorts in feeds:** Shorts shelves and Shorts videos on Home, Subscriptions, Search, the watch-page sidebar, History and notifications.
- **Hides Shorts buttons:** the Shorts entry in the left sidebar and mini sidebar, the Shorts tab on channel pages, the "Shorts" search filter chip and the Shorts button in the m.youtube.com bottom bar.
- **Opens Shorts as normal videos:** any `youtube.com/shorts/ID` link (clicked, pasted or opened in a new tab) goes to `youtube.com/watch?v=ID` instead, with the regular player and seek bar.
- **Hides YouTube games (Playables):** the "YouTube Playables" shelf on Home, game cards in feeds, search and the watch sidebar, and the Playables link in the left sidebar. They're matched by their `/playables` links, so it works in any interface language. Regular gaming videos and the Gaming section are left alone.

Each part can be switched on or off from the toolbar popup, and there's a master switch to pause the extension. Changes apply instantly with no page reload.

## Install

1. Unzip `no-shorts.zip` to a folder you'll keep (Chrome loads the extension from that folder, so don't delete it).
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select the `no-shorts` folder (the one containing `manifest.json`).
5. Optional: click the puzzle-piece icon in the toolbar and pin **No Shorts** to reach the settings.

Works in other Chromium browsers too (Edge, Brave, Opera, Vivaldi) via their extensions page.

## Permissions

Only `storage`, to remember your settings. The extension runs only on `www.youtube.com` and `m.youtube.com`, makes no network requests and collects nothing.

## If Shorts reappear

YouTube changes its page structure from time to time. All hiding rules are in `content/hide.css`. Inspect the Shorts element that slipped through, add its tag name to the list there, then click the reload icon on the extension's card in `chrome://extensions`.

## Files

```
manifest.json        extension manifest
content/hide.css     the hiding rules
content/content.js   settings, Shorts → regular player redirect, label matching
shared/defaults.js   default settings
popup/               toolbar popup (settings)
icons/               toolbar and store icons
```
