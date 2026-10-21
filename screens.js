// 앱 화면 6장을 HTML로 그려서 window.SCREENS 에 담는다 (소개 페이지의 폰 안에 들어간다)
(() => {
  const CH = ['#3182F6', '#17C3B2', '#FFB547', '#F66D6D', '#8B7BFF'];
  const status = '<div class="status"><b>9:41</b><span class="sicons"><i></i><i class="w"></i><i class="b"></i></span></div>';

  const calIcon = (day) =>
    '<svg width="26" height="26" viewBox="0 0 26 26"><rect x="1.5" y="4.5" width="23" height="20" rx="6" fill="none" stroke="#6B7684" stroke-width="2"/>' +
    '<path d="M3.5 5 h19 v6 h-19z" fill="#6B7684"/><rect x="6" y="1" width="3" height="6" rx="1.5" fill="#6B7684"/><rect x="17" y="1" width="3" height="6" rx="1.5" fill="#6B7684"/>' +
    '<text x="13" y="21.5" text-anchor="middle" font-size="10.5" font-weight="800" fill="#6B7684" font-family="Segoe UI, sans-serif">' + day + '</text></svg>';
  const gearIcon = () => {
    let bars = '';
    [0, 45, 90, 135].forEach((d) => { bars += '<rect x="0.5" y="10.5" width="25" height="5" rx="1.5" fill="#6B7684" transform="rotate(' + d + ' 13 13)"/>'; });
    return '<svg width="26" height="26" viewBox="0 0 26 26">' + bars + '<circle cx="13" cy="13" r="9" fill="#6B7684"/><circle cx="13" cy="13" r="4" fill="#fff"/></svg>';
  };
  const bombSvg = (s, c) =>
    '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24"><circle cx="9" cy="15" r="8.5" fill="' + c + '"/><circle cx="6" cy="12" r="2" fill="#fff" opacity=".45"/>' +
    '<rect x="12.5" y="4" width="5" height="3.5" rx="1" fill="#6B7684" transform="rotate(40 15 6)"/><path d="M16 5 Q19 2 22 3" stroke="#6B7684" stroke-width="1.6" fill="none"/><circle cx="22" cy="3" r="2" fill="#FFB547"/></svg>';
  const appIcon = '<svg class="appico" viewBox="0 0 20 20"><rect width="20" height="20" rx="6" fill="#3182F6"/><path d="M5.5 10.5l3 3 6-6.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const topBar = (day) => '<div class="top"><div class="ib">' + calIcon(day) + '</div><div class="ib">' + gearIcon() + '</div></div>';
  const bar = (i) => '<div class="stepwrap"><div class="track"><div class="fill" style="width:' + ((i + 1) / 3) * 100 + '%"></div></div></div>';
  const btn = (label, kind, flex) => '<div class="btn ' + (kind || '') + '" style="flex:' + (flex || 1) + '">' + label + '</div>';
  const chip = (label, on) => '<span class="chip ' + (on ? 'on' : '') + '">' + label + '</span>';
  const ui = (inner) => '<div class="ui">' + status + inner + '</div>';

  const taskRows = [
    ['설거지', '추정', '정도 3 · 30분'],
    ['영어 공부', '중요도 높음 · 추정', '정도 4 · 60분'],
    ['빨래 개기', '중요도 낮음 · 추정', '정도 3 · 30분'],
    ['운동', '매일 · 추정', '정도 4 · 60분'],
    ['장보기', '추정', '정도 4 · 60분'],
    ['독서', '중요도 낮음 · 추정', '정도 4 · 45분'],
  ];
  const rowsHtml = taskRows.map((r) =>
    '<div class="row"><div class="grow"><div class="nm">' + r[0] + '</div><div class="mt">' + r[1] + '</div></div><div class="val">' + r[2] + '</div><div class="chev">›</div></div>').join('');

  const tasksScreen = (typed) =>
    topBar(20) + bar(0) +
    '<div class="body"><h1>오늘 할 일</h1>' +
    '<div class="add"><div class="inp">' + (typed || '할 일 입력') + '</div><div class="link">추가</div></div>' +
    '<div class="gap12"></div>' + rowsHtml + '</div>' +
    '<div class="footer">' + btn('확인') + '</div>';

  const sheetScreen =
    tasksScreen('영어 공부') +
    '<div class="dim"></div>' +
    '<div class="sheet"><div class="grab"></div><div class="nm">영어 공부</div>' +
    '<div class="lb">중요도</div><div class="levels"><div class="lv on">높음</div><div class="lv">보통</div><div class="lv">낮음</div></div>' +
    '<div class="lb" style="margin-top:20px">걸리는 정도 (1 적게 ~ 5 많이)</div>' +
    '<div class="wheel"><div class="bar"></div>' +
    '<div class="wi" style="opacity:.55;transform:scale(.95)">3</div><div class="wi" style="color:#3182F6">4</div><div class="wi" style="opacity:.55;transform:scale(.95)">5</div></div>' +
    btn('추가') + '</div>';

  const timeField = (ap, h, m) =>
    '<div class="tf"><span class="ap">' + ap + '</span><span class="n">' + h + '</span><span class="co">:</span><span class="n">' + m + '</span><div class="w"><i></i></div></div>';

  const settingsScreen =
    topBar(20) + bar(1) +
    '<div class="body"><h1>쓸 수 있는<br>시간</h1>' +
    '<div class="chips">' + chip('지금부터', true) + chip('오후') + chip('저녁') + chip('하루 종일') + '</div>' +
    '<div style="margin-top:8px">' +
    '<div class="field"><span class="lb">시작</span>' + timeField('오후', '2', '04') + '</div>' +
    '<div class="field"><span class="lb">끝</span>' + timeField('오후', '10', '00') + '</div></div>' +
    '<div class="total">총 7시간 56분</div>' +
    '<div class="sec">쉬는 시간</div><div class="chips">' + chip('자동', true) + chip('직접') + '</div>' +
    '<div class="sec t">일정 스타일</div><div class="chips">' + chip('집중') + chip('균형') + chip('여유', true) + '</div></div>' +
    '<div class="footer">' + btn('이전', 'gray', 1) + btn('계획표 짜기', '', 2) + '</div>';

  const plan = [
    ['14:04', '15:34', '영어 공부', '1시간 30분', '+30분', 90],
    ['16:24', '17:54', '운동', '1시간 30분', '+30분', 90],
    ['18:44', '19:14', '설거지', '30분', '', 30],
    ['19:44', '20:14', '빨래 개기', '30분', '', 30],
  ];
  const planScreen = () => {
    let items = '';
    plan.forEach((p, i) => {
      if (i > 0) items += '<div class="brk">휴식 50분</div>';
      items += '<div class="item"><div class="itimes"><div class="istart">' + p[0] + '</div><div class="iend">' + p[1] + '</div></div><span class="dot" style="background:' + CH[i] + '"></span>' +
        '<div class="ibody"><div class="iname">' + p[2] + '</div><div class="imeta">' + p[3] + (p[4] ? '<b>' + p[4] + '</b>' : '') + '</div></div><span class="box"></span></div>';
    });
    const strip = plan.map((p, i) => '<div style="flex-grow:' + p[5] + ';min-width:3px;background:' + CH[i] + '"></div>').join('');
    return topBar(20) + bar(2) +
      '<div class="body"><div class="now"><div class="nowrow"><span class="pulse"><i></i></span><span class="nowlabel">지금</span></div>' +
      '<div class="nowname">영어 공부</div><div class="nowtime">14:04 – 15:34</div>' +
      '<div class="meter"><span class="l">1시간 18분 남음</span><span class="p">87%</span></div><div class="prog"><div style="width:87%"></div></div></div>' +
      '<div class="strip">' + strip + '</div><div class="lead">14:04 – 22:00 · 7시간 56분</div>' +
      '<div class="items"><div class="line"></div>' + items + '</div></div>' +
      '<div class="footer">' + btn('수정 (42초)', '', 1) + '</div>';
  };

  const shadeScreen =
    '<div class="ui"><div class="shade">' +
    '<div class="clock"><b>2:04</b><span>5G ▮▮▮</span></div>' +
    '<div class="date">10월 20일 화요일</div><div class="dsub">알림 2개</div>' +
    '<div class="nlabel">진행 중</div>' +
    '<div class="ncard"><div class="nhead">' + appIcon + '<span>게으름뱅이일정앱</span><span class="sp"></span><span class="chrono">1:18:07</span></div>' +
    '<div class="ntitle">영어 공부</div><div class="nbody">14:04 – 15:34 · 다음 운동</div></div>' +
    '<div class="nlabel" style="margin-top:14px">새 알림</div>' +
    '<div class="ncard"><div class="nhead">' + appIcon + '<span>게으름뱅이일정앱</span><span class="sp"></span><span>방금</span></div>' +
    '<div class="ntitle">10분 뒤 운동</div><div class="nbody">16:24 시작 · 1시간 30분</div></div>' +
    '</div></div>';

  const calScreen = (() => {
    const counts = { 1: 2, 2: 1, 5: 3, 6: 2, 7: 1, 12: 2, 13: 3, 14: 1, 15: 2, 20: 3 };
    const bombs = [8, 16, 19];
    const cells = [null, null, null, null];
    for (let d = 1; d <= 31; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    let grid = '';
    for (let r = 0; r < cells.length / 7; r++) {
      grid += '<div class="gr">';
      for (let c = 0; c < 7; c++) {
        const d = cells[r * 7 + c];
        if (d === null) { grid += '<div class="cell"></div>'; continue; }
        const n = counts[d] || 0;
        const cls = d === 16 ? 'sel' : d === 20 ? 'today' : d > 20 ? 'fut' : '';
        const mark = bombs.includes(d) ? '<div class="bm">' + bombSvg(14, '#F04452') + '</div>'
          : '<div class="p" style="opacity:' + (n ? Math.min(1, 0.4 + n * 0.2) : 0) + '"></div>';
        grid += '<div class="cell"><div class="d ' + cls + '">' + d + '</div>' + mark + '</div>';
      }
      grid += '</div>';
    }
    return '<div class="top"><div class="ib" style="margin-right:auto;font-size:28px;color:#6B7684">‹</div><div class="ib">' + gearIcon() + '</div></div><div style="height:12px"></div>' +
      '<div class="body"><h1 style="margin-bottom:10px">완료 기록</h1>' +
      '<div class="navbar"><div class="arr">‹</div><div><div class="mt">2026년 10월</div><div class="ms">22개 완료 · 폭탄 3</div></div><div class="arr">›</div></div>' +
      '<div class="wk"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>' + grid +
      '<div class="daytitle">10월 16일 (금)</div><div class="daysub">2개 완료 · 총 2시간 · 폭탄 1개</div>' +
      '<div class="ent"><span class="t">오전 9:10</span><span class="n">영어 공부</span><span class="m">1시간</span></div>' +
      '<div class="ent"><span class="t">오후 2:40</span><span class="n">운동</span><span class="m">1시간</span></div>' +
      '<div class="ent bad"><span class="t">오후 10:00</span><span class="n">' + bombSvg(18, '#F04452') + '독서</span><span class="m">폭발</span></div></div>';
  })();

  window.SCREENS = {
    tasks: ui(tasksScreen()),
    sheet: ui(sheetScreen),
    settings: ui(settingsScreen),
    plan: ui(planScreen()),
    shade: shadeScreen,
    calendar: ui(calScreen),
  };
})();
