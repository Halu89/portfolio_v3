const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (scrollY > 10) {
    nav.classList.add('minimized');
  } else {
    nav.classList.remove('minimized');
  }
});
