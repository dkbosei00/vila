export function asyncDocumentReady(callback) {
  if (document.readyState !== 'loading') {
    callback();
    return;
  }
  document.addEventListener('DOMContentLoaded', () => { callback(); })
}
