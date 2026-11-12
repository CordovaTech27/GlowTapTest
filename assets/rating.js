/* Rating colour bands: 0–0.9 red, 1–1.9 orange, 2–2.9 amber, 3–3.9 lime, 4–5 green. */
(function () {
  var BANDS = ['#DC2626', '#EA580C', '#F59E0B', '#65A30D', '#059669'];
  var SELECTOR = '.stars, .rate, .fav__stars, .review__top span';

  function value(text) {
    var t = text.trim();
    var m = t.match(/^★\s*(\d+(?:\.\d+)?)/);
    if (m) return parseFloat(m[1]);
    if (/^[★☆]+$/.test(t)) return (t.match(/★/g) || []).length;
    return null;
  }

  function paint(root) {
    root.querySelectorAll(SELECTOR).forEach(function (el) {
      var v = value(el.textContent);
      if (v === null) return;
      var band = Math.max(0, Math.min(4, Math.floor(v)));
      el.style.color = BANDS[band];
      el.setAttribute('data-band', band);
    });
  }

  paint(document);
  new MutationObserver(function () { paint(document); })
    .observe(document.body, { childList: true, subtree: true });
})();
