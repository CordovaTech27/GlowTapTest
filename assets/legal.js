(function () {
  var params = new URLSearchParams(location.search);
  var from = params.get('from') || '';
  if (!/^[a-z-]+\.html(\?[^#]*)?$/.test(from)) from = '';
  var fromSignup = /^(signup|complete-profile)\.html/.test(from);

  var back = document.querySelector('.back');
  if (from) back.setAttribute('href', from);

  document.querySelectorAll('a[href="terms.html"], a[href="privacy.html"]').forEach(function (a) {
    if (from) a.setAttribute('href', a.getAttribute('href') + '?from=' + encodeURIComponent(from));
  });

  var footer = document.getElementById('footer-btn');
  if (footer && fromSignup) {
    footer.hidden = false;
    footer.querySelector('a').setAttribute('href', from);
  }
})();
