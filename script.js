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
const sliderItems = Array.from(slider.querySelectorAll('.partner-item'));
const previousButton = document.querySelector('.slider-arrow[data-direction="-1"]');
const nextButton = document.querySelector('.slider-arrow[data-direction="1"]');
let sliderIndex = 0;

const visibleLogoCount = () => window.matchMedia('(max-width: 760px)').matches ? 1 : 4;
const updateSlider = (behavior = 'smooth') => {
  const maxIndex = Math.max(0, sliderItems.length - visibleLogoCount());
  sliderIndex = Math.min(Math.max(sliderIndex, 0), maxIndex);
  const firstOffset = sliderItems[0]?.offsetLeft || 0;
  const targetOffset = (sliderItems[sliderIndex]?.offsetLeft || firstOffset) - firstOffset;
  slider.scrollTo({left: targetOffset, behavior});
  previousButton.disabled = sliderIndex === 0;
  nextButton.disabled = sliderIndex === maxIndex;
};

document.querySelectorAll('.slider-arrow').forEach(button => button.addEventListener('click', () => {
  sliderIndex += Number(button.dataset.direction) * visibleLogoCount();
  updateSlider();
}));
slider.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  sliderIndex += event.key === 'ArrowRight' ? 1 : -1;
  updateSlider();
});
window.addEventListener('resize', () => updateSlider('auto'));
window.addEventListener('pageshow', () => {
  sliderIndex = 0;
  updateSlider('auto');
});
updateSlider('auto');

const sponsorDialog = document.querySelector('#sponsor-dialog');
const dialogBrand = document.querySelector('#sponsor-dialog-brand');
const dialogImage = document.querySelector('#sponsor-dialog-image');
const dialogTitle = document.querySelector('#sponsor-dialog-title');
const dialogDescription = document.querySelector('#sponsor-dialog-description');
const dialogSite = document.querySelector('#sponsor-dialog-site');
let sponsorTrigger;

document.querySelectorAll('.sponsor-card:not([data-direct-link])').forEach(card => card.addEventListener('click', () => {
  sponsorTrigger = card.querySelector('.sponsor-more');
  dialogBrand.replaceChildren(card.querySelector('.operah-logo, .brand-logo, .logo-placeholder').cloneNode(true));
  const photo = card.querySelector('.sponsor-photo');
  dialogImage.replaceChildren(...(photo ? [photo.cloneNode(true)] : []));
  dialogImage.hidden = !photo;
  dialogTitle.textContent = card.querySelector('h3').textContent;
  const fullDescription = card.querySelector('.sponsor-full');
  if (fullDescription) {
    dialogDescription.replaceChildren(...Array.from(fullDescription.children, node => node.cloneNode(true)));
  } else {
    dialogDescription.replaceChildren(card.querySelector('p').cloneNode(true));
  }

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
