(function(){
  window.$ = (sel, root=document) => root.querySelector(sel);
  window.$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  window.on = (el, evt, fn, opts) => el.addEventListener(evt, fn, opts);
  window.delay = (ms) => new Promise(r => setTimeout(r, ms));
  window.clamp = (n, min, max) => Math.max(min, Math.min(max, n));
})();
