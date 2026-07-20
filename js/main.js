(function () {
  'use strict';

  /* ---------- Inline SVG icons (Lucide, ISC) ---------- */
  var ICONS = {
    waves: '<path d="M2 12q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 19q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 5q2.5 2 5 0t5 0 5 0 5 0"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
    food: '<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/>',
    flame: '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    bike: '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>'
  };
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }
  document.querySelectorAll('.adv__ic').forEach(function (el) {
    var k = el.getAttribute('data-i');
    if (ICONS[k]) el.innerHTML = svg(ICONS[k]);
  });

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var scrim = document.getElementById('drawer-scrim');
  function setDrawer(open) {
    drawer.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setDrawer(!drawer.classList.contains('open'));
  });
  scrim.addEventListener('click', function () { setDrawer(false); });
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setDrawer(false); });
  });

  /* ---------- Smooth anchor scroll with header offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 0.06) + 's';
    io.observe(el);
  });

  /* ---------- Gallery lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var cells = Array.prototype.slice.call(document.querySelectorAll('.mosaic__cell'));
  var srcs = cells.map(function (c) { return c.getAttribute('data-src'); });
  var idx = 0;
  function openLB(i) {
    idx = (i + srcs.length) % srcs.length;
    lbImg.src = srcs[idx];
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  cells.forEach(function (c, i) { c.addEventListener('click', function () { openLB(i); }); });
  document.getElementById('lb-close').addEventListener('click', closeLB);
  document.getElementById('lb-next').addEventListener('click', function () { openLB(idx + 1); });
  document.getElementById('lb-prev').addEventListener('click', function () { openLB(idx - 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowRight') openLB(idx + 1);
    if (e.key === 'ArrowLeft') openLB(idx - 1);
  });

  /* Legal doc links (prototype) */
  document.querySelectorAll('.js-doc').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ================= BOOKING FLOW ================= */
  var modal = document.getElementById('modal');
  var htitle = document.getElementById('bk-htitle');
  var stepsEl = document.getElementById('bk-steps');

  var CATS = [
    { id: 1, name: 'Одноместный', max: 1, base: 4900, img: 'assets/img/room-single.jpg', area: '12 м²', feats: 'Wi-Fi · Телевизор · Кондиционер · Сейф · Фен' },
    { id: 2, name: 'Стандарт', max: 3, base: 6000, img: 'assets/img/room-standard.jpg', area: '18 м²', feats: 'Wi-Fi · Кондиционер · Сейф · Фен · Телевизор · Холодильник' },
    { id: 3, name: 'Полулюкс', max: 4, base: 8500, img: 'assets/img/room-junior.jpg', area: '20 м²', feats: 'Wi-Fi · Кондиционер · Халат · Телевизор · Сейф · Фен' },
    { id: 4, name: 'Семейный', max: 5, base: 12000, img: 'assets/img/room-family.jpg', area: '43 м²', feats: 'Wi-Fi · Кондиционер · Телевизор · Фен · Чайник · Душ · Сейф · Холодильник' }
  ];
  var PRICES = {
    '1-3-1': 5800, '1-4-1': 3800, '1-5-1': 5500, '1-6-1': 7000, '1-7-1': 9000, '1-8-1': 7000,
    '2-3-1': 5500, '2-4-1': 5500, '2-5-1': 8500, '2-6-1': 11500, '2-7-1': 14000, '2-8-1': 11500,
    '3-3-1': 5800, '3-4-1': 5800, '3-5-1': 9000, '3-6-1': 12000, '3-7-1': 15000, '3-8-1': 12000, '3-8-2': 12000, '3-8-3': 13800, '3-8-4': 14000,
    '4-3-2': 6300, '4-3-3': 6300, '4-3-4': 6300, '4-4-2': 5800, '4-4-3': 6300, '4-4-4': 6500, '4-5-2': 9000, '4-5-3': 9500, '4-5-4': 10000,
    '4-6-2': 12000, '4-6-3': 12500, '4-6-4': 13000, '4-7-2': 14500, '4-7-3': 15000, '4-7-4': 15500, '4-8-1': 12000, '4-8-2': 12000, '4-8-3': 12500, '4-8-4': 13000
  };
  function periodFor(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    if (m === 1 && day <= 10) return 11;
    if ((m === 1 && day >= 11) || m === 2) return 4;
    if (m === 3 || m === 4) return 3;
    if (m === 5) return 5;
    if (m === 6) return 6;
    if (m === 7 || m === 8) return 7;
    if (m === 9) return 8;
    if (m === 12 && day === 31) return 10;
    return 9;
  }
  function priceFor(cat, period, guests) {
    var exact = PRICES[cat.id + '-' + period + '-' + guests];
    if (exact != null) return exact;
    var best = null, bestd = 99;
    for (var g = 1; g <= 5; g++) {
      var p = PRICES[cat.id + '-' + period + '-' + g];
      if (p != null) { var dd = Math.abs(g - guests); if (dd < bestd) { bestd = dd; best = p; } }
    }
    return best != null ? best : cat.base;
  }
  var nf = new Intl.NumberFormat('ru-RU');
  function money(n) { return nf.format(n) + ' ₽'; }
  function plural(n, one, few, many) {
    var a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return few;
    return many;
  }
  function nightsW(n) { return plural(n, 'ночь', 'ночи', 'ночей'); }
  function guestsW(n) { return plural(n, 'гость', 'гостя', 'гостей'); }
  var MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  var MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  var WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  function fmtDate(d) { return d.getDate() + ' ' + MON[d.getMonth()]; }
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function midnight(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  var TODAY = midnight(new Date());

  var state = { mode: 'room', guests: 2, checkin: null, checkout: null, nights: 0 };
  var cal = { y: TODAY.getFullYear(), m: TODAY.getMonth() };

  /* ----- step / title / tabs ----- */
  function setTitle() {
    var cur = modal.querySelector('.bstep.is-active').getAttribute('data-step');
    var t = 'Выберите даты';
    if (cur === 'dates') t = state.mode === 'sauna' ? 'Бронирование сауны' : 'Выберите даты';
    else if (cur === 'cat') t = 'Доступные категории';
    else if (cur === 'contact') t = 'Ваши контакты';
    else if (cur === 'done') t = 'Бронирование';
    htitle.textContent = t;
    var showTabs = (cur === 'dates' && state.mode === 'room') || cur === 'cat' || cur === 'contact';
    stepsEl.style.display = showTabs ? 'flex' : 'none';
    var order = { dates: 0, cat: 1, contact: 2 };
    var ci = order[cur];
    stepsEl.querySelectorAll('.bk__stab').forEach(function (tab) {
      var ti = order[tab.getAttribute('data-tab')];
      tab.classList.toggle('is-active', ti === ci);
      tab.classList.toggle('is-done', ti < ci);
    });
  }
  function step(name) {
    modal.querySelectorAll('.bstep').forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-step') === name); });
    setTitle();
    var sc = modal.querySelector('.bk__scroll'); if (sc) sc.scrollTop = 0;
  }

  /* ----- open / close ----- */
  function openBooking(mode) {
    var m = mode === 'sauna' ? 'sauna' : 'room';
    state.mode = m;
    document.querySelectorAll('.bk__modebtn').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-mode') === m); });
    document.getElementById('bk-room-pane').hidden = m !== 'room';
    document.getElementById('bk-sauna-pane').hidden = m !== 'sauna';
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    step('dates');
    renderCal();
  }
  function closeBooking() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  document.querySelectorAll('.js-book').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openBooking(b.getAttribute('data-mode') || 'room'); });
  });
  document.getElementById('modal-close').addEventListener('click', closeBooking);
  document.getElementById('bk-close2').addEventListener('click', closeBooking);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeBooking(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeBooking(); });

  /* ----- mode toggle ----- */
  document.querySelectorAll('.bk__modebtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.mode = btn.getAttribute('data-mode');
      document.querySelectorAll('.bk__modebtn').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      document.getElementById('bk-room-pane').hidden = state.mode !== 'room';
      document.getElementById('bk-sauna-pane').hidden = state.mode !== 'sauna';
      setTitle();
    });
  });

  /* ----- guests stepper ----- */
  function setGuests(n) {
    state.guests = Math.max(1, Math.min(5, n));
    document.getElementById('bk-gval').textContent = state.guests;
    document.getElementById('bk-gword').textContent = guestsW(state.guests);
  }
  document.getElementById('bk-gminus').addEventListener('click', function () { setGuests(state.guests - 1); });
  document.getElementById('bk-gplus').addEventListener('click', function () { setGuests(state.guests + 1); });

  /* ----- calendar ----- */
  function minPriceDate(d) {
    var per = periodFor(d), min = Infinity;
    CATS.forEach(function (c) { var p = priceFor(c, per, 1); if (p < min) min = p; });
    return min;
  }
  function sameDay(a, b) { return a && b && a.getTime() === b.getTime(); }
  function renderCal() {
    var cel = document.getElementById('bk-cal');
    var offset = (new Date(cal.y, cal.m, 1).getDay() + 6) % 7;
    var dim = new Date(cal.y, cal.m + 1, 0).getDate();
    var atStart = (cal.y === TODAY.getFullYear() && cal.m === TODAY.getMonth());
    var html = '<div class="bk__calhead"><button type="button" class="bk__calnav" id="bk-prev"' + (atStart ? ' disabled' : '') + '>‹</button>' +
      '<span class="bk__calmonth">' + MONTHS[cal.m] + ' ' + cal.y + '</span>' +
      '<button type="button" class="bk__calnav" id="bk-next">›</button></div>';
    html += '<div class="bk__caldow">' + WD.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>';
    html += '<div class="bk__calgrid">';
    for (var i = 0; i < offset; i++) html += '<span class="bk__day is-empty"></span>';
    for (var day = 1; day <= dim; day++) {
      var d = new Date(cal.y, cal.m, day);
      var past = d < TODAY;
      var cls = 'bk__day' + (past ? ' is-past' : '');
      if (sameDay(d, state.checkin)) cls += ' is-edge is-start';
      if (sameDay(d, state.checkout)) cls += ' is-edge is-end';
      if (state.checkin && state.checkout && d > state.checkin && d < state.checkout) cls += ' is-in';
      var price = past ? '' : '<span class="bk__dprice">' + Math.round(minPriceDate(d) / 1000) + 'т</span>';
      html += '<button type="button" class="' + cls + '" data-d="' + day + '">' + day + price + '</button>';
    }
    html += '</div>';
    cel.innerHTML = html;
    document.getElementById('bk-prev').addEventListener('click', function () { if (!atStart) { cal.m--; if (cal.m < 0) { cal.m = 11; cal.y--; } renderCal(); } });
    document.getElementById('bk-next').addEventListener('click', function () { cal.m++; if (cal.m > 11) { cal.m = 0; cal.y++; } renderCal(); });
    cel.querySelectorAll('.bk__day:not(.is-past):not(.is-empty)').forEach(function (b) {
      b.addEventListener('click', function () { pickDay(new Date(cal.y, cal.m, parseInt(b.getAttribute('data-d'), 10))); });
    });
  }
  function pickDay(d) {
    if (!state.checkin || state.checkout) { state.checkin = d; state.checkout = null; }
    else if (d > state.checkin) { state.checkout = d; }
    else { state.checkin = d; }
    document.getElementById('bk-search').disabled = !(state.checkin && state.checkout);
    document.getElementById('bk-dates-err').textContent = '';
    renderCal();
  }

  /* ----- search / results ----- */
  document.getElementById('bk-search').addEventListener('click', function () {
    if (!state.checkin || !state.checkout) { document.getElementById('bk-dates-err').textContent = 'Выберите даты заезда и выезда.'; return; }
    state.nights = Math.round((state.checkout - state.checkin) / 86400000);
    step('cat'); runSearch();
  });
  function runSearch() {
    var loading = document.getElementById('bk-loading'), list = document.getElementById('bk-list'), empty = document.getElementById('bk-empty');
    loading.style.display = 'block'; list.innerHTML = ''; empty.style.display = 'none';
    document.getElementById('bk-summary').textContent =
      fmtDate(state.checkin) + ' → ' + fmtDate(state.checkout) + ' · ' + state.nights + ' ' + nightsW(state.nights) + ' · ' + state.guests + ' ' + guestsW(state.guests);
    setTimeout(function () {
      loading.style.display = 'none';
      var period = periodFor(state.checkin);
      var avail = CATS.filter(function (c) { return c.max >= state.guests; });
      if (!avail.length) { empty.style.display = 'block'; return; }
      avail.forEach(function (c) {
        var nightly = priceFor(c, period, state.guests), total = nightly * state.nights;
        var el = document.createElement('div'); el.className = 'bcard';
        el.innerHTML =
          '<div class="bcard__ph"><img src="' + c.img + '" alt=""></div>' +
          '<div class="bcard__info"><h4>' + c.name + '</h4>' +
          '<p class="bcard__meta">' + c.area + ' · до ' + c.max + ' ' + guestsW(c.max) + '</p>' +
          '<p class="bcard__feats">' + c.feats + '</p></div>' +
          '<div class="bcard__price"><p class="bcard__nightly">' + money(nightly) + ' <span>/ ночь</span></p>' +
          '<p class="bcard__total">' + state.nights + ' ' + nightsW(state.nights) + ' — <b>' + money(total) + '</b></p>' +
          '<button class="btn btn--gold btn--sm bcard__pick">Выбрать</button></div>';
        el.querySelector('.bcard__pick').addEventListener('click', function () { choose(c, nightly, total); });
        list.appendChild(el);
      });
    }, 600);
  }
  function choose(c, nightly, total) {
    document.getElementById('bk-chosen').innerHTML =
      '<div class="bchosen"><img src="' + c.img + '" alt="">' +
      '<div><h4>' + c.name + '</h4>' +
      '<p>' + fmtDate(state.checkin) + ' → ' + fmtDate(state.checkout) + ' · ' + state.nights + ' ' + nightsW(state.nights) + ' · ' + state.guests + ' ' + guestsW(state.guests) + '</p>' +
      '<p>' + money(nightly) + ' × ' + state.nights + ' ' + nightsW(state.nights) + '</p>' +
      '<p class="bchosen__total">Итого: <b>' + money(total) + '</b></p></div></div>';
    step('contact');
  }

  /* ----- tabs (go back) ----- */
  stepsEl.querySelectorAll('.bk__stab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var t = tab.getAttribute('data-tab');
      var order = { dates: 0, cat: 1, contact: 2 };
      var cur = modal.querySelector('.bstep.is-active').getAttribute('data-step');
      if (order[t] >= order[cur]) return;
      if (t === 'dates') step('dates');
      else if (t === 'cat' && state.nights > 0) step('cat');
    });
  });

  document.getElementById('bk-form').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('bk-done-msg').textContent = 'Спасибо за ваше бронирование. В ближайшее время с вами свяжется наш администратор для подтверждения.';
    step('done');
  });
  var saunaForm = document.getElementById('bk-sauna-form');
  var saunaDate = saunaForm.querySelector('input[name=date]');
  if (saunaDate) { saunaDate.value = iso(TODAY); saunaDate.min = iso(TODAY); }
  saunaForm.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('bk-done-msg').textContent = 'Спасибо! Заявка на сауну принята — администратор свяжется с вами для подтверждения времени.';
    step('done');
  });
  /* ================= ROOM DETAIL ================= */
  var DESCS = {
    1: 'Светлый номер для одного — всё необходимое, ничего лишнего. Удобная кровать, душ, чайник с чаем, Wi-Fi. Тихо, просто, спокойно.',
    2: 'Просторный номер с большой двуспальной кроватью и премиальным матрасом — для тех, кто ценит комфорт. Подходит для размещения от одного до трёх гостей. Wi-Fi, душ, чайник с чаем, всё необходимое рядом.',
    3: 'Номер с большой двуспальной кроватью и качественным матрасом, дополнительным спальным местом и возможностью выйти на балкон — в некоторых номерах открывается свой вид. Больше пространства, больше свободы.',
    4: 'Две кровати и отдельная гостиная — всё, чтобы каждый чувствовал себя дома. Места хватит на всех, а пространство позволяет отдыхать в своём ритме.'
  };
  var PERIODS = [
    { id: 11, name: '01–10 января', range: '01.01 — 10.01' },
    { id: 4, name: '10 января – 29 февраля', range: '10.01 — 29.02' },
    { id: 3, name: 'Март – Апрель', range: '01.03 — 30.04' },
    { id: 5, name: 'Май', range: '01.05 — 31.05' },
    { id: 6, name: 'Июнь', range: '01.06 — 30.06' },
    { id: 7, name: 'Июль – Август', range: '01.07 — 31.08' },
    { id: 8, name: 'Сентябрь', range: '01.09 — 30.09' },
    { id: 9, name: 'Октябрь – Декабрь', range: '01.10 — 30.12' },
    { id: 10, name: '31 декабря', range: '31.12' }
  ];
  function basePeriodPrice(cat, pid) {
    for (var g = 1; g <= 5; g++) { var p = PRICES[cat.id + '-' + pid + '-' + g]; if (p != null) return p; }
    return cat.base;
  }
  var rmodal = document.getElementById('rmodal');
  function openRoom(catId) {
    var c = CATS.filter(function (x) { return x.id === catId; })[0];
    if (!c) return;
    document.getElementById('rm-img').src = c.img;
    document.getElementById('rm-name').textContent = c.name;
    document.getElementById('rm-desc').textContent = DESCS[c.id] || '';
    document.getElementById('rm-guests').textContent = c.max === 1 ? '1 гость' : 'до ' + c.max + ' ' + guestsW(c.max);
    var chips = document.getElementById('rm-chips'); chips.innerHTML = '';
    c.feats.split(' · ').forEach(function (f) { var s = document.createElement('span'); s.className = 'rm__chip'; s.textContent = f; chips.appendChild(s); });
    var pr = document.getElementById('rm-prices'); pr.innerHTML = '';
    var min = Infinity;
    PERIODS.forEach(function (pd) {
      var price = basePeriodPrice(c, pd.id); if (price < min) min = price;
      var row = document.createElement('div'); row.className = 'rm__prow';
      row.innerHTML = '<div><div class="rm__pname">' + pd.name + '</div><div class="rm__prange">' + pd.range + '</div></div>' +
        '<div class="rm__pprice">' + money(price) + ' <span>/ сут</span></div>';
      pr.appendChild(row);
    });
    document.getElementById('rm-from').innerHTML = 'от <b>' + money(min) + '</b> <em>/ сут</em>';
    rmodal.classList.add('open'); rmodal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  }
  function closeRoom() { rmodal.classList.remove('open'); rmodal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  document.querySelectorAll('.room').forEach(function (room, i) {
    room.querySelectorAll('.js-room').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); openRoom(i + 1); });
    });
  });
  document.getElementById('rm-close').addEventListener('click', closeRoom);
  rmodal.addEventListener('click', function (e) { if (e.target === rmodal) closeRoom(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && rmodal.classList.contains('open')) closeRoom(); });
  document.getElementById('rm-book').addEventListener('click', function () { closeRoom(); openBooking('room'); });
})();
