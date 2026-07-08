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
})();
