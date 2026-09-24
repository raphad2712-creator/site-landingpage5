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

const sponsorDialog = document.querySelector('#sponsor-dialog');
const dialogBrand = document.querySelector('#sponsor-dialog-brand');
const dialogImage = document.querySelector('#sponsor-dialog-image');
const dialogTitle = document.querySelector('#sponsor-dialog-title');
const dialogDescription = document.querySelector('#sponsor-dialog-description');
const dialogSite = document.querySelector('#sponsor-dialog-site');
let sponsorTrigger;

document.querySelectorAll('.sponsor-card:not([data-direct-link])').forEach(card => card.addEventListener('click', () => {
  sponsorTrigger = card.querySelector('.sponsor-more');
  dialogBrand.replaceChildren(card.querySelector('.operah-logo, .logo-placeholder').cloneNode(true));
  const photo = card.querySelector('.sponsor-photo');
  dialogImage.replaceChildren(...(photo ? [photo.cloneNode(true)] : []));
  dialogImage.hidden = !photo;
  dialogTitle.textContent = card.querySelector('h3').textContent;
  dialogDescription.replaceChildren(...Array.from(card.querySelector('p').childNodes, node => node.cloneNode(true)));

  // Partner URLs can be supplied per card with data-site="https://...".
  const site = card.dataset.site;
  const validSite = site && /^https:\/\//i.test(site);
  dialogSite.hidden = !validSite;
  if (validSite) dialogSite.href = site;
  else dialogSite.removeAttribute('href');

  sponsorDialog.showModal();
  sponsorDialog.querySelector('.dialog-close').focus();
}));
sponsorDialog.querySelector('.dialog-close').addEventListener('click', () => sponsorDialog.close());
sponsorDialog.addEventListener('click', event => {
  if (event.target === sponsorDialog) sponsorDialog.close();
});
sponsorDialog.addEventListener('close', () => sponsorTrigger?.focus());

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
