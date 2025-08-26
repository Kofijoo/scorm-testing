(function(){
  // Shorthand DOM helpers
  window.$   = (sel, root=document) => root.querySelector(sel);
  window.$$  = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  window.on  = (el, evt, fn, opts) => el.addEventListener(evt, fn, opts);

  // Timing / math
  window.delay  = (ms) => new Promise(r => setTimeout(r, ms));
  window.clamp  = (n, min, max) => Math.max(min, Math.min(max, n));

  // Simple image preloader (optional)
  window.preloadImages = (sources=[]) =>
    Promise.all(sources.map(src => new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = () => resolve(src);
      img.src = src;
    })));
})();
