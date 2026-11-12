// Google "Choose an account" sheet for any [data-google] button.
(function () {
  var phone = document.querySelector('.phone');
  var triggers = document.querySelectorAll('[data-google]');
  if (!phone || !triggers.length) return;

  var G = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  var accounts = [
    { name: 'Ananya Sharma', mail: 'ananya.sharma@gmail.com', color: '#7B00FF' },
    { name: 'Ananya S.', mail: 'ananya.work@gmail.com', color: '#0F9D58', member: true }
  ];

  function dest(a) {
    if (a && a.member) return 'home.html';
    var q = 'google=1' + (a ? '&amp;name=' + encodeURIComponent(a.name) + '&amp;email=' + encodeURIComponent(a.mail) : '');
    return 'complete-profile.html?' + q;
  }

  var backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop g-backdrop';
  backdrop.id = 'g-backdrop';
  backdrop.hidden = true;
  backdrop.setAttribute('data-overlay', '');

  var sheet = document.createElement('div');
  sheet.className = 'g-sheet';
  sheet.id = 'g-sheet';
  sheet.hidden = true;
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-labelledby', 'g-sheet-title');
  sheet.setAttribute('data-overlay', '');
  sheet.innerHTML =
    '<div class="g-sheet__handle" aria-hidden="true"></div>' +
    '<div class="g-sheet__brand">' + G + 'Sign in with Google</div>' +
    '<h3 id="g-sheet-title">Choose an account</h3>' +
    '<p class="g-sheet__sub">to continue to <b>GlowTap</b></p>' +
    accounts.map(function (a) {
      return '<a class="g-acct" href="' + dest(a) + '"><span class="g-acct__av" style="background:' + a.color + '">' + a.name.charAt(0) +
        '</span><span class="g-acct__text"><span class="g-acct__name">' + a.name + '</span><span class="g-acct__mail">' + a.mail + '</span></span></a>';
    }).join('') +
    '<a class="g-acct g-acct--add" href="' + dest(null) + '"><span class="g-acct__av"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></span>' +
    '<span class="g-acct__text"><span class="g-acct__name">Use another account</span></span></a>' +
    '<p class="g-sheet__legal">To continue, Google will share your name, email address and profile picture with GlowTap.</p>';

  phone.appendChild(backdrop);
  phone.appendChild(sheet);

  function open() {
    backdrop.hidden = false;
    sheet.hidden = false;
    requestAnimationFrame(function () { backdrop.classList.add('is-open'); sheet.classList.add('is-open'); });
  }
  function close() {
    backdrop.classList.remove('is-open');
    sheet.classList.remove('is-open');
    setTimeout(function () { backdrop.hidden = true; sheet.hidden = true; }, 220);
  }
  triggers.forEach(function (t) { t.addEventListener('click', function (e) { e.preventDefault(); open(); }); });
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) close(); });
})();
