const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('open', opening);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('open');
}));
const slider = document.querySelector('#partners-track');
document.querySelectorAll('.slider-arrow').forEach(button => button.addEventListener('click', () => {
  slider.scrollBy({left: Number(button.dataset.direction) * slider.clientWidth * .55, behavior: 'smooth'});
}));
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('js-reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {threshold: .08, rootMargin: '0px 0px -24px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}
