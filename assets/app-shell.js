/* Shared shell: inject floating primary dock on every in-app screen. */
(function () {
  var SKIP = {
    'splash.html': 1,
    'login.html': 1,
    'signup.html': 1,
    'verify-otp.html': 1,
    'forgot-password.html': 1,
    'complete-profile.html': 1,
    'index.html': 1,
    'rating-colors.html': 1
  };

  var STATUS_ICONS =
    '<span class="status__right" aria-hidden="true">' +
    '<svg viewBox="0 0 17 12"><rect x="0" y="8" width="3" height="4" rx="0.6" fill="currentColor"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="0.6" fill="currentColor"/><rect x="9" y="3" width="3" height="9" rx="0.6" fill="currentColor"/><rect x="13.5" y="0" width="3" height="12" rx="0.6" fill="currentColor" opacity="0.35"/></svg>' +
    '<svg viewBox="0 0 16 12"><path fill="currentColor" d="M8 9.6a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7Zm0-3.55c1.5 0 2.88.55 3.95 1.47l-1.2 1.2A3.9 3.9 0 0 0 8 7.85c-.95 0-1.82.34-2.5.9L4.3 7.55A5.55 5.55 0 0 1 8 6.05Zm0-3.5c2.45 0 4.68.9 6.42 2.4L13.2 6.15A7.35 7.35 0 0 0 8 4.35c-2.1 0-4.02.78-5.5 2.06L1.3 5.2A9.55 9.55 0 0 1 8 2.55Z"/></svg>' +
    '<svg class="status-battery" viewBox="0 0 28 13"><rect x="0.75" y="0.75" width="23.5" height="11.5" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="2.4" y="2.5" width="18" height="8" rx="1.2" fill="currentColor"/><path fill="currentColor" d="M25.2 4.2h1.4c.7 0 1.2.5 1.2 1.15v2.3c0 .65-.5 1.15-1.2 1.15h-1.4V4.2Z"/></svg>' +
    '</span>';

  var file = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  var phone = document.querySelector('.phone');
  if (!phone) return;

  ensureStatus(phone);

  enableHorizontalScroll(phone);

  if (SKIP[file]) return;

  var SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var HOME_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2 4 10v10a1 1 0 0 0 1 1h5v-6h4v6h5a1 1 0 0 0 1-1V10l-8-6.8Z"/></svg>';
  var SVC_KEY = 'gt-dock-svc';
  var SVC_NAMES = {
    salon: 'Salon',
    spa: 'Spa',
    nail: 'Nail Art',
    makeup: 'Makeup',
    mens: 'Men’s',
    waxing: 'Waxing'
  };
  // Keep the service tab highlighted while browsing salons/cart from that service.
  var SVC_BROWSE = {
    'service.html': 1,
    'salon-detail.html': 1,
    'category.html': 1,
    'cart.html': 1,
    'search.html': 1,
    'location.html': 1
  };
  var CATEGORIES = [
    { id: 'home', name: 'Home', href: 'home.html', photo: '' },
    { id: 'salon', name: 'Salon', photo: 'assets/photos/salon-hair.jpg' },
    { id: 'spa', name: 'Spa', photo: 'assets/photos/salon-spa.jpg' },
    { id: 'nail', name: 'Nail Art', photo: 'assets/photos/salon-nails.jpg' },
    { id: 'makeup', name: 'Makeup', photo: 'assets/photos/salon-makeup.jpg' },
    { id: 'waxing', name: 'Waxing', photo: 'assets/photos/salon-facial.jpg' }
  ];

  function readSvc() {
    try {
      var raw = sessionStorage.getItem(SVC_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || !o.id || !SVC_NAMES[o.id]) return null;
      return { id: o.id, name: o.name || SVC_NAMES[o.id] };
    } catch (e) {
      return null;
    }
  }
  function writeSvc(id, name) {
    if (!id || !SVC_NAMES[id]) return;
    try {
      sessionStorage.setItem(SVC_KEY, JSON.stringify({ id: id, name: name || SVC_NAMES[id] }));
    } catch (e) {}
  }
  function clearSvc() {
    try { sessionStorage.removeItem(SVC_KEY); } catch (e) {}
  }

  // Home clears the sticky service. Category / service pages remember the current main.
  if (file === 'home.html') clearSvc();
  if (file === 'service.html') {
    var mainQ = new URLSearchParams(location.search).get('main') || 'salon';
    writeSvc(mainQ, SVC_NAMES[mainQ] || mainQ);
  }
  if (file === 'category.html') {
    var catQ = (new URLSearchParams(location.search).get('cat') || '').toLowerCase();
    if (SVC_NAMES[catQ]) {
      writeSvc(catQ, SVC_NAMES[catQ]);
      try { sessionStorage.setItem('gt-home-cat', catQ); } catch (e) {}
    }
  }

  var TABS = [
    {
      href: 'home.html',
      match: ['home.html'],
      label: 'Home',
      icon: HOME_ICON
    },
    {
      href: 'bookings.html',
      match: ['bookings.html', 'booking-detail.html', 'book.html', 'booking-confirm.html', 'rate.html'],
      label: 'Bookings',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3.5V7M16 3.5V7"/></svg>'
    },
    {
      href: 'notifications.html',
      match: ['notifications.html'],
      label: 'Alerts',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6.5 9a5.5 5.5 0 0 1 11 0c0 6.5 2.5 6.5 2.5 8.5H4c0-2 2.5-2 2.5-8.5"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
      dot: true
    },
    {
      href: 'profile.html',
      match: ['profile.html', 'edit-profile.html', 'settings.html', 'change-password.html', 'wallet.html', 'subscription.html', 'favorites.html', 'support.html', 'faq.html', 'contact.html', 'tickets.html', 'ticket-detail.html', 'new-ticket.html', 'privacy.html', 'terms.html'],
      label: 'Profile',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 19.5a7 7 0 0 1 14 0"/></svg>'
    }
  ];

  function activeHref() {
    for (var i = 0; i < TABS.length; i++) {
      if (TABS[i].match.indexOf(file) !== -1) return TABS[i].href;
    }
    return '';
  }

  function searchButton() {
    var on = file === 'search.html';
    return (
      '<a class="dock-search' + (on ? ' is-active' : '') + '" href="search.html" title="Search" aria-label="Search"' +
      (on ? ' aria-current="page"' : '') + '>' + SEARCH_ICON + '</a>'
    );
  }

  function homeTabHtml(on) {
    return (
      '<a class="tab' + (on ? ' is-active' : '') + '" href="home.html" title="Home" aria-label="Home"' +
      (on ? ' aria-current="page"' : '') + '>' + HOME_ICON + '</a>'
    );
  }

  function serviceTabHtml(svc, on) {
    return (
      '<a class="tab dock-svc' + (on ? ' is-active' : '') + '" href="service.html?main=' + encodeURIComponent(svc.id) +
      '" title="' + svc.name + '" aria-label="' + svc.name + '"' +
      (on ? ' aria-current="page"' : '') + '>' + HOME_ICON + '<span>' + svc.name + '</span></a>'
    );
  }

  function applyStickyService(dock) {
    var bar = dock.querySelector('.tabbar');
    if (!bar) return;
    var first = bar.children[0];
    if (!first) return;

    // service.html owns its dock-svc button (opens the switcher) — only sync the label.
    if (file === 'service.html') {
      var svcNow = readSvc();
      if (svcNow) {
        var nameEl = first.querySelector('#dock-name, span');
        if (nameEl) nameEl.textContent = svcNow.name;
        first.setAttribute('aria-label', svcNow.name);
        first.classList.add('is-active');
      }
      return;
    }

    var svc = readSvc();
    var primary = activeHref();
    var svcOn = !!svc && !primary && !!SVC_BROWSE[file];

    if (svc) {
      var next = serviceTabHtml(svc, svcOn);
      if (first.outerHTML !== next) first.outerHTML = next;
      else {
        first.classList.toggle('is-active', svcOn);
        if (svcOn) first.setAttribute('aria-current', 'page');
        else first.removeAttribute('aria-current');
      }
    } else if (first.classList.contains('dock-svc') || first.id === 'dock-svc') {
      first.outerHTML = homeTabHtml(primary === 'home.html');
    }
  }

  function ensureDock() {
    var dock = phone.querySelector('.dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.className = 'dock';
      var active = activeHref();
      var svc = readSvc();
      var first = svc && file !== 'home.html'
        ? serviceTabHtml(svc, !active && !!SVC_BROWSE[file])
        : homeTabHtml(active === 'home.html');
      dock.innerHTML = '<nav class="tabbar" aria-label="Primary">' + first + TABS.slice(1).map(function (t) {
        var on = t.href === active;
        return (
          '<a class="tab' + (on ? ' is-active' : '') + '" href="' + t.href + '" title="' + t.label + '" aria-label="' + t.label + '"' +
          (on ? ' aria-current="page"' : '') + '>' +
          (t.dot ? '<span class="dot" aria-hidden="true"></span>' : '') +
          t.icon +
          '</a>'
        );
      }).join('') + '</nav>' + searchButton();
      phone.appendChild(dock);
    } else {
      var bar = dock.querySelector('.tabbar');
      if (bar) {
        bar.querySelectorAll('a[href="search.html"]').forEach(function (link) { link.remove(); });
      }
      if (!dock.querySelector('.dock-search')) dock.insertAdjacentHTML('beforeend', searchButton());
      var active = activeHref();
      dock.querySelectorAll('.tab').forEach(function (tab) {
        if (tab.classList.contains('dock-svc') || tab.id === 'dock-svc') return;
        var href = (tab.getAttribute('href') || '').split('/').pop().split('?')[0];
        var on = href === active;
        tab.classList.toggle('is-active', on);
        if (on) tab.setAttribute('aria-current', 'page');
        else tab.removeAttribute('aria-current');
      });
      var search = dock.querySelector('.dock-search');
      if (search) search.classList.toggle('is-active', file === 'search.html');
      applyStickyService(dock);
    }
    phone.classList.add('has-dock');
    return dock;
  }

  var dock = ensureDock();
  phone.classList.remove('is-dock-hidden');

  function currentCatId() {
    if (file === 'category.html') {
      return (new URLSearchParams(location.search).get('cat') || readSvc() && readSvc().id || '').toLowerCase();
    }
    if (file === 'service.html') {
      return (new URLSearchParams(location.search).get('main') || '').toLowerCase();
    }
    var sticky = readSvc();
    return sticky ? sticky.id : (file === 'home.html' ? 'home' : '');
  }

  function ensureCatSheet() {
    var sheet = phone.querySelector('.cat-sheet');
    if (sheet) return sheet;
    sheet = document.createElement('div');
    sheet.className = 'cat-sheet';
    sheet.id = 'gt-cat-sheet';
    sheet.setAttribute('aria-hidden', 'true');
    sheet.innerHTML =
      '<div class="cat-sheet__panel" role="dialog" aria-label="Change category">' +
        '<div class="cat-sheet__handle" aria-hidden="true"></div>' +
        '<h2 class="cat-sheet__title">Change category</h2>' +
        '<div class="cat-sheet__grid" id="gt-cat-grid"></div>' +
      '</div>';
    phone.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) closeCatSheet();
    });
    return sheet;
  }

  function paintCatSheet() {
    var grid = document.getElementById('gt-cat-grid');
    if (!grid) return;
    var onId = currentCatId();
    grid.innerHTML = CATEGORIES.map(function (c) {
      var on = c.id === onId || (c.id === 'home' && !onId && file === 'home.html');
      var icon = c.photo
        ? '<img src="' + c.photo + '" alt="" />'
        : '<span class="cat-pick__icon">' + HOME_ICON + '</span>';
      return (
        '<button type="button" class="cat-pick' + (on ? ' is-on' : '') + '" data-cat="' + c.id + '">' +
        icon + '<span>' + c.name + '</span></button>'
      );
    }).join('');
    grid.querySelectorAll('.cat-pick').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-cat');
        closeCatSheet();
        if (id === 'home') {
          clearSvc();
          if (file !== 'home.html') location.href = 'home.html';
          return;
        }
        if (!SVC_NAMES[id]) return;
        writeSvc(id, SVC_NAMES[id]);
        try { sessionStorage.setItem('gt-home-cat', id); } catch (e) {}
        location.href = 'category.html?cat=' + encodeURIComponent(id);
      });
    });
  }

  function openCatSheet() {
    var sheet = ensureCatSheet();
    paintCatSheet();
    sheet.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { sheet.classList.add('is-on'); });
  }

  function closeCatSheet() {
    var sheet = phone.querySelector('.cat-sheet');
    if (!sheet) return;
    sheet.classList.remove('is-on');
    sheet.setAttribute('aria-hidden', 'true');
  }

  function isHomeNavTarget(el) {
    if (!el || !dock) return false;
    var tab = el.closest('.tab, .dock-svc, #dock-svc');
    if (!tab || !dock.contains(tab)) return false;
    if (tab.id === 'dock-svc' || tab.classList.contains('dock-svc')) return true;
    var href = (tab.getAttribute('href') || '').split('?')[0].split('/').pop();
    return href === 'home.html';
  }

  phone.addEventListener('click', function (e) {
    if (!isHomeNavTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    var sheet = phone.querySelector('.cat-sheet');
    if (sheet && sheet.classList.contains('is-on')) closeCatSheet();
    else openCatSheet();
  }, true);

  var body = phone.querySelector('.screen .body');
  if (body) {
    body.addEventListener('scroll', function () {
      phone.classList.toggle('is-scrolled', body.scrollTop > 6);
    }, { passive: true });
  }

  function ensureStatus(phone) {
    var status = phone.querySelector(':scope > .status');
    if (!status) {
      status = document.createElement('div');
      status.className = 'status';
      status.setAttribute('aria-hidden', 'true');
      phone.insertBefore(status, phone.firstChild);
    }
    var clock = status.querySelector('span');
    if (!clock) {
      status.innerHTML = '<span>9:41</span>' + STATUS_ICONS;
      return;
    }
    clock.textContent = '9:41';
    if (!status.querySelector('.status__right svg')) {
      var icons = status.querySelector('.status__right');
      if (icons) icons.outerHTML = STATUS_ICONS;
      else status.insertAdjacentHTML('beforeend', STATUS_ICONS);
    }
  }

  function enableHorizontalScroll(root) {
    var rails = root.querySelectorAll(
      '.promo__stage, .rail__track, .cats, .mains, .chips__main, .stylist-rail, .hscroll, .visit, .dates, .svc-tabs__row, .tabs, .rv-chips, .filters'
    );
    rails.forEach(function (el) {
      if (el.getAttribute('data-drag')) return;
      el.setAttribute('data-drag', '1');
      var startX = 0;
      var startY = 0;
      var startLeft = 0;
      var armed = false;
      var dragging = false;
      var moved = false;
      var THRESH = 10;

      el.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (el.scrollWidth <= el.clientWidth + 2) return;
        armed = true;
        dragging = false;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = el.scrollLeft;
      });
      el.addEventListener('pointermove', function (e) {
        if (!armed) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        if (!dragging) {
          if (Math.abs(dx) < THRESH && Math.abs(dy) < THRESH) return;
          // Vertical page scroll — do not capture the gesture.
          if (Math.abs(dy) >= Math.abs(dx)) {
            armed = false;
            return;
          }
          dragging = true;
          moved = true;
          el.classList.add('is-dragging');
          if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
        }
        el.scrollLeft = startLeft - (e.clientX - startX);
        if (e.cancelable) e.preventDefault();
      });
      function endDrag(e) {
        armed = false;
        dragging = false;
        el.classList.remove('is-dragging');
        if (e && el.releasePointerCapture && e.pointerId != null) {
          try { el.releasePointerCapture(e.pointerId); } catch (err) {}
        }
        // Keep `moved` through the following click, then clear.
        setTimeout(function () { moved = false; }, 0);
      }
      el.addEventListener('pointerup', endDrag);
      el.addEventListener('pointercancel', endDrag);
      el.addEventListener('click', function (e) {
        if (!moved) return;
        e.preventDefault();
        e.stopPropagation();
      }, true);
      // Only claim the wheel when the user is clearly scrolling sideways.
      el.addEventListener('wheel', function (e) {
        if (el.scrollWidth <= el.clientWidth + 2) return;
        var sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
        if (!sideways) return;
        var delta = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
        if (!delta) return;
        el.scrollLeft += delta;
        e.preventDefault();
      }, { passive: false });
    });
  }

  phone.querySelectorAll('.fold').forEach(function (fold) {
    var head = fold.querySelector('.fold__head');
    if (!head) return;
    head.setAttribute('aria-expanded', fold.classList.contains('is-open') ? 'true' : 'false');
    head.addEventListener('click', function () {
      var open = !fold.classList.contains('is-open');
      fold.classList.toggle('is-open', open);
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
