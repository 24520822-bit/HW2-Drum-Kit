export function bindKeyboard({ isBound, onHit }) {
  window.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!isBound(event.code)) return;
    onHit(event.code);
  });
}
