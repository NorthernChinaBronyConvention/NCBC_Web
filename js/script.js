console.log('我是叨叨，这个网站的搭建者，你既然通过翻日志看到了这个消息，那么……来玩EQAD喵~来玩EQAD谢谢喵~ 群号：859298157');
console.log('🥵🥵烧叨艾草！');

let lenis;
let isNavigating = false;
window.isProgrammaticScroll = false;

const releaseScrollLock = () => {
    window.isProgrammaticScroll = false;
};
window.addEventListener('wheel', releaseScrollLock, { passive: true });
window.addEventListener('touchmove', releaseScrollLock, { passive: true });
window.addEventListener('mousedown', releaseScrollLock, { passive: true });
window.addEventListener('keydown', releaseScrollLock, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    if (document.readyState === 'loading') {
        startLoaderAnimation();
    } else {
        startLoaderAnimation();
    }

    window.addEventListener('load', () => {
        finishLoading();
    });

    initPage();
});

document.addEventListener('click', handleLinkClick);

window.addEventListener('popstate', handlePopState);

function handleLinkClick(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    if (!href ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target === '_blank' ||
        link.hasAttribute('download')) {

        if (href.startsWith('#')) {
            e.preventDefault();
            window.isProgrammaticScroll = true;
            const header = document.querySelector('.header');
            if (header) header.classList.remove('hidden');

            const scrollComplete = () => {
                setTimeout(() => {
                    window.isProgrammaticScroll = false;
                }, 100);
            };

            if (href === '#') {
                if (lenis) lenis.scrollTo(0, { onComplete: scrollComplete });
                else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    scrollComplete();
                }
            } else {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    if (lenis) lenis.scrollTo(targetElement, { offset: -80, onComplete: scrollComplete });
                    else {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        scrollComplete();
                    }

                    document.querySelectorAll('.nav a').forEach(navLink => navLink.classList.remove('active'));
                    link.classList.add('active');
                } else {
                    window.isProgrammaticScroll = false;
                }
            }
            return;
        }
        return;
    }

    const isExternal = (href.indexOf('://') > 0 || href.indexOf('//') === 0) && !href.includes(window.location.hostname);

    if (!isExternal) {
        e.preventDefault();
        navigateTo(href);
    }
}

function handlePopState(e) {
    navigateTo(window.location.href, false);
}

async function navigateTo(url, pushState = true) {
    if (isNavigating) return;
    isNavigating = true;

    document.body.classList.remove('loaded');
    const loaderText = document.querySelector('.loader-text-left');
    if (loaderText) {
        loaderText.textContent = '// Loading...';
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();

        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        await new Promise(resolve => setTimeout(resolve, 500));

        document.title = newDoc.title;

        const newBodyContent = newDoc.body.innerHTML;
        document.body.innerHTML = newBodyContent;

        if (pushState) {
            window.history.pushState({}, '', url);
        }

        initPage();

        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
            const hash = url.substring(hashIndex);
            if (hash !== '#') {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    if (lenis) {
                        lenis.scrollTo(targetElement, { offset: -80, immediate: true });
                    } else {
                        targetElement.scrollIntoView();
                    }
                }
            } else {
                if (lenis) lenis.scrollTo(0, { immediate: true });
                else window.scrollTo(0, 0);
            }
        } else {
            window.scrollTo(0, 0);
            if (lenis) lenis.scrollTo(0, { immediate: true });
        }

        finishLoading();

    } catch (error) {
        window.location.href = url;
    } finally {
        isNavigating = false;
    }
}

function finishLoading() {
    setTimeout(function () {
        document.body.classList.add('loaded');
        document.body.classList.add('hero-loaded');
        const loaderText = document.querySelector('.loader-text-left');
        if (loaderText) {
            loaderText.textContent = '// Done';
        }
        startLoaderAnimation();
    }, 800);
}

