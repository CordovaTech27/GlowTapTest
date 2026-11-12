/* Cart: services from one salon, booked together as one appointment.
   Stored as { salon, items: [serviceKey], slot?: { date, time, spec }, heldAt?, forceTaken? }. */
(function () {
  var KEY = 'gt-cart';
  // Demo hold: after this many ms sitting in the cart, the saved slot can be “taken” by someone else.
  var HOLD_MS = 15000;

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && typeof c.salon === 'string' && Array.isArray(c.items)) return c;
    } catch (e) { /* fall through */ }
    return { salon: '', items: [] };
  }

  function write(c) {
    if (!c.items.length) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(c));
  }

  function count(salon) {
    var c = read();
    return salon && c.salon !== salon ? 0 : c.items.length;
  }

  function has(salon, key) {
    var c = read();
    return c.salon === salon && c.items.indexOf(key) !== -1;
  }

  // Adding from another salon starts a new cart; `replaced` names the salon that was cleared.
  function add(salon, key) {
    var c = read();
    var replaced = c.items.length && c.salon !== salon ? c.salon : '';
    if (replaced) c = { salon: salon, items: [] };
    c.salon = salon;
    if (c.items.indexOf(key) === -1) c.items.push(key);
    write(c);
    return { replaced: replaced };
  }

  function remove(salon, key) {
    var c = read();
    if (c.salon !== salon) return;
    c.items = c.items.filter(function (k) { return k !== key; });
    write(c);
  }

  function clear() { localStorage.removeItem(KEY); }

  function iso(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function save(salon, keys, slot) {
    return sync(salon, keys, slot);
  }

  // Replace the cart with these services (one salon only). Empty keys clears the cart for that salon.
  function sync(salon, keys, slot) {
    var c = read();
    var replaced = c.items.length && c.salon !== salon ? c.salon : '';
    var prevSlot = (!replaced && c.salon === salon) ? c.slot : undefined;
    var prevHeld = (!replaced && c.salon === salon) ? c.heldAt : undefined;
    if (!keys || !keys.length) {
      if (!c.salon || c.salon === salon) clear();
      return { replaced: replaced };
    }
    var next = { salon: salon, items: keys.slice() };
    if (slot && slot.time) {
      var date = iso(window.GTCatalog.dayDate(slot.day));
      var same = prevSlot && prevSlot.date === date && prevSlot.time === slot.time && (prevSlot.spec || '') === (slot.spec || '');
      next.slot = { date: date, time: slot.time, spec: slot.spec || '' };
      next.heldAt = same && prevHeld ? prevHeld : Date.now();
    } else if (prevSlot) {
      next.slot = prevSlot;
      if (prevHeld) next.heldAt = prevHeld;
      if (c.forceTaken && !replaced) next.forceTaken = true;
    }
    write(next);
    return { replaced: replaced };
  }

  function clearSlot() {
    var c = read();
    if (!c.items.length) return;
    delete c.slot;
    delete c.heldAt;
    delete c.forceTaken;
    write(c);
  }

  // Saved appointment as a day index from today, or null if none / already passed.
  function slot() {
    var s = read().slot;
    if (!s || !s.date || !s.time) return null;
    var p = s.date.split('-');
    var t = new Date(); t.setHours(0, 0, 0, 0);
    var day = Math.round((new Date(+p[0], +p[1] - 1, +p[2]) - t) / 864e5);
    if (day < 0 || day >= 30) return null;
    var C = window.GTCatalog;
    var d = C.dayDate(day);
    var when = (day === 0 ? 'Today' : day === 1 ? 'Tomorrow' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]) + ', ' +
      d.getDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
    return { day: day, time: s.time, spec: s.spec || '', label: when + ' · ' + s.time };
  }

  // True when the held slot was taken by someone else while the cart sat open.
  function slotTaken() {
    var c = read();
    if (!c.slot || !c.slot.time) return false;
    if (c.forceTaken) return true;
    if (!c.heldAt) return false;
    return Date.now() - c.heldAt >= HOLD_MS;
  }

  function markTaken() {
    var c = read();
    if (!c.slot || !c.items.length) return;
    c.forceTaken = true;
    write(c);
  }

  // ms until the hold expires (0 if already taken / no slot).
  function holdRemaining() {
    var c = read();
    if (!c.slot || !c.heldAt || c.forceTaken) return 0;
    return Math.max(0, HOLD_MS - (Date.now() - c.heldAt));
  }

  // Cart always opens booking at Pick time (step 1). Slot is chosen inside book, not resumed from cart.
  function bookUrl(mode) {
    var c = read();
    var q = { salon: c.salon, service: c.items.join(','), cart: '1', step: '1' };
    if (mode === 'pay') q.pay = '1';
    return 'book.html?' + new URLSearchParams(q).toString();
  }

  function services() {
    var c = read();
    return c.items.map(function (k) { return window.GTCatalog.service(c.salon, k); }).filter(Boolean);
  }

  window.GTCart = {
    read: read, count: count, has: has, add: add, remove: remove, clear: clear,
    services: services, save: save, sync: sync, slot: slot, bookUrl: bookUrl,
    clearSlot: clearSlot, slotTaken: slotTaken, markTaken: markTaken, holdRemaining: holdRemaining, HOLD_MS: HOLD_MS
  };
})();
