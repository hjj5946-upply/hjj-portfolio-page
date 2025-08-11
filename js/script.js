// // 스크롤 시 부드럽게 이동하는 효과
// document.querySelectorAll('.category').forEach(category => {
//   category.addEventListener('click', () => {
//     const targetId = category.getAttribute('data-target');
//     const targetElement = document.getElementById(targetId);
//     if (targetElement) {
//       targetElement.scrollIntoView({ behavior: 'smooth' });
//     }
//   });
// });

// // 섹션 나타내기 애니메이션 (스크롤 시)
// const sections = document.querySelectorAll('section');

// const observerOptions = {
//     root: null, // 뷰포트를 기준으로
//     rootMargin: '0px',
//     threshold: 0.1 // 10%가 보이면 콜백 실행
// };

// const sectionObserver = new IntersectionObserver((entries, observer) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.style.opacity = '1';
//             entry.target.style.transform = 'translateY(0)';
//             observer.unobserve(entry.target); // 한 번만 실행되도록
//         }
//     });
// }, observerOptions);

// sections.forEach(section => {
//     section.style.opacity = '0';
//     section.style.transform = 'translateY(20px)';
//     section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
//     sectionObserver.observe(section);
// });

// const topBar = document.querySelector('.top-bar');
// window.addEventListener('scroll', () => {
//   if (window.scrollY > 0) {
//     topBar.classList.add('scrolled');
//   } else {
//     topBar.classList.remove('scrolled');
//   }
// });

// // 카테고리 클릭 시 해당 섹션으로 이동
// document.querySelectorAll('.category').forEach(category => {
//   category.addEventListener('click', () => {
//     const targetId = category.getAttribute('data-target');
//     const targetElement = document.getElementById(targetId);
//     if (targetElement) {
//       const headerOffset = 80; // 상단 고정바 높이 고려
//       const elementPosition = targetElement.getBoundingClientRect().top;
//       const offsetPosition = window.scrollY + elementPosition - headerOffset;

//       window.scrollTo({
//         top: offsetPosition,
//         behavior: 'smooth'
//       });
//     }
//   });
// });

// // 상단으로 스크롤 버튼
// const scrollTopBtn = document.getElementById('scrollTopBtn');
// const introSection = document.getElementById('intro');

// window.addEventListener('scroll', () => {
//   const scrollY = window.scrollY;
//   const introBottom = introSection.offsetTop + introSection.offsetHeight;

//   if (scrollY > introBottom) {
//     scrollTopBtn.classList.add('show');
//   } else {
//     scrollTopBtn.classList.remove('show');
//   }
// });

// scrollTopBtn.addEventListener('click', () => {
//   window.scrollTo({
//     top: 0,
//     behavior: 'smooth'
//   });
// });

// const logo = document.querySelector('.logo');
// const introSection2 = document.querySelector('#intro');

// window.addEventListener('scroll', () => {
//   const introBottom = introSection2.getBoundingClientRect().bottom;

//   if (introBottom <= 0) {
//     logo.classList.add('dark-logo');
//   } else {
//     logo.classList.remove('dark-logo');
//   }
// });

// (function(){
//   const slider  = document.querySelector('.proj-slider');
//   const track   = slider.querySelector('.track');
//   const slides  = Array.from(track.children);
//   const prevBtn = slider.querySelector('.prev');
//   const nextBtn = slider.querySelector('.next');
//   const currentEl = slider.querySelector('.counter .current');
//   const totalEl   = slider.querySelector('.counter .total');

//   let index = 0;
//   totalEl.textContent = String(slides.length);

//   const getStep = () =>
//     slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);

//   const goTo = (i) => {
//     index = Math.max(0, Math.min(i, slides.length - 1));
//     const x = -getStep() * index;
//     track.style.transform = `translateX(${x}px)`;
//     updateNav();
//     currentEl.textContent = String(index + 1);
//   };

//   const updateNav = () => {
//     const atStart = index === 0;
//     const atEnd   = index === slides.length - 1;
//     prevBtn.disabled = atStart;
//     nextBtn.disabled = atEnd;
//   };

//   prevBtn.addEventListener('click', ()=> goTo(index - 1));
//   nextBtn.addEventListener('click', ()=> goTo(index + 1));

//   // 스와이프
//   let startX = 0, currentX = 0, dragging = false, startTx = 0;
//   const onStart = (clientX) => { dragging = true; startX = clientX; startTx = -getStep() * index; track.style.transition = 'none'; };
//   const onMove  = (clientX) => { if(!dragging) return; currentX = clientX; const dx = currentX - startX; track.style.transform = `translateX(${startTx + dx}px)`; };
//   const onEnd   = () => {
//     if(!dragging) return; dragging = false; track.style.transition = '';
//     const dx = currentX - startX, threshold = getStep() * 0.25;
//     if (dx < -threshold && index < slides.length - 1) goTo(index + 1);
//     else if (dx > threshold && index > 0) goTo(index - 1);
//     else goTo(index);
//   };

//   track.addEventListener('mousedown', e => onStart(e.clientX));
//   window.addEventListener('mousemove', e => onMove(e.clientX));
//   window.addEventListener('mouseup', onEnd);
//   track.addEventListener('touchstart', e => onStart(e.touches[0].clientX), {passive:true});
//   track.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  {passive:true});
//   track.addEventListener('touchend', onEnd);

//   // 키보드 & 리사이즈
//   slider.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight') goTo(index+1); if(e.key==='ArrowLeft') goTo(index-1); });
//   slider.tabIndex = 0;
//   window.addEventListener('resize', ()=> goTo(index));

//   goTo(0);
// })();

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