function initPage() {
    startLoaderAnimation();
    initCommon();
    initLenis();
    initCursor();
    initStars();
    initNav();

    const path = window.location.pathname;

    if (document.querySelector('.hero') || path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        initHome();
    }

    if (document.querySelector('.gallery-container') || path.includes('gallery.html')) {
        initGallery();
    }
}

function startLoaderAnimation() {
    const loaderBg = document.getElementById('loader-bg');
    if (loaderBg) {
        if (window.loaderInterval) clearInterval(window.loaderInterval);

        let binaryString = '';
        for (let i = 0; i < 20000; i++) {
            binaryString += Math.random() > 0.5 ? '1' : '0';
        }
        loaderBg.textContent = binaryString;

        window.loaderInterval = setInterval(() => {
            if (!document.getElementById('loader-bg')) {
                clearInterval(window.loaderInterval);
                return;
            }

            let newBinaryString = '';
            for (let i = 0; i < 20000; i++) {
                newBinaryString += Math.random() > 0.5 ? '1' : '0';
            }
            loaderBg.textContent = newBinaryString;

            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            loaderBg.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 100);
    }
}

function initLenis() {
    if (typeof Lenis !== 'undefined') {
        if (lenis) lenis.destroy();

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
}

function initNav() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav a');

    if (!header || !nav) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            nav.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            nav.classList.remove('scrolled');
        }

        if (!ticking) {
            window.requestAnimationFrame(function () {
                const currentScrollY = window.scrollY;
                if (!window.isProgrammaticScroll) {
                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        header.classList.add('hidden');
                    } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
                        header.classList.remove('hidden');
                    }
                }
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }

        if (!window.isDisabledNav) {
            highlightNavOnScroll();
        }
    };

    window.removeEventListener('scroll', window.handleScrollRef);
    window.handleScrollRef = handleScroll;
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    if (hamburger) {
        hamburger.onclick = function () {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        };

        navLinks.forEach(link => {
            link.onclick = function () {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            };
        });

        document.onclick = function (event) {
            if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        };
    }
}

function highlightNavOnScroll() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;

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
        const homeLink = document.querySelector('.nav a[href="#"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

function initCursor() {
    const customCursor = document.getElementById('customCursor');
    if (!customCursor) return;

    function isMobile() { return window.innerWidth < 768; }

    function updateCursorPosition(e) {
        if (!isMobile()) {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
            customCursor.classList.add('visible');
        }
    }

    document.removeEventListener('mousemove', window.cursorMoveRef);
    window.cursorMoveRef = updateCursorPosition;
    document.addEventListener('mousemove', updateCursorPosition);

    document.addEventListener('mousedown', () => customCursor.classList.add('active'));
    document.addEventListener('mouseup', () => customCursor.classList.remove('active'));
    document.addEventListener('mouseleave', () => {
        if (!isMobile()) {
            customCursor.classList.remove('active');
            customCursor.classList.remove('visible');
        }
    });

    window.addEventListener('resize', () => {
        customCursor.style.left = window.innerWidth / 2 + 'px';
        customCursor.style.top = window.innerHeight / 2 + 'px';
    });

    handleLinkHover();
}

function handleLinkHover() {
    const customCursor = document.getElementById('customCursor');
    if (!customCursor) return;

    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .merch-logo, .merch-modal-close');
    const disabledPaginationBtns = document.querySelectorAll('.pagination-btn:disabled');

    interactiveElements.forEach(element => {
        if (element.classList.contains('pagination-btn') && element.disabled) return;

        element.addEventListener('mouseenter', () => {
            customCursor.classList.add('hover');
            customCursor.classList.remove('disabled');
        });

        element.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hover');
            customCursor.classList.remove('disabled');
        });
    });

    disabledPaginationBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            customCursor.classList.add('disabled');
            customCursor.classList.remove('hover');
        });
        btn.addEventListener('mouseleave', () => {
            customCursor.classList.remove('disabled');
            customCursor.classList.remove('hover');
        });
    });
}

