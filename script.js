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
const revealTargets = document.querySelectorAll(
  '.section-title, .panel, .hero-visual, .faq details, .pain-card, .pain-answer, .commit-copy, .commit-visual, .buy-card'
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

// 모바일 하단 고정 버튼: 히어로를 지나면 나타나고, 구매 영역에서는 숨김
const stickyBuy = document.getElementById('stickyBuy');
const heroEl = document.querySelector('.hero');
const buyEl = document.getElementById('download');
const updateSticky = () => {
  const pastHero = heroEl.getBoundingClientRect().bottom < 0;
  const atBuy = buyEl.getBoundingClientRect().top < window.innerHeight * 0.8;
  stickyBuy.classList.toggle('show', pastHero && !atBuy);
};
window.addEventListener('scroll', updateSticky, { passive: true });
updateSticky();

// 폭탄 달력 예시 — 보이면 하나씩 터지고, 누르면 어떤 일이 폭발했는지 보여 준다
const bombGrid = document.getElementById('bombGrid');
const bombDetail = document.getElementById('bombDetail');
const BOMBS = {
  2: '독서 · 오후 10:00',
  6: '운동 · 오후 9:30',
  9: '영어 공부 · 오후 11:00',
  13: '빨래 개기 · 오후 8:40',
  16: '독서 · 오후 10:00',
  17: '장보기 · 오후 7:20',
  22: '설거지 · 오후 9:10',
  25: '운동 · 오후 10:30',
};
let bombOrder = 0;
for (let day = 1; day <= 28; day++) {
  if (!BOMBS[day]) {
    bombGrid.appendChild(document.createElement('i'));
    continue;
  }
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.textContent = '💣';
  cell.dataset.day = day;
  cell.setAttribute('aria-label', `${day}일 폭탄 보기`);
  cell.style.setProperty('--i', bombOrder++);
  bombGrid.appendChild(cell);
}
bombGrid.addEventListener('click', (e) => {
  const cell = e.target.closest('button');
  if (!cell) return;
  bombGrid.querySelectorAll('button.sel').forEach((el) => el.classList.remove('sel'));
  cell.classList.add('sel');
  bombDetail.classList.add('hit');
  bombDetail.textContent = `${cell.dataset.day}일 · ${BOMBS[cell.dataset.day]} 💥 폭발`;
});
new IntersectionObserver((entries, obs) => {
  if (entries.some((e) => e.isIntersecting)) {
    bombGrid.classList.add('on');
    obs.disconnect();
  }
}, { threshold: 0.5 }).observe(bombGrid);

// 1분 수정 카운트다운: 60초 → 확정 → 다시 반복
const ringFg = document.getElementById('ringFg');
const ringNum = document.getElementById('ringNum');
const ringLabel = document.getElementById('ringLabel');
const ringText = ringNum.parentElement;
const RING_LEN = 326.73;
const EDIT_SECONDS = 60;
let remain = EDIT_SECONDS;

const renderRing = () => {
  const done = remain <= 0;
  ringFg.style.strokeDashoffset = done ? 0 : RING_LEN * (1 - remain / EDIT_SECONDS);
  ringFg.classList.toggle('done', done);
  ringText.classList.toggle('done', done);
  ringNum.textContent = done ? '확정' : remain;
  ringLabel.textContent = done ? '이제 못 바꿔요' : '초 안에 수정';
};
renderRing();
setInterval(() => {
  remain = remain <= -3 ? EDIT_SECONDS : remain - 1;
  renderRing();
}, 1000);

// 헤더 아래 스크롤 진행 바
const progress = document.getElementById('progress');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// 히어로 폰 화면 탭: 계획표 / 잠금화면 / 기록
const heroBox = document.getElementById('heroBox');
const heroTabs = document.querySelectorAll('.screen-tabs button');
heroTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.hero;
    heroTabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', on);
    });
    if (heroBox.dataset.current === key) return;
    heroBox.classList.add('fade');
    setTimeout(() => {
      mountScreen(heroBox, key);
      heroBox.classList.remove('fade');
    }, 200);
  });
});

// 기능 카드의 일정 스타일 칩 (집중 / 균형 / 여유)
const styleChips = document.querySelectorAll('#styleChips button');
styleChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    styleChips.forEach((el) => el.classList.toggle('on', el === chip));
  });
});
