const menuToggle = document.querySelector('#menuToggle');
const mobileMenu = document.querySelector('#mobileMenu');
const searchToggle = document.querySelector('#searchToggle');
const searchPanel = document.querySelector('#searchPanel');
const searchInput = document.querySelector('#siteSearch');
const toast = document.querySelector('#toast');

function setExpanded(button, panel, expanded) {
  button.setAttribute('aria-expanded', String(expanded));
  panel.hidden = !expanded;
}

function closeHeaderPanels() {
  setExpanded(menuToggle, mobileMenu, false);
  setExpanded(searchToggle, searchPanel, false);
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-label', 'Open menu');
  menuToggle.querySelector('i').className = 'ph ph-list';
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  setExpanded(searchToggle, searchPanel, false);
  setExpanded(menuToggle, mobileMenu, open);
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuToggle.querySelector('i').className = open ? 'ph ph-x' : 'ph ph-list';
});

searchToggle.addEventListener('click', () => {
  const open = searchToggle.getAttribute('aria-expanded') !== 'true';
  setExpanded(menuToggle, mobileMenu, false);
  document.body.classList.remove('menu-open');
  setExpanded(searchToggle, searchPanel, open);
  if (open) window.setTimeout(() => searchInput.focus(), 50);
});

document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', closeHeaderPanels));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeHeaderPanels();
});

document.querySelector('.search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  showToast(query ? `Searching for “${query}”` : 'Enter a search term');
});

document.querySelector('#cartButton').addEventListener('click', () => {
  showToast('Your shopping bag is empty.');
});

document.querySelector('.account-button').addEventListener('click', () => {
  showToast('Account sign-in is ready to connect.');
});

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

const newsletterForm = document.querySelector('#newsletterForm');
const emailInput = document.querySelector('#email');
const formMessage = document.querySelector('#formMessage');

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formMessage.classList.remove('success');

  if (!emailInput.validity.valid) {
    formMessage.textContent = 'Please enter a valid email address.';
    emailInput.setAttribute('aria-invalid', 'true');
    emailInput.focus();
    return;
  }

  emailInput.removeAttribute('aria-invalid');
  formMessage.classList.add('success');
  formMessage.textContent = 'You’re in. Watch your inbox for our next edit.';
  newsletterForm.reset();
});

let toastTimer;
function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2800);
}

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    image.hidden = true;
    image.parentElement?.classList.add('image-missing');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1080) closeHeaderPanels();
}, { passive: true });

const hero = document.querySelector('.hero');
const heroMedia = document.querySelector('.hero-media');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopHero = window.matchMedia('(min-width: 961px)');
let parallaxFrame;
let heroVisible = false;

function updateHeroParallax() {
  if (!hero || !heroMedia || !heroVisible || reducedMotion.matches || !desktopHero.matches) {
    heroMedia?.style.removeProperty('--hero-parallax-y');
    parallaxFrame = undefined;
    return;
  }

  const rect = hero.getBoundingClientRect();
  const offset = Math.max(-38, Math.min(38, -rect.top * 0.12));
  heroMedia.style.setProperty('--hero-parallax-y', `${offset.toFixed(2)}px`);
  parallaxFrame = window.requestAnimationFrame(updateHeroParallax);
}

function requestHeroParallax() {
  if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateHeroParallax);
}

if (hero) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    if (heroVisible) requestHeroParallax();
  });
  heroObserver.observe(hero);
}

window.addEventListener('resize', requestHeroParallax, { passive: true });
reducedMotion.addEventListener('change', requestHeroParallax);
desktopHero.addEventListener('change', requestHeroParallax);
requestHeroParallax();

const collectionStory = document.querySelector('.collection-story');
const collectionStage = document.querySelector('.collection-stage');
const collectionPanels = [...document.querySelectorAll('[data-collection-panel]')];
const collectionJumps = [...document.querySelectorAll('[data-collection-jump]')];
let collectionFrame;
let collectionVisible = false;
let activeCollection = 0;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(start, end, value) {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - (2 * progress));
}