function initStars() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const oldStars = footer.querySelectorAll('.star');
    oldStars.forEach(s => s.remove());

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

function initCommon() {
}

function initHome() {
    initParallax();
    initCountdown();
    initMerchModal();
    initHeroGrid();
}

function initHeroGrid() {
    const canvas = document.getElementById('heroGridCanvas');
    function isMobile() { return window.innerWidth < 768; }
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = -1000;
    let mouseY = -1000;

    const gridSize = 50;
    const revealRadius = 300;

    function resize() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    let targetAlpha = 0;
    let currentAlpha = 0;

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouseX = x;
        mouseY = y;

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
            targetAlpha = 1;
        } else {
            targetAlpha = 0;
        }
    });

    document.addEventListener('mouseleave', () => {
        targetAlpha = 0;
    });

    function draw() {
        if (isMobile()) return;
        ctx.clearRect(0, 0, width, height);

        currentAlpha += (targetAlpha - currentAlpha) * 0.07;

        if (currentAlpha > 0.001) {
            const cols = Math.ceil(width / gridSize);
            const rows = Math.ceil(height / gridSize);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gridSize;
                    const y = j * gridSize;

                    const centerX = x + gridSize / 2;
                    const centerY = y + gridSize / 2;

                    const dist = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);

                    if (dist < revealRadius) {
                        const opacity = Math.pow(1 - dist / revealRadius, 2) * currentAlpha;

                        ctx.strokeStyle = `rgba(162, 174, 213, ${opacity * 0.4})`;
                        ctx.lineWidth = 1;
                        ctx.strokeRect(x, y, gridSize, gridSize);

                        ctx.fillStyle = `rgba(162, 174, 213, ${opacity * 0.8})`;
                        ctx.fillRect(centerX - 1, centerY - 1, 2, 2);
                    }
                }
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
}

function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const elements = {
        bgLeft: document.querySelector('.hero-bg-left-image'),
        birds: document.querySelector('.hero-birds-image'),
        mascot1: document.querySelector('.hero-mascot1-image'),
        mascot2: document.querySelector('.hero-mascot2-image'),
        mascot3: document.querySelector('.hero-mascot3-image'),
        mascotC: document.querySelector('.hero-mascot-c-image'),
        mascot4: document.querySelector('.hero-mascot4-image'),
        sub1: document.querySelector('.hero-subtitle1'),
        sub2: document.querySelector('.hero-subtitle2'),
        title1: document.querySelector('.hero-title1'),
        title2: document.querySelector('.hero-title2'),
        title3: document.querySelector('.hero-title3')
    };

    function isMobile() { return window.innerWidth < 768; }

    function resetParallaxElements() {
        Object.values(elements).forEach(el => {
            if (el) el.style.transform = '';
        });
    }

    const merchScene = document.getElementById('merchScene');
    if (merchScene) {
        const merchLayers = document.querySelectorAll('.merch-layer');
        merchScene.onmousemove = (e) => {
            if (isMobile()) return;
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
        };
    }

    let heroRect = hero.getBoundingClientRect();
    let heroCenterX = heroRect.width / 2;
    let heroCenterY = heroRect.height / 2;
    let currentMouseX = window.innerWidth / 2;
    let currentMouseY = window.innerHeight / 2;

    function updateParallaxEffect() {
        if (isMobile()) {
            resetParallaxElements();
            return;
        }
        heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) return;

        const relMouseX = currentMouseX - heroRect.left;
        const relMouseY = currentMouseY - heroRect.top;
        const offsetX = (relMouseX - heroCenterX) / heroCenterX;
        const offsetY = (relMouseY - heroCenterY) / heroCenterY;

        const intensities = {
            bg: 7, birds: 8, m1: 10, m2: 12, m3: 14, m4: 18, mc: 16, title: 10
        };

        if (elements.bgLeft) elements.bgLeft.style.transform = `translate(${offsetX * intensities.bg}px, ${offsetY * intensities.bg}px)`;
        if (elements.birds) elements.birds.style.transform = `translate(${offsetX * intensities.birds}px, ${offsetY * intensities.birds}px)`;
        if (elements.mascot1) elements.mascot1.style.transform = `translate(${offsetX * intensities.m1}px, ${offsetY * intensities.m1}px)`;
        if (elements.mascot2) elements.mascot2.style.transform = `translate(${offsetX * intensities.m2}px, ${offsetY * intensities.m2}px)`;
        if (elements.mascot3) elements.mascot3.style.transform = `translate(${offsetX * intensities.m3}px, ${offsetY * intensities.m3}px)`;
        if (elements.mascotC) elements.mascotC.style.transform = `translate(${offsetX * intensities.mc}px, ${offsetY * intensities.mc}px)`;
        if (elements.mascot4) elements.mascot4.style.transform = `translate(${offsetX * intensities.m4}px, ${offsetY * intensities.m4}px)`;

        const titleTransform = `translate(${offsetX * intensities.title}px, ${offsetY * intensities.title}px)`;
        if (elements.sub1) elements.sub1.style.transform = titleTransform;
        if (elements.sub2) elements.sub2.style.transform = titleTransform;
        if (elements.title1) elements.title1.style.transform = titleTransform;
        if (elements.title2) elements.title2.style.transform = titleTransform;
        if (elements.title3) elements.title3.style.transform = titleTransform;
    }

    document.addEventListener('mousemove', (e) => {
        currentMouseX = e.clientX;
        currentMouseY = e.clientY;
        updateParallaxEffect();
    });

    window.addEventListener('scroll', updateParallaxEffect);
    window.addEventListener('resize', () => {
        heroRect = hero.getBoundingClientRect();
        heroCenterX = heroRect.width / 2;
        heroCenterY = heroRect.height / 2;
        if (isMobile()) resetParallaxElements();
    });
}

