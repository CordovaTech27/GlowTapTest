/* GlowTap — add money to wallet (Home wallet pill + My wallet). Balance in localStorage "gt-wallet".
   Demo outcomes: RazorPay (Success) / RazorPay (Failure). */
(function () {
  var KEY = 'gt-wallet', MIN = 100, MAX = 10000, WAIT_MS = 2400;

  function balance() { return Number(localStorage.getItem(KEY) || 500); }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
  function $(id) { return document.getElementById(id); }

  var ICON = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m15 6-6 6 6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 6 6 6-6 6"/></svg>',
    razor: '<img src="assets/razorpay.png" alt="" />',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m5 12 5 5L20 7"/></svg>',
    err: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M7 7l10 10M17 7 7 17"/></svg>'
  };

  var css = '' +
    '.tu{position:absolute;inset:0;z-index:60;display:none;align-items:flex-end;background:rgba(16,8,24,.38);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font-family:inherit;color:#1A2330}' +
    '.tu.is-open{display:flex}' +
    '.tu [hidden]{display:none!important}' +
    '.tu__panel{width:100%;max-height:92%;overflow-y:auto;background:#fff;border-radius:22px 22px 0 0;padding:14px 16px calc(var(--footer-above-dock, 80px) + 28px);box-sizing:border-box;box-shadow:0 -12px 40px rgba(0,0,0,.18);animation:tuUp .28s ease;scrollbar-width:none}' +
    '.tu__panel::-webkit-scrollbar{display:none}' +
    '@keyframes tuUp{from{transform:translateY(24px);opacity:.6}to{transform:none;opacity:1}}' +
    '.tu__handle{width:40px;height:4px;border-radius:99px;background:#E5EAF0;margin:0 auto 12px}' +
    '.tu-title{margin:0;font-family:Outfit,sans-serif;font-size:1.1rem;font-weight:700}' +
    '.tu-sub{margin:4px 0 14px;font-size:.8rem;color:#6B7A88;font-weight:500;line-height:1.4}' +
    '.tu-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}' +
    '.tu-head .tu-title{flex:1;min-width:0}' +
    '.tu-back{width:36px;height:36px;border-radius:50%;border:1.5px solid #E5EAF0;background:#fff;display:grid;place-items:center;color:#1A2330;cursor:pointer;flex-shrink:0;padding:0}' +
    '.tu-back svg{width:17px;height:17px}' +
    '.tu-amt-pill{padding:6px 10px;border-radius:99px;background:#F3EEFF;color:#7B00FF;font-family:Outfit,sans-serif;font-weight:700;font-size:.86rem;white-space:nowrap}' +
    '.tu-bal{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;margin-bottom:14px;border-radius:16px;background:linear-gradient(100deg,#7B00FF 0%,#9B2FD9 48%,#FF03C8 100%);color:#fff}' +
    '.tu-bal small{display:block;font-size:.66rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.85}' +
    '.tu-bal strong{font-family:Outfit,sans-serif;font-size:1.4rem}' +
    '.tu-bal a{color:#fff;font-size:.78rem;font-weight:700;text-decoration:underline}' +
    '.tu-amt{display:flex;align-items:center;gap:6px;height:54px;padding:0 14px;margin:10px 0;border-radius:14px;border:1.5px solid rgba(123,0,255,.35);box-shadow:0 0 0 3px rgba(123,0,255,.08)}' +
    '.tu-amt span{font-family:Outfit,sans-serif;font-size:1.4rem;font-weight:700;color:#6B7A88}' +
    '.tu-amt input{flex:1;min-width:0;border:none;outline:none;background:transparent;font-family:Outfit,sans-serif;font-size:1.4rem;font-weight:700;color:#1A2330}' +
    '.tu-chips{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:6px}' +
    '.tu-chips button{height:38px;border-radius:12px;border:1.5px solid #E5EAF0;background:#fff;cursor:pointer;font-family:inherit;font-size:.82rem;font-weight:700;color:#1A2330}' +
    '.tu-chips button.is-on{border-color:rgba(123,0,255,.45);background:#F3EEFF;color:#7B00FF}' +
    '.tu-limits{margin:0 0 4px;font-size:.72rem;font-weight:600;color:#6B7A88}' +
    '.tu-limits.is-error{color:#B91C1C}' +
    '.tu-lbl{display:block;margin:14px 0 8px;font-size:.7rem;font-weight:700;color:#6B7A88;text-transform:uppercase;letter-spacing:.06em}' +
    '.tu-method{display:flex;align-items:center;gap:12px;width:100%;padding:12px;margin-bottom:8px;border-radius:14px;border:1.5px solid #E5EAF0;background:#fff;cursor:pointer;text-align:left;font-family:inherit;color:#1A2330}' +
    '.tu-method__icon{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;flex-shrink:0;background:#EEF3FF;overflow:hidden}' +
    '.tu-method__icon svg{width:22px;height:22px;display:block}' +
    '.tu-method__icon--rzp{background:#fff;border:1px solid #E5EAF0;padding:5px}' +
    '.tu-method__icon--rzp img{width:100%;height:100%;object-fit:contain;display:block}' +
    '.tu-method__text{flex:1;min-width:0}' +
    '.tu-method__name{display:block;font-weight:700;font-size:.9rem}' +
    '.tu-method__meta{display:block;font-size:.72rem;color:#6B7A88;margin-top:2px}' +
    '.tu-method__chev{width:18px;height:18px;color:#A0AEC0;flex-shrink:0}' +
    '.tu-secure{display:flex;align-items:center;justify-content:center;gap:6px;margin:14px 0 2px;font-size:.72rem;font-weight:600;color:#6B7A88}' +
    '.tu-secure svg{width:14px;height:14px;color:#059669}' +
    '.tu-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:10px;margin-top:14px}' +
    '.tu-actions--one{grid-template-columns:1fr}' +
    '.tu-btn{display:grid;place-items:center;height:48px;border-radius:14px;border:none;cursor:pointer;font-family:inherit;font-size:.9rem;font-weight:700;text-decoration:none}' +
    '.tu-btn--ghost{background:#fff;border:1.5px solid #E5EAF0;color:#1A2330}' +
    '.tu-btn--primary{background:linear-gradient(100deg,#7B00FF 0%,#9B2FD9 48%,#FF03C8 100%);color:#fff;box-shadow:0 8px 20px rgba(123,0,255,.28)}' +
    '.tu-btn--primary:disabled{opacity:.45;box-shadow:none;cursor:default}' +
    '.tu-wait{text-align:center;padding:22px 6px 10px}' +
    '.tu-spin{width:54px;height:54px;margin:0 auto 16px;border-radius:50%;border:4px solid #EDE4FF;border-top-color:#7B00FF;animation:tuSpin .9s linear infinite}' +
    '@keyframes tuSpin{to{transform:rotate(360deg)}}' +
    '.tu-wait .tu-sub{margin-bottom:6px}' +
    '.tu-result{text-align:center;padding-top:6px}' +
    '.tu-result__icon{width:64px;height:64px;margin:0 auto 12px;border-radius:50%;display:grid;place-items:center;color:#fff}' +
    '.tu-result__icon svg{width:30px;height:30px}' +
    '.tu-result__icon.is-ok{background:#059669;box-shadow:0 10px 24px rgba(5,150,105,.3)}' +
    '.tu-result__icon.is-err{background:#DC2626;box-shadow:0 10px 24px rgba(220,38,38,.28)}' +
    '.tu-receipt{margin:14px 0 0;padding:4px 14px;border-radius:14px;background:#F8FAFC;text-align:left}' +
    '.tu-receipt div{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #EEF2F6;font-size:.78rem;color:#6B7A88}' +
    '.tu-receipt div:last-child{border-bottom:0}' +
    '.tu-receipt b{color:#1A2330;text-align:right}' +
    '.tu-note{margin:10px 0 0;font-size:.74rem;color:#6B7A88;line-height:1.45}' +
    '.tu-reason{margin:12px 0 0;padding:10px 12px;border-radius:12px;background:#FEF2F2;color:#991B1B;font-size:.78rem;font-weight:600;text-align:left;line-height:1.4}';

  function head(title, backTo) {
    return '<div class="tu-head">' +
      '<button type="button" class="tu-back" data-tu-back="' + backTo + '" aria-label="Back">' + ICON.back + '</button>' +
      '<h2 class="tu-title">' + title + '</h2>' +
      '<span class="tu-amt-pill" data-tu-amt>₹500</span>' +
    '</div>';
  }

  var root, opts = {}, amt = 500, payOk = true, timers = [];

  function build() {
    if (root) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    root = document.createElement('div');
    root.className = 'tu';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="tu__panel" role="dialog" aria-labelledby="tu-title">' +
        '<div class="tu__handle"></div>' +

        '<section data-tu="amount">' +
          '<div class="tu-bal"><div><small>GlowTap wallet</small><strong id="tu-bal">₹500</strong></div><a href="wallet.html" id="tu-history">History</a></div>' +
          '<h2 class="tu-title" id="tu-title">Add money</h2>' +
          '<label class="tu-amt"><span>₹</span><input type="text" inputmode="numeric" id="tu-amount" value="500" aria-label="Amount" /></label>' +
          '<div class="tu-chips" id="tu-chips">' +
            [200, 500, 1000, 2000].map(function (v) { return '<button type="button" data-v="' + v + '">' + inr(v) + '</button>'; }).join('') +
          '</div>' +
          '<p class="tu-limits" id="tu-limits">Min ₹100 · Max ₹10,000 per top-up</p>' +
          '<div class="tu-actions">' +
            '<button type="button" class="tu-btn tu-btn--ghost" data-tu-close>Cancel</button>' +
            '<button type="button" class="tu-btn tu-btn--primary" id="tu-next">Proceed to pay</button>' +
          '</div>' +
        '</section>' +

        '<section data-tu="method" hidden>' +
          head('Choose payment method', 'amount') +
          '<button type="button" class="tu-method" id="tu-pick-ok">' +
            '<span class="tu-method__icon tu-method__icon--rzp" aria-hidden="true">' + ICON.razor + '</span>' +
            '<span class="tu-method__text"><span class="tu-method__name">RazorPay (Success)</span></span>' +
            '<span class="tu-method__chev">' + ICON.chev + '</span>' +
          '</button>' +
          '<button type="button" class="tu-method" id="tu-pick-fail">' +
            '<span class="tu-method__icon tu-method__icon--rzp" aria-hidden="true">' + ICON.razor + '</span>' +
            '<span class="tu-method__text"><span class="tu-method__name">RazorPay (Failure)</span></span>' +
            '<span class="tu-method__chev">' + ICON.chev + '</span>' +
          '</button>' +
          '<p class="tu-secure">' + ICON.lock + '100% secure payments · Powered by Razorpay</p>' +
        '</section>' +

        '<section data-tu="pay-wait" hidden>' +
          '<div class="tu-wait">' +
            '<div class="tu-spin" aria-hidden="true"></div>' +
            '<h2 class="tu-title">Processing payment</h2>' +
            '<p class="tu-sub">Confirming <b data-tu-amt>₹500</b> with Razorpay. Please don’t close the app or press back.</p>' +
          '</div>' +
        '</section>' +

        '<section data-tu="ok" class="tu-result" hidden>' +
          '<span class="tu-result__icon is-ok" aria-hidden="true">' + ICON.ok + '</span>' +
          '<h2 class="tu-title" id="tu-ok-title">₹500 added</h2>' +
          '<p class="tu-sub" style="margin-bottom:0">Added to your GlowTap wallet</p>' +
          '<div class="tu-receipt">' +
            '<div><span>Paid via</span><b id="tu-ok-via">Razorpay</b></div>' +
            '<div><span>Transaction ID</span><b id="tu-ok-txn">GTW8F2K91</b></div>' +
            '<div><span>New wallet balance</span><b id="tu-ok-bal">₹1,000</b></div>' +
          '</div>' +
          '<div class="tu-actions" id="tu-ok-actions">' +
            '<a class="tu-btn tu-btn--ghost" href="wallet.html" id="tu-ok-wallet">View wallet</a>' +
            '<button type="button" class="tu-btn tu-btn--primary" data-tu-close>Done</button>' +
          '</div>' +
        '</section>' +

        '<section data-tu="err" class="tu-result" hidden>' +
          '<span class="tu-result__icon is-err" aria-hidden="true">' + ICON.err + '</span>' +
          '<h2 class="tu-title">Payment failed</h2>' +
          '<p class="tu-sub" style="margin-bottom:0">We couldn’t add <b data-tu-amt>₹500</b> to your wallet.</p>' +
          '<p class="tu-reason" id="tu-err-reason">Razorpay could not complete this payment. Please try again.</p>' +
          '<p class="tu-note">No money was deducted. If your bank shows a debit, it’s reversed automatically in 5–7 working days.</p>' +
          '<div class="tu-actions">' +
            '<button type="button" class="tu-btn tu-btn--ghost" data-tu-close>Close</button>' +
            '<button type="button" class="tu-btn tu-btn--primary" id="tu-retry">Try again</button>' +
          '</div>' +
        '</section>' +
      '</div>';
    (document.querySelector('.phone') || document.body).appendChild(root);
    wire();
  }

  function section(name) {
    timers.forEach(clearTimeout);
    timers = [];
    root.querySelectorAll('[data-tu]').forEach(function (s) { s.hidden = s.getAttribute('data-tu') !== name; });
    root.querySelector('.tu__panel').scrollTop = 0;
    if (name === 'pay-wait') {
      later(function () {
        if (payOk) succeed();
        else section('err');
      }, WAIT_MS);
    }
  }
  function later(fn, ms) { if (!window.GT_TOPUP_HOLD) timers.push(setTimeout(fn, ms)); }

  function paintAmount() {
    root.querySelectorAll('[data-tu-amt]').forEach(function (e) { e.textContent = inr(amt); });
  }

  function syncAmount() {
    var input = $('tu-amount'), next = $('tu-next'), limits = $('tu-limits');
    amt = Number(String(input.value).replace(/[^\d]/g, '')) || 0;
    input.value = amt ? String(amt) : '';
    root.querySelectorAll('#tu-chips button').forEach(function (c) { c.classList.toggle('is-on', Number(c.getAttribute('data-v')) === amt); });
    var ok = amt >= MIN && amt <= MAX;
    next.disabled = !ok;
    next.textContent = ok ? 'Proceed to pay ' + inr(amt) : 'Proceed to pay';
    limits.classList.toggle('is-error', !!amt && !ok);
    limits.textContent = amt && amt < MIN ? 'Minimum top-up is ₹100'
      : amt > MAX ? 'Maximum top-up is ₹10,000'
      : 'Min ₹100 · Max ₹10,000 per top-up';
    paintAmount();
  }

  function succeed() {
    var bal = balance() + amt;
    localStorage.setItem(KEY, String(bal));
    $('tu-ok-title').textContent = inr(amt) + ' added';
    $('tu-ok-via').textContent = 'Razorpay';
    $('tu-ok-txn').textContent = 'GTW' + Date.now().toString(36).toUpperCase().slice(-6);
    $('tu-ok-bal').textContent = inr(bal);
    $('tu-bal').textContent = inr(bal);
    section('ok');
    if (opts.onSuccess) opts.onSuccess(amt, { method: 'Razorpay', balance: bal });
  }

  function startPay(ok) {
    payOk = !!ok;
    section('pay-wait');
  }

  function wire() {
    root.addEventListener('click', function (e) {
      if (e.target === root || e.target.closest('[data-tu-close]')) { close(); return; }
      var back = e.target.closest('[data-tu-back]');
      if (back) section(back.getAttribute('data-tu-back'));
    });
    $('tu-amount').addEventListener('input', syncAmount);
    root.querySelectorAll('#tu-chips button').forEach(function (c) {
      c.addEventListener('click', function () { $('tu-amount').value = c.getAttribute('data-v'); syncAmount(); });
    });
    $('tu-next').addEventListener('click', function () { if (!$('tu-next').disabled) section('method'); });
    $('tu-pick-ok').addEventListener('click', function () { startPay(true); });
    $('tu-pick-fail').addEventListener('click', function () { startPay(false); });
    $('tu-retry').addEventListener('click', function () { section('method'); });
  }

  function open(o) {
    build();
    opts = o || {};
    $('tu-bal').textContent = inr(balance());
    var hist = opts.historyLink !== false;
    $('tu-history').hidden = !hist;
    $('tu-ok-wallet').hidden = !hist;
    $('tu-ok-actions').classList.toggle('tu-actions--one', !hist);
    $('tu-amount').value = String(opts.amount || 500);
    syncAmount();
    if (opts.view === 'ok') {
      $('tu-ok-title').textContent = inr(amt) + ' added';
      $('tu-ok-via').textContent = 'Razorpay';
      $('tu-ok-bal').textContent = inr(balance() + amt);
    }
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    section(opts.view || 'amount');
  }

  function close() {
    if (!root) return;
    timers.forEach(clearTimeout);
    timers = [];
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    if (opts.onClose) opts.onClose();
  }

  window.GTTopup = {
    open: open,
    close: close,
    balance: balance,
    isOpen: function () { return !!root && root.classList.contains('is-open'); }
  };
})();
