/* Favourite stylists — localStorage "gt-fav-specs" as ["salon|Name", ...]. */
(function () {
  var KEY = 'gt-fav-specs';
  var DEFAULTS = ['luxe|Priya S.', 'nord|Arjun K.'];
  var HEART = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 0 1 7.1-7.1l.4.4.4-.4a5 5 0 0 1 7.1 7.1Z"/></svg>';

  function id(salon, name) { return String(salon) + '|' + String(name); }

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (Array.isArray(d)) return d;
    } catch (e) {}
    return DEFAULTS.slice();
  }

  function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

  function has(salon, name) { return load().indexOf(id(salon, name)) !== -1; }

  function toggle(salon, name) {
    var list = load();
    var k = id(salon, name);
    var i = list.indexOf(k);
    if (i === -1) list.push(k); else list.splice(i, 1);
    save(list);
    return i === -1;
  }

  window.GTFavSpecs = { has: has, toggle: toggle, load: load, id: id, HEART: HEART };
})();
