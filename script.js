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
