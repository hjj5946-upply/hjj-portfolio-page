// ========== util ==========
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const topBar = $('.top-bar');
const intro  = $('#intro');

const headerOffset = () => (topBar ? topBar.getBoundingClientRect().height : 0);

// ========== 1) 카테고리 클릭 → 부드러운 스크롤(헤더 보정) ==========
$$('.category').forEach(el => {
  el.addEventListener('click', () => {
    const id = el.getAttribute('data-target');
    const target = id && document.getElementById(id);
    if (!target) return;

    const y = window.scrollY + target.getBoundingClientRect().top - headerOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// ========== 2) 섹션 페이드인 (IntersectionObserver) ==========
const sections = $$('section');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

sections.forEach(s => {
  s.style.opacity = '0';
  s.style.transform = 'translateY(20px)';
  s.style.transition = 'opacity .6s ease-out, transform .6s ease-out';
  io.observe(s);
});

// ========== 3) 스크롤 반응(상단바, 탑버튼, 로고 색) ==========
const scrollTopBtn = $('#scrollTopBtn');
const logo = $('.logo');

function onScroll() {
  const y = window.scrollY;

  // 상단바 배경/그림자
  if (y > 0) topBar?.classList.add('scrolled');
  else topBar?.classList.remove('scrolled');

  // 탑버튼: intro 하단 지나면 표시
  if (intro && scrollTopBtn) {
    const introBottom = intro.offsetTop + intro.offsetHeight;
    if (y > introBottom) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');
  }

  // 로고 색: intro 영역 벗어나면 dark
  if (intro && logo) {
    const introBottomInViewport = intro.getBoundingClientRect().bottom;
    if (introBottomInViewport <= 0) logo.classList.add('dark-logo');
    else logo.classList.remove('dark-logo');
  }
}

// 초기 상태 동기화 + 스크롤 구독
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// 탑버튼 클릭
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 리사이즈 시 헤더 높이 변화 보정
window.addEventListener('resize', () => {
  // 스크롤 상태 재계산
  onScroll();
});




// ========== 4) Works 슬라이더(화살표·스와이프·카운터) ==========
(function(){
  const slider  = $('.proj-slider');
  if (!slider) return;

  const track   = $('.track', slider);
  const slides  = $$('.slide', track);
  const prevBtn = $('.prev', slider);
  const nextBtn = $('.next', slider);
  const curEl   = $('.counter .current', slider);
  const totEl   = $('.counter .total', slider);

  if (!track || slides.length === 0) return;

  let index = 0;
  const gapPx = () => parseFloat(getComputedStyle(track).gap || '0');
  const step  = () => slides[0].getBoundingClientRect().width + gapPx();

  // 카운터
  if (totEl) totEl.textContent = String(slides.length);
  const syncCounter = () => { if (curEl) curEl.textContent = String(index + 1); };

  const goTo = (i) => {
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transform = `translateX(${-step() * index}px)`;
    updateNav();
    syncCounter();
  };

  const updateNav = () => {
    if (prevBtn) { prevBtn.disabled = index === 0; prevBtn.style.opacity = prevBtn.disabled ? .35 : 1; }
    if (nextBtn) { nextBtn.disabled = index === slides.length - 1; nextBtn.style.opacity = nextBtn.disabled ? .35 : 1; }
  };

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  // 스와이프
  let startX = 0, currentX = 0, dragging = false, startTx = 0;

  const startDrag = (clientX) => {
    dragging = true;
    startX = currentX = clientX;
    startTx = -step() * index;
    track.style.transition = 'none';
    // 드래그 중 텍스트 선택 방지
    document.body.style.userSelect = 'none';
    document.body.style.touchAction = 'pan-y';
  };

  const moveDrag = (clientX) => {
    if (!dragging) return;
    currentX = clientX;
    const dx = currentX - startX;
    track.style.transform = `translateX(${startTx + dx}px)`;
  };

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    const dx = currentX - startX;
    const threshold = step() * 0.25;

    if (dx < -threshold && index < slides.length - 1) goTo(index + 1);
    else if (dx > threshold && index > 0) goTo(index - 1);
    else goTo(index);

    document.body.style.userSelect = '';
    document.body.style.touchAction = '';
  };

  // 마우스
  track.addEventListener('mousedown', e => startDrag(e.clientX));
  window.addEventListener('mousemove', e => moveDrag(e.clientX));
  window.addEventListener('mouseup', endDrag);

  // 터치
  track.addEventListener('touchstart', e => startDrag(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove',  e => moveDrag(e.touches[0].clientX),  { passive: true });
  track.addEventListener('touchend', endDrag);

  // 키보드
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft')  goTo(index - 1);
  });
  slider.tabIndex = 0;

  // 리사이즈 시 위치 재계산
  window.addEventListener('resize', () => goTo(index));

  // 초기화
  goTo(0);
})();
