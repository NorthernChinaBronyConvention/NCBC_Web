console.log('我是叨叨，这个网站的搭建者，你既然通过翻日志看到了这个消息，那么……来玩EQAD喵~来玩EQAD谢谢喵~ 群号：859298157');
console.log('🥵🥵烧叨艾草！');

window.addEventListener('load', function () {
    setTimeout(function () {
        document.body.classList.add('loaded');
        const loaderText = document.querySelector('.loader-text-left');
        if (loaderText) {
            loaderText.textContent = '// Done';
        }
    }, 500);
});

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
let lastScrollY = window.scrollY;
let ticking = false;

function isMobile() {
    return window.innerWidth < 768;
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        nav.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        nav.classList.remove('scrolled');
    }

    if (!ticking) {
        window.requestAnimationFrame(function () {
            updateHeaderVisibility();
            ticking = false;
        });
        ticking = true;
    }
}

function updateHeaderVisibility() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('hidden');
    }
    else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
}

const navLinks = document.querySelectorAll('.nav a[href^="#"]');

function highlightNavOnScroll() {
    const isDisabledNav = window.isDisabledNav === true;

    if (isDisabledNav) {
        return;
    }

    const scrollPosition = window.scrollY;

    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            const activeLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });

    if (scrollPosition < 50) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('.nav a[href="#"]').classList.add('active');
    }
}

window.addEventListener('scroll', highlightNavOnScroll);

document.addEventListener('DOMContentLoaded', highlightNavOnScroll);

let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');

        if (targetId === '#') {
            if (lenis) {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            if (lenis) {
                lenis.scrollTo(targetElement, { offset: -80 });
            } else {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }

        navLinks.forEach(navLink => {
            navLink.classList.remove('active');
        });
        this.classList.add('active');
    });
});

const customCursor = document.getElementById('customCursor');

function updateCursorPosition(e) {
    if (customCursor && !isMobile()) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
        customCursor.classList.add('visible');
    }
}

function handleLinkHover() {
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item');
    const disabledPaginationBtns = document.querySelectorAll('.pagination-btn:disabled');

    interactiveElements.forEach(element => {
        if (element.classList.contains('pagination-btn') && element.disabled) {
            return;
        }

        element.addEventListener('mouseenter', () => {
            if (customCursor) {
                customCursor.classList.add('hover');
                customCursor.classList.remove('disabled');
            }
        });

        element.addEventListener('mouseleave', () => {
            if (customCursor) {
                customCursor.classList.remove('hover');
                customCursor.classList.remove('disabled');
            }
        });
    });

    disabledPaginationBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (customCursor) {
                customCursor.classList.add('disabled');
                customCursor.classList.remove('hover');
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (customCursor) {
                customCursor.classList.remove('disabled');
                customCursor.classList.remove('hover');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('mousemove', updateCursorPosition);

    document.addEventListener('mousedown', () => {
        if (customCursor) {
            customCursor.classList.add('active');
        }
    });

    document.addEventListener('mouseup', () => {
        if (customCursor) {
            customCursor.classList.remove('active');
        }
    });

    document.addEventListener('mouseleave', () => {
        if (customCursor && !isMobile()) {
            customCursor.classList.remove('active');
            customCursor.classList.remove('visible');
        }
    });

    window.addEventListener('resize', () => {
        if (customCursor) {
            customCursor.style.left = window.innerWidth / 2 + 'px';
            customCursor.style.top = window.innerHeight / 2 + 'px';
        }
    });

    if (customCursor) {
        customCursor.style.left = window.innerWidth / 2 + 'px';
        customCursor.style.top = window.innerHeight / 2 + 'px';
    }

    handleLinkHover();
});

function generateStars() {
    const footer = document.querySelector('.footer');
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 2;
        const animationDuration = Math.random() * 1 + 1.5;

        star.style.top = `${top}%`;
        star.style.left = `${left}%`;
        star.style.opacity = `0`;
        star.style.animationDelay = `${animationDelay}s`;
        star.style.animationDuration = `${animationDuration}s`;

        footer.appendChild(star);
    }
}

