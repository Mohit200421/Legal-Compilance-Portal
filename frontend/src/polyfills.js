// Polyfill for simple-peer 'global' issue in browser
if (typeof global === "undefined") {
  window.global = window;
  window.Buffer = window.Buffer || {};
}