function setActiveCollection(nextIndex) {
  if (nextIndex === activeCollection && collectionPanels[nextIndex]?.classList.contains('is-active')) return;
  activeCollection = nextIndex;

  collectionPanels.forEach((panel, index) => {
    const active = index === nextIndex;
    panel.classList.toggle('is-active', active);
    panel.setAttribute('aria-hidden', String(!active));
    panel.querySelector('.collection-panel__link')?.setAttribute('tabindex', active ? '0' : '-1');
  });

  collectionJumps.forEach((button, index) => {
    const active = index === nextIndex;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
}

function resetCollectionMotion() {
  collectionPanels.forEach((panel) => {
    panel.style.removeProperty('opacity');
    panel.querySelector('.collection-panel__media img')?.style.removeProperty('transform');
    panel.querySelectorAll('[data-reveal]').forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
    panel.removeAttribute('aria-hidden');
    panel.querySelector('.collection-panel__link')?.removeAttribute('tabindex');
  });
}

function updateCollectionStory() {
  if (!collectionStory || !collectionStage || !collectionVisible) {
    collectionFrame = undefined;
    return;
  }

  if (reducedMotion.matches) {
    resetCollectionMotion();
    collectionFrame = undefined;
    return;
  }

  const rect = collectionStory.getBoundingClientRect();
  const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
  const scrollDistance = Math.max(1, collectionStory.offsetHeight - collectionStage.offsetHeight);
  const progress = clamp((headerHeight - rect.top) / scrollDistance);
  const timeline = progress * collectionPanels.length;
  const nextActive = Math.min(collectionPanels.length - 1, Math.floor(timeline));
  setActiveCollection(nextActive);

  collectionPanels.forEach((panel, index) => {
    const local = timeline - index;
    const entering = index === 0 ? 1 : smoothstep(-0.2, 0.12, local);
    const leaving = index === collectionPanels.length - 1 ? 0 : smoothstep(0.78, 1.12, local);
    const visibility = clamp(entering * (1 - leaving));
    panel.style.opacity = visibility.toFixed(4);

    const image = panel.querySelector('.collection-panel__media img');
    if (image) {
      const imageShift = ((1 - entering) * 5.5) - (leaving * 5.5);
      const imageScale = 1.045 - (visibility * 0.02);
      image.style.transform = `translate3d(0, ${imageShift.toFixed(3)}%, 0) scale(${imageScale.toFixed(4)})`;
    }

    panel.querySelectorAll('[data-reveal]').forEach((element) => {
      const order = Number(element.dataset.reveal || 0);
      const revealIn = index === 0 ? 1 : smoothstep(-0.16 + (order * 0.035), 0.08 + (order * 0.035), local);
      const revealVisibility = clamp(revealIn * (1 - leaving));
      const revealShift = ((1 - revealIn) * (24 + (order * 3))) - (leaving * 17);
      element.style.opacity = revealVisibility.toFixed(4);
      element.style.transform = `translate3d(0, ${revealShift.toFixed(2)}px, 0)`;
    });
  });

  collectionFrame = window.requestAnimationFrame(updateCollectionStory);
}

function requestCollectionUpdate() {
  if (!collectionFrame) collectionFrame = window.requestAnimationFrame(updateCollectionStory);
}

if (collectionStory && collectionStage && collectionPanels.length) {
  const collectionObserver = new IntersectionObserver(([entry]) => {
    collectionVisible = entry.isIntersecting;
    if (collectionVisible) requestCollectionUpdate();
  });
  collectionObserver.observe(collectionStory);

  collectionJumps.forEach((button, index) => {
    button.addEventListener('click', () => {
      const storyRect = collectionStory.getBoundingClientRect();
      const storyTop = window.scrollY + storyRect.top;
      const scrollDistance = collectionStory.offsetHeight - collectionStage.offsetHeight;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
      const segmentProgress = index === 0 ? 0 : (index + 0.14) / collectionPanels.length;
      window.scrollTo({
        top: storyTop - headerHeight + (scrollDistance * segmentProgress),
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  });
}

window.addEventListener('resize', requestCollectionUpdate, { passive: true });
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) resetCollectionMotion();
  else if (collectionVisible) requestCollectionUpdate();
});