function initCountdown() {
    const targetDate = new Date('August 1, 2026 00:00:00').getTime();
    const container = document.querySelector('.countdown-container');
    if (!container) return;

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            container.innerHTML = `
            <div class="countdown-constructivism">
                <div class="countdown-deco-tl"></div>
                <div class="countdown-header">
                    <span class="countdown-label">COUNTDOWN</span>
                    <span class="countdown-target">2026.08.01</span>
                </div>
                <div class="countdown-grid">
                    <div style="font-family: 'font3', sans-serif; font-size: 24px; color: white; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">
                        EVENT STARTED
                    </div>
                </div>
            </div>`;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const els = {
            d: document.getElementById('days'),
            h: document.getElementById('hours'),
            m: document.getElementById('minutes'),
            s: document.getElementById('seconds')
        };
        const vals = {
            d: days.toString().padStart(2, '0'),
            h: hours.toString().padStart(2, '0'),
            m: minutes.toString().padStart(2, '0'),
            s: seconds.toString().padStart(2, '0')
        };

        Object.keys(els).forEach(key => {
            if (els[key] && vals[key] !== els[key].textContent) {
                els[key].classList.add('updating');
                setTimeout(() => {
                    if (els[key]) {
                        els[key].textContent = vals[key];
                        els[key].classList.remove('updating');
                    }
                }, 150);
            }
        });
    }

    update();
    if (window.countdownInterval) clearInterval(window.countdownInterval);
    window.countdownInterval = setInterval(update, 1000);
}

