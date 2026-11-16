const DEFAULTS = globalThis.NO_SHORTS_DEFAULTS;
const inputs = [...document.querySelectorAll('input[data-key]')];
const status = document.getElementById('status');

function render(settings) {
  for (const input of inputs) {
    input.checked = Boolean(settings[input.dataset.key]);
    if (input.dataset.key !== 'enabled') input.disabled = !settings.enabled;
  }
  document.body.classList.toggle('off', !settings.enabled);
  status.textContent = settings.enabled ? 'Active on YouTube' : 'Paused, nothing is hidden';
}

function current() {
  return Object.fromEntries(inputs.map((input) => [input.dataset.key, input.checked]));
}

chrome.storage.sync.get(DEFAULTS, render);

for (const input of inputs) {
  input.addEventListener('change', () => {
    chrome.storage.sync.set({ [input.dataset.key]: input.checked });
    render(current());
  });
}