document.addEventListener('DOMContentLoaded', generateStars);

document.addEventListener('DOMContentLoaded', function () {
    const heroBgLeftImage = document.querySelector('.hero-bg-left-image');
    const heroBirdsImage = document.querySelector('.hero-birds-image');
    const heroMascot1Image = document.querySelector('.hero-mascot1-image');
    const heroMascot2Image = document.querySelector('.hero-mascot2-image');
    const heroMascot3Image = document.querySelector('.hero-mascot3-image');
    const heroMascotCImage = document.querySelector('.hero-mascot-c-image');
    const heroMascot4Image = document.querySelector('.hero-mascot4-image');
    const heroSubtitle1 = document.querySelector('.hero-subtitle1');
    const heroSubtitle2 = document.querySelector('.hero-subtitle2');
    const heroTitle1 = document.querySelector('.hero-title1');
    const heroTitle2 = document.querySelector('.hero-title2');
    const heroTitle3 = document.querySelector('.hero-title3');
    const hero = document.querySelector('.hero');

    function resetParallaxElements() {
        if (heroBgLeftImage) {
            heroBgLeftImage.style.transform = '';
        }
        if (heroBirdsImage) {
            heroBirdsImage.style.transform = '';
        }
        if (heroMascot1Image) {
            heroMascot1Image.style.transform = '';
        }
        if (heroMascot2Image) {
            heroMascot2Image.style.transform = '';
        }
        if (heroMascot3Image) {
            heroMascot3Image.style.transform = '';
        }
        if (heroMascotCImage) {
            heroMascotCImage.style.transform = '';
        }
        if (heroMascot4Image) {
            heroMascot4Image.style.transform = '';
        }
        if (heroSubtitle1) {
            heroSubtitle1.style.transform = '';
        }
        if (heroSubtitle2) {
            heroSubtitle2.style.transform = '';
        }
        if (heroTitle1) {
            heroTitle1.style.transform = '';
        }
        if (heroTitle2) {
            heroTitle2.style.transform = '';
        }
        if (heroTitle3) {
            heroTitle3.style.transform = '';
        }
    }

    const merchScene = document.getElementById('merchScene');
    if (merchScene) {
        const merchLayers = document.querySelectorAll('.merch-layer');

        merchScene.addEventListener('mousemove', (e) => {
            const rect = merchScene.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            merchLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                const moveX = percentX * speed * 20;
                const moveY = percentY * speed * 20;

                layer.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
            });
        });

    }

    if (hero) {
        let heroRect = hero.getBoundingClientRect();
        let heroCenterX = heroRect.width / 2;
        let heroCenterY = heroRect.height / 2;

        const bgParallaxIntensity = 7;
        const birdsParallaxIntensity = 8;
        const mascot1ParallaxIntensity = 10;
        const mascot2ParallaxIntensity = 12;
        const mascot3ParallaxIntensity = 14;
        const mascot4ParallaxIntensity = 18;
        const mascotCParallaxIntensity = 16;
        const titleParallaxIntensity = 10;

        let currentMouseX = window.innerWidth / 2;
        let currentMouseY = window.innerHeight / 2;

        if (isMobile()) {
            resetParallaxElements();
        }

        function updateParallaxEffect() {
            if (isMobile()) {
                resetParallaxElements();
                return;
            }

            heroRect = hero.getBoundingClientRect();

            if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) {
                return;
            }

            const relMouseX = currentMouseX - heroRect.left;
            const relMouseY = currentMouseY - heroRect.top;

            const offsetX = (relMouseX - heroCenterX) / heroCenterX;
            const offsetY = (relMouseY - heroCenterY) / heroCenterY;

            const bgMoveX = offsetX * bgParallaxIntensity;
            const bgMoveY = offsetY * bgParallaxIntensity;

            const birdsMoveX = offsetX * birdsParallaxIntensity;
            const birdsMoveY = offsetY * birdsParallaxIntensity;
            const mascot1MoveX = offsetX * mascot1ParallaxIntensity;
            const mascot1MoveY = offsetY * mascot1ParallaxIntensity;
            const mascot2MoveX = offsetX * mascot2ParallaxIntensity;
            const mascot2MoveY = offsetY * mascot2ParallaxIntensity;
            const mascot3MoveX = offsetX * mascot3ParallaxIntensity;
            const mascot3MoveY = offsetY * mascot3ParallaxIntensity;
            const mascot4MoveX = offsetX * mascot4ParallaxIntensity;
            const mascot4MoveY = offsetY * mascot4ParallaxIntensity;
            const mascotCMoveX = offsetX * mascotCParallaxIntensity;
            const mascotCMoveY = offsetY * mascotCParallaxIntensity;

            const titleMoveX = offsetX * titleParallaxIntensity;
            const titleMoveY = offsetY * titleParallaxIntensity;

            if (heroBgLeftImage) {
                heroBgLeftImage.style.transform = `translate(${bgMoveX}px, ${bgMoveY}px)`;
            }

            if (heroBirdsImage) {
                heroBirdsImage.style.transform = `translate(${birdsMoveX}px, ${birdsMoveY}px)`;
            }

            if (heroMascot1Image) {
                heroMascot1Image.style.transform = `translate(${mascot1MoveX}px, ${mascot1MoveY}px)`;
            }

            if (heroMascot2Image) {
                heroMascot2Image.style.transform = `translate(${mascot2MoveX}px, ${mascot2MoveY}px)`;
            }

            if (heroMascot3Image) {
                heroMascot3Image.style.transform = `translate(${mascot3MoveX}px, ${mascot3MoveY}px)`;
            }

            if (heroMascotCImage) {
                heroMascotCImage.style.transform = `translate(${mascotCMoveX}px, ${mascotCMoveY}px)`;
            }

            if (heroMascot4Image) {
                heroMascot4Image.style.transform = `translate(${mascot4MoveX}px, ${mascot4MoveY}px)`;
            }

            if (heroSubtitle1) {
                heroSubtitle1.style.transform = `translate(${titleMoveX}px, ${titleMoveY}px)`;
            }

            if (heroSubtitle2) {
                heroSubtitle2.style.transform = `translate(${titleMoveX}px, ${titleMoveY}px)`;
            }

            if (heroTitle1) {
                heroTitle1.style.transform = `translate(${titleMoveX}px, ${titleMoveY}px)`;
            }

            if (heroTitle2) {
                heroTitle2.style.transform = `translate(${titleMoveX}px, ${titleMoveY}px)`;
            }

            if (heroTitle3) {
                heroTitle3.style.transform = `translate(${titleMoveX}px, ${titleMoveY}px)`;
            }
        }

        document.addEventListener('mousemove', function (e) {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
            updateParallaxEffect();
        });

        window.addEventListener('scroll', function () {
            updateParallaxEffect();
        });

        window.addEventListener('resize', function () {
            heroRect = hero.getBoundingClientRect();
            heroCenterX = heroRect.width / 2;
            heroCenterY = heroRect.height / 2;

            if (isMobile()) {
                resetParallaxElements();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const targetDate = new Date('August 1, 2026 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.querySelector('.countdown-container').innerHTML = '<div class="countdown-content"><h2 class="countdown-title">活动已经开始！</h2></div>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        const newValues = [
            days.toString().padStart(2, '0'),
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ];

        const elements = [daysEl, hoursEl, minutesEl, secondsEl];

        elements.forEach((el, index) => {
            if (el && newValues[index] !== el.textContent) {
                el.classList.add('updating');

                setTimeout(() => {
                    el.textContent = newValues[index];
                    el.classList.remove('updating');
                }, 150);
            }
        });
    }

    updateCountdown();

    setInterval(updateCountdown, 1000);
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    document.addEventListener('click', function (event) {
        if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
});
