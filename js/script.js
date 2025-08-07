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