function initMerchModal() {
    const modal = document.getElementById('merchModal');
    if (!modal) return;

    const modalClose = document.querySelector('.merch-modal-close');
    const modalTitle = document.getElementById('merchModalTitle');
    const modalDesc = document.getElementById('merchModalDesc');
    const modalImg = document.getElementById('merchModalImg');
    const merchLogos = document.querySelectorAll('.merch-logo');
    const prevBtn = modal.querySelector('.merch-modal-nav.prev');
    const nextBtn = modal.querySelector('.merch-modal-nav.next');

    let currentImages = [];
    let currentImageIndex = 0;

    function updateModalImage() {
        if (currentImages.length > 0) {
            modalImg.src = currentImages[currentImageIndex];
            if (prevBtn && nextBtn) {
                const isMultiple = currentImages.length > 1;
                prevBtn.disabled = !isMultiple;
                nextBtn.disabled = !isMultiple;
                prevBtn.style.display = isMultiple ? 'flex' : 'none';
                nextBtn.style.display = isMultiple ? 'flex' : 'none';
            }
        }
    }

    function openModal(element) {
        const title = element.getAttribute('data-title');
        const desc = element.getAttribute('data-desc');
        const imagesStr = element.getAttribute('data-images');
        const logoSrc = element.getAttribute('data-logo');

        currentImages = imagesStr ? imagesStr.split(',') : [];
        currentImageIndex = 0;

        modalTitle.textContent = title || '名称';
        modalDesc.textContent = desc || '介绍';

        const modalLogo = document.getElementById('merchModalLogoImg');
        if (modalLogo) modalLogo.src = logoSrc;

        updateModalImage();
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    merchLogos.forEach(logo => {
        logo.onclick = (e) => {
            e.stopPropagation();
            openModal(logo);
        };
    });

    if (prevBtn) prevBtn.onclick = (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
    };

    if (nextBtn) nextBtn.onclick = (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateModalImage();
    };

    if (modalClose) modalClose.onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    document.onkeydown = (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    };
}

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;

    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxName = document.getElementById('lightboxName');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationNumbers = document.getElementById('paginationNumbers');

    let currentPage = 1;
    const itemsPerPage = 6;
    let currentImageIndex = 0;

    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-load');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.onload = () => img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0.01 });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        galleryItems.forEach((item, index) => {
            if (index >= start && index < end) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        setupLazyLoading();
        updatePagination();
        handleLinkHover();
    }

    function updatePagination() {
        if (!paginationNumbers) return;
        const totalPages = Math.ceil(galleryItems.length / itemsPerPage);

        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;

        paginationNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.className = 'pagination-number';
            button.textContent = i;
            if (i === currentPage) button.classList.add('active');
            button.onclick = () => {
                currentPage = i;
                showPage(currentPage);
            };
            paginationNumbers.appendChild(button);
        }
    }

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = galleryItems[index].dataset.src;
        lightboxName.textContent = galleryItems[index].dataset.name || '';

        const imgAuthor = galleryItems[index].dataset.author;
        let authorElement = lightbox.querySelector('.lightbox-author');
        if (!authorElement) {
            authorElement = document.createElement('div');
            authorElement.className = 'lightbox-author';
            if (lightboxName.parentNode) {
                lightboxName.parentNode.insertBefore(authorElement, lightboxName.nextSibling);
            }
        }
        authorElement.textContent = imgAuthor || '';

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }

    function updateLightboxContent() {
        lightboxImg.src = galleryItems[currentImageIndex].dataset.src;
        lightboxName.textContent = galleryItems[currentImageIndex].dataset.name || '';
        const authorElement = lightbox.querySelector('.lightbox-author');
        if (authorElement) {
            authorElement.textContent = galleryItems[currentImageIndex].dataset.author || '';
        }
    }

    galleryItems.forEach((item, index) => {
        item.onclick = () => openLightbox(index);
    });

    if (lightboxClose) lightboxClose.onclick = closeLightbox;
    if (lightboxPrev) lightboxPrev.onclick = showPrevImage;
    if (lightboxNext) lightboxNext.onclick = showNextImage;

    if (lightbox) {
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
    }

    const galleryKeyHandler = (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    };
    document.addEventListener('keydown', galleryKeyHandler);

    if (prevBtn) prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    };

    if (nextBtn) nextBtn.onclick = () => {
        const totalPages = Math.ceil(galleryItems.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    };

    showPage(currentPage);
}
