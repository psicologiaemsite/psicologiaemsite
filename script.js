/* ============================================================
   PSICOLOGIA EM SITE — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR (desktop only) ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');

  if (cursor && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
      cursor.style.transform = 'translate(-50%,-50%)';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      ring.style.transform = 'translate(-50%,-50%)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
        cursor.style.background = 'var(--clay)';
        ring.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.background = 'var(--sage)';
        ring.style.opacity = '.5';
      });
    });
  }

  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── NAV SCROLL EFFECT ── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ── MOBILE HAMBURGER / DRAWER ── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('navDrawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── REVEAL ON SCROLL ── */
  const reveals  = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObs.observe(el));

  /* ── COUNT-UP NUMBERS ── */
  function runCountUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    let current  = 0;
    const step   = target / 60;
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  const counters    = document.querySelectorAll('.count-up');
  const counterObs  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        runCountUp(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked (if it wasn't open)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── MARQUEE PAUSE ON HOVER ── */
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

});

/* ════════════════════════════════════════
   DEVICE SWITCHER & PREVIEW MODAL
════════════════════════════════════════ */
(function() {
  const DEMO_SRC = 'demo/index.html';

  /* ── Inline device tabs ── */
  const tabs   = document.querySelectorAll('.device-tab');
  const frames = { desktop: document.getElementById('dfDesktop'), tablet: document.getElementById('dfTablet'), mobile: document.getElementById('dfMobile') };
  const iframes = { desktop: document.getElementById('iframeDesktop'), tablet: document.getElementById('iframeTablet'), mobile: document.getElementById('iframeMobile') };
  const stage  = document.getElementById('deviceStage');
  let loaded   = { desktop: true, tablet: false, mobile: false }; // desktop pre-loaded via src attr

  function switchDevice(device) {
    // Update tabs
    tabs.forEach(t => t.classList.toggle('active', t.dataset.device === device));
    // Update frames
    Object.keys(frames).forEach(k => {
      if (frames[k]) frames[k].classList.toggle('active', k === device);
    });
    // Lazy-load iframes
    if (!loaded[device] && iframes[device]) {
      iframes[device].src = DEMO_SRC;
      loaded[device] = true;
    }
    // Update stage min-height attribute
    if (stage) stage.dataset.active = device;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchDevice(tab.dataset.device));
  });

  // Expand desktop iframe button
  const desktopExpandBtn = document.getElementById('desktopExpandBtn');
  if (desktopExpandBtn) {
    desktopExpandBtn.addEventListener('click', () => openModal('desktop'));
  }

  /* ── Modal ── */
  const modal       = document.getElementById('previewModal');
  const modalClose  = document.getElementById('modalClose');
  const modalOverlay= document.getElementById('modalOverlay');
  const iframeModal = document.getElementById('iframeModal');
  const modalWrap   = document.getElementById('modalDeviceWrap');
  const mTabs       = document.querySelectorAll('.modal-dtab');
  const btnExpand   = document.getElementById('btnExpandModal');

  let modalLoaded = false;

  function openModal(device = 'desktop') {
    if (!modal) return;
    if (!modalLoaded) { iframeModal.src = DEMO_SRC; modalLoaded = true; }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setModalDevice(device);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function setModalDevice(device) {
    mTabs.forEach(t => t.classList.toggle('active', t.dataset.mdevice === device));
    if (!modalWrap) return;
    modalWrap.className = 'modal-device-wrap m-' + device;
  }

  if (btnExpand)    btnExpand.addEventListener('click',   () => openModal('desktop'));
  if (modalClose)   modalClose.addEventListener('click',  closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  mTabs.forEach(t => {
    t.addEventListener('click', () => setModalDevice(t.dataset.mdevice));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();
