(() => {
  document.body.dataset.productPage = 'docs';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    if ((link.getAttribute('href') || '').includes('docs.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
