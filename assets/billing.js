/* GlowTap — billing address sheet (Profile + booking Review). Stored in localStorage "gt-billing". */
(function () {
  var KEY = 'gt-billing';
  var DEFAULTS = {
    sel: 'a1',
    list: [
      { id: 'a1', label: 'Home', line1: 'Flat 302, Lakeview Residency', line2: '12th Main, HAL 2nd Stage, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pin: '560038' },
      { id: 'a2', label: 'Work', line1: '4th Floor, Prestige Tech Park', line2: 'Outer Ring Road, Marathahalli', city: 'Bengaluru', state: 'Karnataka', pin: '560103' }
    ]
  };
  var LABELS = ['Home', 'Work', 'Other'];

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d && Array.isArray(d.list) && d.list.length) return d;
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULTS));
  }
  function store(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function find(d, id) { return d.list.filter(function (a) { return a.id === id; })[0]; }
  function selected() { var d = load(); return find(d, d.sel) || d.list[0]; }
  function cityLine(a) { return a.city + ', ' + a.state + ' – ' + a.pin; }
  function lines(a) { return [a.line1, a.line2, cityLine(a)].filter(Boolean); }

  var css = '' +
    '.ba{position:absolute;inset:0;z-index:60;display:none;align-items:flex-end;background:rgba(16,8,24,.45);font-family:inherit}' +
    '.ba.is-open{display:flex}' +
    '.ba__panel{width:100%;max-height:88%;overflow-y:auto;background:#fff;border-radius:22px 22px 0 0;padding:14px 16px calc(var(--footer-above-dock, 80px) + 28px);box-sizing:border-box;box-shadow:0 -12px 40px rgba(0,0,0,.18);animation:baUp .28s ease;scrollbar-width:none}' +
    '.ba__panel::-webkit-scrollbar{display:none}' +
    '@keyframes baUp{from{transform:translateY(24px);opacity:.6}to{transform:none;opacity:1}}' +
    '.ba__handle{width:40px;height:4px;border-radius:99px;background:#E5EAF0;margin:0 auto 12px}' +
    '.ba__title{margin:0 0 4px;font-family:Outfit,sans-serif;font-size:1.1rem;font-weight:700;color:#1A2330}' +
    '.ba__sub{margin:0 0 14px;font-size:.8rem;color:#6B7A88;font-weight:500;line-height:1.4}' +
    '.ba [hidden]{display:none!important}' +
    '.ba-addr{display:flex;gap:10px;align-items:flex-start;width:100%;padding:12px;margin-bottom:8px;border-radius:14px;border:1.5px solid #E5EAF0;background:#fff;cursor:pointer;text-align:left;font-family:inherit;color:#1A2330}' +
    '.ba-addr.is-active{border-color:rgba(123,0,255,.45);box-shadow:0 0 0 3px rgba(123,0,255,.1)}' +
    '.ba-radio{width:18px;height:18px;margin-top:2px;border-radius:50%;border:2px solid #C9C2D6;flex-shrink:0;display:grid;place-items:center}' +
    '.ba-addr.is-active .ba-radio{border-color:#7B00FF}' +
    '.ba-addr.is-active .ba-radio::after{content:"";width:8px;height:8px;border-radius:50%;background:#7B00FF}' +
    '.ba-addr__body{flex:1;min-width:0}' +
    '.ba-addr__label{display:inline-block;font-size:.66rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em;padding:2px 8px;border-radius:99px;background:#F3EEFF;color:#5B21B6;margin-bottom:4px}' +
    '.ba-addr__line{display:block;font-size:.8rem;line-height:1.4;color:#334155}' +
    '.ba-addr__line:first-of-type{font-weight:700;color:#1A2330}' +
    '.ba-edit{flex-shrink:0;padding:6px 10px;border-radius:10px;border:1.5px solid #E5EAF0;background:#fff;font-family:inherit;font-size:.74rem;font-weight:700;color:#7B00FF;cursor:pointer}' +
    '.ba-add{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:46px;border-radius:14px;border:1.5px dashed #CDBBF0;background:#FAF7FF;font-family:inherit;font-weight:700;font-size:.85rem;color:#7B00FF;cursor:pointer}' +
    '.ba-field{margin-bottom:12px}' +
    '.ba-field label,.ba-lbl{display:block;margin:0 0 6px;font-size:.7rem;font-weight:700;color:#6B7A88;text-transform:uppercase;letter-spacing:.04em}' +
    '.ba-field label i{font-style:normal;text-transform:none;letter-spacing:0;font-weight:600;color:#A0AEC0}' +
    '.ba-field input{width:100%;height:46px;padding:0 14px;border-radius:12px;border:1.5px solid #E8E4EF;background:#fff;font-family:inherit;font-size:.88rem;font-weight:500;color:#1A2330;outline:none}' +
    '.ba-field input:focus{border-color:rgba(123,0,255,.45);box-shadow:0 0 0 3px rgba(123,0,255,.08)}' +
    '.ba-field.is-invalid input{border-color:#FCA5A5;background:#FEF2F2}' +
    '.ba-err{display:none;margin:4px 0 0;font-size:.72rem;font-weight:600;color:#B91C1C}' +
    '.ba-field.is-invalid .ba-err{display:block}' +
    '.ba-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.ba-chips{display:flex;gap:8px;margin-bottom:12px}' +
    '.ba-chips button{padding:8px 14px;border-radius:99px;border:1.5px solid #E5EAF0;background:#fff;font-family:inherit;font-size:.8rem;font-weight:700;color:#1A2330;cursor:pointer}' +
    '.ba-chips button[aria-checked="true"]{border-color:rgba(123,0,255,.5);background:#F3EEFF;color:#7B00FF}' +
    '.ba-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:10px;margin-top:14px}' +
    '.ba-btn{height:48px;border-radius:14px;border:none;font-family:inherit;font-weight:700;font-size:.9rem;cursor:pointer}' +
    '.ba-btn--ghost{background:#fff;border:1.5px solid #E5EAF0;color:#1A2330}' +
    '.ba-btn--primary{background:linear-gradient(100deg,#7B00FF 0%,#9B2FD9 48%,#FF03C8 100%);color:#fff;box-shadow:0 8px 20px rgba(123,0,255,.28)}';

  var root, opts = {}, editingId = null, draftSel = null;

  function build() {
    if (root) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    root = document.createElement('div');
    root.className = 'ba';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="ba__panel" role="dialog" aria-labelledby="ba-title">' +
        '<div class="ba__handle"></div>' +
        '<section data-ba="list">' +
          '<h2 class="ba__title" id="ba-title">Billing address</h2>' +
          '<p class="ba__sub" id="ba-sub">Shown on your invoices and payment receipts</p>' +
          '<div id="ba-list"></div>' +
          '<button type="button" class="ba-add" id="ba-add">+ Add new address</button>' +
          '<div class="ba-actions">' +
            '<button type="button" class="ba-btn ba-btn--ghost" data-ba-close>Cancel</button>' +
            '<button type="button" class="ba-btn ba-btn--primary" id="ba-use">Use this address</button>' +
          '</div>' +
        '</section>' +
        '<section data-ba="form" hidden>' +
          '<h2 class="ba__title" id="ba-form-title">Add billing address</h2>' +
          '<p class="ba__sub">Enter the address exactly as it should appear on the invoice</p>' +
          '<span class="ba-lbl" id="ba-label-lbl">Save as</span>' +
          '<div class="ba-chips" role="radiogroup" aria-labelledby="ba-label-lbl" id="ba-chips">' +
            LABELS.map(function (l) { return '<button type="button" role="radio" aria-checked="false" data-v="' + l + '">' + l + '</button>'; }).join('') +
          '</div>' +
          '<div class="ba-field"><label for="ba-line1">Address line 1</label><input id="ba-line1" placeholder="Flat / house no., building" autocomplete="address-line1" /><p class="ba-err">Enter address line 1</p></div>' +
          '<div class="ba-field"><label for="ba-line2">Address line 2 <i>(optional)</i></label><input id="ba-line2" placeholder="Street, area, landmark" autocomplete="address-line2" /></div>' +
          '<div class="ba-grid">' +
            '<div class="ba-field"><label for="ba-city">City</label><input id="ba-city" autocomplete="address-level2" /><p class="ba-err">Enter city</p></div>' +
            '<div class="ba-field"><label for="ba-pin">PIN code</label><input id="ba-pin" inputmode="numeric" maxlength="6" autocomplete="postal-code" /><p class="ba-err">6-digit PIN</p></div>' +
          '</div>' +
          '<div class="ba-field"><label for="ba-state">State</label><input id="ba-state" autocomplete="address-level1" /><p class="ba-err">Enter state</p></div>' +
          '<div class="ba-actions">' +
            '<button type="button" class="ba-btn ba-btn--ghost" id="ba-form-cancel">Cancel</button>' +
            '<button type="button" class="ba-btn ba-btn--primary" id="ba-save">Save address</button>' +
          '</div>' +
        '</section>' +
      '</div>';
    (document.querySelector('.phone') || document.body).appendChild(root);

    root.addEventListener('click', function (e) {
      if (e.target === root || e.target.closest('[data-ba-close]')) close();
    });
    $('ba-add').addEventListener('click', function () { showForm(null); });
    $('ba-use').addEventListener('click', function () {
      var d = load();
      d.sel = draftSel;
      store(d);
      var a = find(d, d.sel);
      close();
      if (opts.onChange) opts.onChange(a, 'select');
    });
    $('ba-form-cancel').addEventListener('click', function () {
      if (opts.formOnly) close(); else showList();
    });
    $('ba-save').addEventListener('click', save);
    root.querySelectorAll('#ba-chips button').forEach(function (b) {
      b.addEventListener('click', function () { setLabel(b.getAttribute('data-v')); });
    });
    ['ba-line1', 'ba-city', 'ba-state', 'ba-pin'].forEach(function (id) {
      $(id).addEventListener('input', function () {
        if (id === 'ba-pin') $(id).value = $(id).value.replace(/\D/g, '').slice(0, 6);
        $(id).closest('.ba-field').classList.remove('is-invalid');
      });
    });
  }
  function $(id) { return document.getElementById(id); }

  function section(name) {
    root.querySelectorAll('[data-ba]').forEach(function (s) { s.hidden = s.getAttribute('data-ba') !== name; });
    root.querySelector('.ba__panel').scrollTop = 0;
  }

  function renderList() {
    var d = load();
    $('ba-list').innerHTML = d.list.map(function (a) {
      return '<div class="ba-addr' + (a.id === draftSel ? ' is-active' : '') + '" role="radio" tabindex="0" aria-checked="' + (a.id === draftSel) + '" data-id="' + esc(a.id) + '">' +
        '<span class="ba-radio" aria-hidden="true"></span>' +
        '<span class="ba-addr__body"><span class="ba-addr__label">' + esc(a.label) + '</span>' +
          lines(a).map(function (l) { return '<span class="ba-addr__line">' + esc(l) + '</span>'; }).join('') +
        '</span>' +
        '<button type="button" class="ba-edit" data-edit="' + esc(a.id) + '">Edit</button>' +
      '</div>';
    }).join('');
    $('ba-list').querySelectorAll('.ba-addr').forEach(function (row) {
      row.addEventListener('click', function (e) {
        var ed = e.target.closest('[data-edit]');
        if (ed) { showForm(ed.getAttribute('data-edit')); return; }
        draftSel = row.getAttribute('data-id');
        renderList();
      });
    });
  }

  function showList() {
    renderList();
    section('list');
  }

  function setLabel(v) {
    root.querySelectorAll('#ba-chips button').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute('data-v') === v));
    });
  }

  function showForm(id) {
    var d = load();
    var a = id ? find(d, id) : null;
    editingId = a ? a.id : null;
    $('ba-form-title').textContent = a ? 'Edit billing address' : 'Add billing address';
    setLabel(a ? a.label : (d.list.some(function (x) { return x.label === 'Home'; }) ? 'Other' : 'Home'));
    $('ba-line1').value = a ? a.line1 : '';
    $('ba-line2').value = a ? a.line2 : '';
    $('ba-city').value = a ? a.city : 'Bengaluru';
    $('ba-state').value = a ? a.state : 'Karnataka';
    $('ba-pin').value = a ? a.pin : '';
    root.querySelectorAll('.ba-field').forEach(function (f) { f.classList.remove('is-invalid'); });
    section('form');
  }

  function save() {
    var v = {
      line1: $('ba-line1').value.trim(),
      line2: $('ba-line2').value.trim(),
      city: $('ba-city').value.trim(),
      state: $('ba-state').value.trim(),
      pin: $('ba-pin').value.trim()
    };
    var bad = false;
    function need(id, ok) { if (!ok) { $(id).closest('.ba-field').classList.add('is-invalid'); bad = true; } }
    need('ba-line1', v.line1.length >= 3);
    need('ba-city', v.city.length >= 2);
    need('ba-state', v.state.length >= 2);
    need('ba-pin', /^[1-9]\d{5}$/.test(v.pin));
    if (bad) return;
    var chk = root.querySelector('#ba-chips [aria-checked="true"]');
    v.label = chk ? chk.getAttribute('data-v') : 'Other';
    var d = load();
    var a;
    if (editingId) {
      a = find(d, editingId);
      Object.keys(v).forEach(function (k) { a[k] = v[k]; });
    } else {
      v.id = 'a' + Date.now();
      d.list.push(v);
      a = v;
    }
    d.sel = a.id;
    draftSel = a.id;
    store(d);
    if (opts.onChange) opts.onChange(a, editingId ? 'edit' : 'add');
    if (opts.formOnly) close(); else showList();
  }

  function open(o) {
    build();
    opts = o || {};
    draftSel = load().sel;
    $('ba-sub').textContent = opts.sub || 'Shown on your invoices and payment receipts';
    $('ba-use').textContent = opts.useLabel || 'Use this address';
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    if (opts.edit === 'new') showForm(null);
    else if (opts.edit) showForm(opts.edit);
    else showList();
  }

  function close() {
    if (!root) return;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
  }

  window.GTBilling = {
    selected: selected,
    lines: lines,
    open: open,
    close: close,
    isOpen: function () { return !!root && root.classList.contains('is-open'); }
  };
})();
