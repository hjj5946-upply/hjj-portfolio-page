// 스크롤 시 부드럽게 이동하는 효과
document.querySelectorAll('.category').forEach(category => {
  category.addEventListener('click', () => {
    const targetId = category.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 섹션 나타내기 애니메이션 (스크롤 시)
const sections = document.querySelectorAll('section');

const observerOptions = {
    root: null, // 뷰포트를 기준으로
    rootMargin: '0px',
    threshold: 0.1 // 10%가 보이면 콜백 실행
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // 한 번만 실행되도록
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    sectionObserver.observe(section);
});

const topBar = document.querySelector('.top-bar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    topBar.classList.add('scrolled');
  } else {
    topBar.classList.remove('scrolled');
  }
});

// 카테고리 클릭 시 해당 섹션으로 이동
document.querySelectorAll('.category').forEach(category => {
  category.addEventListener('click', () => {
    const targetId = category.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 80; // 상단 고정바 높이 고려
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// 상단으로 스크롤 버튼
const scrollTopBtn = document.getElementById('scrollTopBtn');
const introSection = document.getElementById('intro');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const introBottom = introSection.offsetTop + introSection.offsetHeight;

  if (scrollY > introBottom) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const logo = document.querySelector('.logo');
const introSection2 = document.querySelector('#intro');

window.addEventListener('scroll', () => {
  const introBottom = introSection2.getBoundingClientRect().bottom;

  if (introBottom <= 0) {
    logo.classList.add('dark-logo');
  } else {
    logo.classList.remove('dark-logo');
  }
});








(function(){
  const slider  = document.querySelector('.proj-slider');
  const track   = slider.querySelector('.track');
  const slides  = Array.from(track.children);
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  const currentEl = slider.querySelector('.counter .current');
  const totalEl   = slider.querySelector('.counter .total');

  let index = 0;
  totalEl.textContent = String(slides.length);

  const getStep = () =>
    slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);

  const goTo = (i) => {
    index = Math.max(0, Math.min(i, slides.length - 1));
    const x = -getStep() * index;
    track.style.transform = `translateX(${x}px)`;
    updateNav();
    currentEl.textContent = String(index + 1);
  };

  const updateNav = () => {
    const atStart = index === 0;
    const atEnd   = index === slides.length - 1;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  };

  prevBtn.addEventListener('click', ()=> goTo(index - 1));
  nextBtn.addEventListener('click', ()=> goTo(index + 1));

  // 스와이프
  let startX = 0, currentX = 0, dragging = false, startTx = 0;
  const onStart = (clientX) => { dragging = true; startX = clientX; startTx = -getStep() * index; track.style.transition = 'none'; };
  const onMove  = (clientX) => { if(!dragging) return; currentX = clientX; const dx = currentX - startX; track.style.transform = `translateX(${startTx + dx}px)`; };
  const onEnd   = () => {
    if(!dragging) return; dragging = false; track.style.transition = '';
    const dx = currentX - startX, threshold = getStep() * 0.25;
    if (dx < -threshold && index < slides.length - 1) goTo(index + 1);
    else if (dx > threshold && index > 0) goTo(index - 1);
    else goTo(index);
  };

  track.addEventListener('mousedown', e => onStart(e.clientX));
  window.addEventListener('mousemove', e => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);
  track.addEventListener('touchstart', e => onStart(e.touches[0].clientX), {passive:true});
  track.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  {passive:true});
  track.addEventListener('touchend', onEnd);

  // 키보드 & 리사이즈
  slider.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight') goTo(index+1); if(e.key==='ArrowLeft') goTo(index-1); });
  slider.tabIndex = 0;
  window.addEventListener('resize', ()=> goTo(index));

  goTo(0);
})();