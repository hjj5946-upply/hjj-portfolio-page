// 스크롤 시 부드럽게 이동하는 효과
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // 기본 앵커 동작 방지

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // 네비게이션 바 높이 고려하여 조정
                behavior: 'smooth' // 부드러운 스크롤
            });
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