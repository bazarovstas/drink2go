function mobileMenuToogle () {
  let nav = document.querySelector('.main-header');
  let toggle = document.querySelector('.main-nav-user__toogle');

  nav.classList.remove('main-nav--nojs');
  nav.classList.remove('main-nav--open');
  nav.classList.add('main-nav--closed');

  toggle.addEventListener('click', function () {
    if (nav.classList.contains('main-nav--closed')) {
      nav.classList.remove('main-nav--closed');
      nav.classList.add('main-nav--open');
    } else {
      nav.classList.add('main-nav--closed');
      nav.classList.remove('main-nav--open');
    }
  });
}

export {mobileMenuToogle};
