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
  '.section-title, .panel, .hero-visual, .faq details, .pain-card, .pain-answer, .commit-copy, .commit-visual, .demo-copy, .demo-result, .buy-card'
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

// 폭탄 달력 예시 (28칸 중 일부가 폭탄) — 보이면 하나씩 터진다
const bombGrid = document.getElementById('bombGrid');
const BOMB_DAYS = [2, 6, 9, 13, 16, 17, 22, 25];
let bombOrder = 0;
for (let day = 1; day <= 28; day++) {
  const cell = document.createElement('i');
  if (BOMB_DAYS.includes(day)) {
    cell.className = 'hit';
    cell.textContent = '💣';
    cell.style.setProperty('--i', bombOrder++);
  }
  bombGrid.appendChild(cell);
}
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

// 체험: 할 일 + 시간을 받아 휴식이 들어간 계획표를 만든다
const demoForm = document.getElementById('demoForm');
const demoOut = document.getElementById('demoOut');
const PLAN_COLORS = ['#3182F6', '#17C3B2', '#FFB547'];

const pad = (n) => String(n).padStart(2, '0');
const clock = (min) => `${pad(Math.floor(min / 60) % 24)}:${pad(min % 60)}`;
const spanText = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h ? `${h}시간` : '', m ? `${m}분` : ''].filter(Boolean).join(' ');
};

const renderPlan = () => {
  const form = new FormData(demoForm);
  const total = Number(form.get('total'));
  const tasks = [1, 2, 3]
    .map((n) => ({ name: String(form.get(`t${n}`)).trim(), min: Number(form.get(`d${n}`)) }))
    .filter((t) => t.name);

  demoOut.replaceChildren();
  const add = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  if (!tasks.length) {
    demoOut.append(add('p', 'tl-empty', '할 일을 하나 이상 적어 주세요.'));
    return;
  }
  const work = tasks.reduce((sum, t) => sum + t.min, 0);
  if (work > total) {
    demoOut.append(add('p', 'tl-warn', `할 일(${spanText(work)})이 쓸 수 있는 시간(${spanText(total)})보다 많아요.\n할 일을 줄이거나 시간을 늘려 보세요.`));
    demoOut.firstChild.style.whiteSpace = 'pre-line';
    return;
  }

  const gap = Math.min(60, Math.floor((total - work) / tasks.length / 5) * 5);
  const now = new Date();
  let cursor = Math.ceil((now.getHours() * 60 + now.getMinutes()) / 5) * 5;
  const startAt = cursor;

  const head = add('div', 'tl-head');
  head.append(add('b', '', '오늘의 계획표'), add('span', '', `${clock(startAt)} 시작 · ${spanText(total)}`));
  const strip = add('div', 'tl-strip');
  const list = add('div', 'tl-list');

  tasks.forEach((task, i) => {
    const item = add('div', 'tl-item');
    item.style.animationDelay = `${i * 0.12}s`;
    const time = add('div', 'tl-time', clock(cursor));
    time.append(add('small', '', clock(cursor + task.min)));
    const dot = add('span', 'tl-dot');
    dot.style.background = PLAN_COLORS[i];
    const body = add('div', 'tl-body');
    body.append(add('div', 'tl-name', task.name), add('div', 'tl-meta', spanText(task.min)));
    item.append(time, dot, body);
    list.append(item);

    const seg = add('i');
    seg.style.flexGrow = task.min;
    seg.style.background = PLAN_COLORS[i];
    strip.append(seg);

    cursor += task.min;
    if (i < tasks.length - 1 && gap > 0) {
      const brk = add('div', 'tl-break', `휴식 ${gap}분`);
      brk.style.animationDelay = `${i * 0.12 + 0.06}s`;
      list.append(brk);
      const gapSeg = add('i');
      gapSeg.style.flexGrow = gap;
      gapSeg.style.background = '#e5e8eb';
      strip.append(gapSeg);
      cursor += gap;
    }
  });

  const left = startAt + total - cursor;
  demoOut.append(head, strip, list, add('p', 'tl-foot', `${clock(cursor)}에 모두 끝나요 · 여유 ${spanText(left)}`));
};

demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  renderPlan();
});
renderPlan();
