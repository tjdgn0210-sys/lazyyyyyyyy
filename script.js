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

// 콘텐츠 탐색: 화면 중앙에 온 항목을 활성화하고 폰 화면을 교체
const screen = document.getElementById('screen');
const items = document.querySelectorAll('.explore-item');
let current = screen.getAttribute('src');

const setScreen = (src) => {
  if (src === current) return;
  current = src;
  screen.classList.add('fade');
  setTimeout(() => {
    screen.src = src;
    screen.classList.remove('fade');
  }, 200);
};

const itemObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    items.forEach((el) => el.classList.toggle('active', el === entry.target));
    setScreen(entry.target.dataset.screen);
  });
}, { rootMargin: '-45% 0px -45% 0px' });
items.forEach((el) => itemObserver.observe(el));

// 섹션 등장 효과
const revealTargets = document.querySelectorAll('.section-title, .panel, .ads img, .hero-visual, .cta h2');
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

// 보험 아이콘: 보이면 회색 → 컬러
const icons = document.getElementById('icons');
new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      icons.classList.add('on');
      obs.disconnect();
    }
  });
}, { threshold: 0.6 }).observe(icons);

// 영상: 화면에 보이면 재생, 벗어나면 일시정지
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) target.play().catch(() => {});
    else target.pause();
  });
}, { threshold: 0.4 });
document.querySelectorAll('video').forEach((v) => videoObserver.observe(v));
