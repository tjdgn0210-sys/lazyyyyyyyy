const header = document.getElementById('header');
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');

// 스크롤하면 헤더 하단선
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 모바일 메뉴
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }
});

// 헤더 높이만큼 보정한 앵커 이동
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// 앱 화면(428×741)을 폰 프레임 너비에 맞춰 축소해서 넣는다
const APP_W = 428;
const APP_H = 741;
const screenBoxes = document.querySelectorAll('.screen-box');

const fitScreen = (box) => {
  const ui = box.firstElementChild;
  if (!ui) return;
  const scale = box.clientWidth / APP_W;
  ui.style.transform = `scale(${scale})`;
  box.style.height = `${APP_H * scale}px`;
};
const mountScreen = (box, key) => {
  box.innerHTML = window.SCREENS[key];
  box.dataset.current = key;
  fitScreen(box);
};
screenBoxes.forEach((box) => mountScreen(box, box.dataset.screen));
window.addEventListener('resize', () => screenBoxes.forEach(fitScreen));

// 사용 방법: 화면 중앙에 온 항목을 활성화하고 폰 화면을 교체
const mainBox = document.getElementById('screenBox');
const items = document.querySelectorAll('.explore-item');

const swapScreen = (key) => {
  if (mainBox.dataset.current === key) return;
  mainBox.dataset.current = key;
  mainBox.classList.add('fade');
  setTimeout(() => {
    mountScreen(mainBox, key);
    mainBox.classList.remove('fade');
  }, 200);
};

const itemObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    items.forEach((el) => el.classList.toggle('active', el === entry.target));
    swapScreen(entry.target.dataset.screen);
  });
}, { rootMargin: '-45% 0px -45% 0px' });
items.forEach((el) => itemObserver.observe(el));

// 섹션 등장 효과
const revealTargets = document.querySelectorAll('.section-title, .panel, .hero-visual, .faq details, .cta h2');
revealTargets.forEach((el) => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach((el) => revealObserver.observe(el));
