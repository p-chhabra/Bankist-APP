'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (event) {
  event.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///Learn More Button
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

buttonScrollTo.addEventListener('click', e => {
  const s1Coords = section1.getBoundingClientRect();
  console.log(s1Coords);
  /*window.scrollTo(
    s1Coords.left + window.pageXOffset,
    s1Coords.top + window.pageYOffset
  );*/

  ///old school way
  /*window.scrollTo({
    left: s1Coords.left + window.pageXOffset,
    top: s1Coords.top + window.pageYOffset,
    behavior: 'smooth',
  });*/

  section1.scrollIntoView({ behavior: 'smooth' });
});

///PAGE NAVIGATION
//Unefficient Solution
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (event) {
    event.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
//Efficient Solution
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    console.log('link');
  }
});

///TABBED COMPONENT
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  //Gaurd clause
  if (!clicked) return;

  console.log(clicked);
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Content display
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///MENU FADE ANIMATION

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const nav_link = e.target;
    const siblings = nav_link.closest('.nav').querySelectorAll('.nav__link');
    const logo = nav_link.closest('.nav').querySelector('img');

    siblings.forEach(function (e) {
      if (e !== nav_link) {
        e.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

const nav = document.querySelector('.nav');
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

///STICKY NAVIGATION
const initialCoords = section1.getBoundingClientRect();

//Unefficient way
/*window.addEventListener('scroll', function (e) {
  if (this.window.scrollY >= initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});*/

//Efficient way
const header = document.querySelector('header');

const stickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
});
headerObserver.observe(header);

///REVEAL SECTIONS
const allSections = document.querySelectorAll('section');
const revealSections = function (entries, observers) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///LAZY LOADING IMAGES
const imageTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const entry = entries[0];
  console.log(entry);

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imageTargets.forEach(img => imageObserver.observe(img));

///SLIDER
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotConatiner = document.querySelector('.dots');

let currSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach((s, i) => {
    dotConatiner.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide = "${i}"></button>`
    );
  });
};

const activateDot = slide => {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};

const initialize = () => {
  createDots();
  activateDot(0);
};
initialize();

slides.forEach((s, i) => {
  s.style.transform = `translateX(${i * 100}%)`;
});

const gotoSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  gotoSlide(currSlide);
  activateDot(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }
  gotoSlide(currSlide);
  activateDot(currSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

dotConatiner.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    gotoSlide(slide);
    activateDot(slide);
  }
});
