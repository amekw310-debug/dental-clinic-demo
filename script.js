/* ============================================================
   Smile Dental Clinic - script.js
   機能:
     1. ハンバーガーメニューの開閉
     2. ヘッダーのスクロール時シャドウ
     3. 固定CTA・ページトップボタンの表示制御
     4. スクロール時のフェードイン表示
     5. フッターの年号自動更新
============================================================ */

(() => {
  'use strict';

  /* ------------------------------
     1. ハンバーガーメニューの開閉
  ------------------------------ */
  const menuBtn = document.getElementById('menu-btn');
  const gnav = document.getElementById('gnav');

  const closeMenu = () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    gnav.classList.remove('is-open');
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
    gnav.classList.toggle('is-open', !isOpen);
  });

  // ナビ内のリンクを押したら閉じる(アンカー移動のため)
  gnav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  // Escキーでも閉じられるように
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  /* ------------------------------
     2〜3. スクロールに応じた表示制御
  ------------------------------ */
  const header = document.getElementById('header');
  const fixedCta = document.getElementById('fixed-cta');
  const toTopBtn = document.getElementById('to-top');
  const hero = document.querySelector('.hero');
  const contact = document.getElementById('contact');

  const onScroll = () => {
    const scrollY = window.scrollY;

    // ヘッダーに影をつける
    header.classList.toggle('is-scrolled', scrollY > 10);

    // ヒーローを過ぎたら固定CTAとページトップボタンを表示。
    // お問い合わせセクションが見えている間はCTAを重複表示しない。
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    const contactVisible =
      contact.getBoundingClientRect().top < window.innerHeight * 0.8;
    const showCta = scrollY > heroBottom - 200 && !contactVisible;

    fixedCta.classList.toggle('is-visible', showCta);
    fixedCta.setAttribute('aria-hidden', String(!showCta));
    toTopBtn.classList.toggle('is-visible', scrollY > heroBottom);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ページトップへ戻る
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------
     4. スクロール時のフェードイン表示
  ------------------------------ */
  const fadeTargets = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    fadeTargets.forEach((el) => observer.observe(el));
  } else {
    // 非対応ブラウザではそのまま表示
    fadeTargets.forEach((el) => el.classList.add('is-inview'));
  }

  /* ------------------------------
     5. フッターの年号自動更新
  ------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------
     6. 予約カレンダー(デモ)
  ------------------------------ */
  const calMonthEl = document.getElementById('cal-month');
  const calGridEl = document.getElementById('cal-grid');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');
  const slotsBox = document.getElementById('booking-slots');
  const slotsLabel = document.getElementById('booking-slots-label');
  const slotsList = document.getElementById('booking-slots-list');
  const stepDate = document.getElementById('booking-step-date');
  const doneBox = document.getElementById('booking-done');
  const doneText = document.getElementById('booking-done-text');
  const againBtn = document.getElementById('booking-again');

  const CLOSED_DAYS = [0, 4]; // 日曜・木曜は休診(祝日は簡略化のため未考慮)
  const BOOKABLE_DAYS_AHEAD = 60; // 翌日から60日先まで予約可能(デモ)
  const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

  const startOfDay = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = () => startOfDay(new Date());
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };
  const minDate = () => addDays(today(), 1);
  const maxDate = () => addDays(today(), BOOKABLE_DAYS_AHEAD);

  let viewYear;
  let viewMonth; // 0始まり
  let selectedDate = null;

  const isBookable = (date) =>
    date >= minDate() && date <= maxDate() && !CLOSED_DAYS.includes(date.getDay());

  const formatDate = (date) =>
    `${date.getMonth() + 1}月${date.getDate()}日(${WEEKDAY_LABELS[date.getDay()]})`;

  // 診療時間に合わせた30分刻みの時間枠(最終受付は診療終了の30分前)
  const buildSlots = (date) => {
    const slots = [];
    const push = (fromH, fromM, toH, toM) => {
      let minutes = fromH * 60 + fromM;
      const end = toH * 60 + toM;
      while (minutes <= end) {
        slots.push(`${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`);
        minutes += 30;
      }
    };
    push(9, 0, 12, 30); // 午前 9:00〜13:00
    if (date.getDay() === 6) {
      push(14, 0, 16, 30); // 土曜午後 14:00〜17:00
    } else {
      push(14, 30, 18, 0); // 平日午後 14:30〜18:30
    }
    return slots;
  };

  const renderSlots = (date) => {
    slotsLabel.textContent = `${formatDate(date)}の空き時間`;
    slotsList.innerHTML = '';
    buildSlots(date).forEach((time) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'booking-slots__slot';
      btn.textContent = time;
      btn.addEventListener('click', () => {
        doneText.textContent = `${formatDate(date)} ${time} のご予約を受け付けました。`;
        stepDate.hidden = true;
        doneBox.hidden = false;
      });
      slotsList.appendChild(btn);
    });
    slotsBox.hidden = false;
  };

  const renderCalendar = () => {
    calMonthEl.textContent = `${viewYear}年${viewMonth + 1}月`;
    calGridEl.innerHTML = '';

    // 曜日ヘッダー
    WEEKDAY_LABELS.forEach((label) => {
      const cell = document.createElement('span');
      cell.className = 'calendar__weekday';
      cell.textContent = label;
      calGridEl.appendChild(cell);
    });

    // 1日までの空きマス
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    for (let i = 0; i < firstDay; i += 1) {
      calGridEl.appendChild(document.createElement('span'));
    }

    // 日付ボタン
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(viewYear, viewMonth, day);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calendar__day';
      btn.textContent = day;
      if (date.getTime() === today().getTime()) {
        btn.classList.add('is-today');
      }
      if (selectedDate && date.getTime() === selectedDate.getTime()) {
        btn.classList.add('is-selected');
      }
      if (isBookable(date)) {
        btn.addEventListener('click', () => {
          selectedDate = date;
          renderCalendar();
          renderSlots(date);
        });
      } else {
        btn.disabled = true;
      }
      calGridEl.appendChild(btn);
    }

    // 前月・翌月ボタンは予約可能な範囲の月だけ移動できる
    const now = today();
    const max = maxDate();
    calPrevBtn.disabled =
      viewYear === now.getFullYear() && viewMonth === now.getMonth();
    calNextBtn.disabled =
      viewYear === max.getFullYear() && viewMonth === max.getMonth();
  };

  const moveMonth = (diff) => {
    const moved = new Date(viewYear, viewMonth + diff, 1);
    viewYear = moved.getFullYear();
    viewMonth = moved.getMonth();
    renderCalendar();
  };

  calPrevBtn.addEventListener('click', () => moveMonth(-1));
  calNextBtn.addEventListener('click', () => moveMonth(1));

  const resetBooking = () => {
    const now = today();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
    selectedDate = null;
    slotsBox.hidden = true;
    doneBox.hidden = true;
    stepDate.hidden = false;
    renderCalendar();
  };

  againBtn.addEventListener('click', resetBooking);

  /* ------------------------------
     7. 予約・電話モーダルの開閉
  ------------------------------ */
  const bookingModal = document.getElementById('booking-modal');
  const telModal = document.getElementById('tel-modal');
  let lastFocused = null;

  const openModal = (modal) => {
    modal.hidden = false;
    document.body.classList.add('is-modal-open');
    modal.querySelector('.modal__close').focus();
  };

  const closeModal = (modal) => {
    modal.hidden = true;
    document.body.classList.remove('is-modal-open');
    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  };

  // 起動ボタン(WEB予約はカレンダー、電話番号は電話モーダルを開く)
  document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const modal = document.getElementById(trigger.dataset.modalTarget);
      if (!modal) return;
      event.preventDefault();
      lastFocused = trigger;
      if (modal === bookingModal) {
        resetBooking();
      }
      openModal(modal);
    });
  });

  // 閉じる(×ボタン・オーバーレイ・完了画面の閉じるボタン)
  [bookingModal, telModal].forEach((modal) => {
    modal.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', () => closeModal(modal));
    });
  });

  // Escキーで閉じる
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    [bookingModal, telModal].forEach((modal) => {
      if (!modal.hidden) closeModal(modal);
    });
  });
})();
