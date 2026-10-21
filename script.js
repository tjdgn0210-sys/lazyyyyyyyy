const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const menuBtn = document.getElementById('menuBtn');

// 스크롤하면 헤더에 그림자
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 모바일 메뉴 열기/닫기
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }
});

// 부드러운 앵커 스크롤 (헤더 높이만큼 보정)
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// 섹션 등장 애니메이션
const revealTargets = document.querySelectorAll(
  '.hero-inner, .feature-inner, .video-band .container, .cards .container, .stats .container, .cta .container'
);
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

// 숫자 카운터: 화면에 보일 때 0 → 목표값
const animateCount = (el) => {
  const target = Number(el.dataset.target);
  const duration = 1500;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.count').forEach((el) => countObserver.observe(el));

// 영상: 화면에 보이면 재생, 벗어나면 일시정지
const video = document.querySelector('.video-band video');
if (video) {
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: 0.5 }).observe(video);
}
