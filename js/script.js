console.log('我是叨叨，这个网站的搭建者，你既然通过翻日志看到了这个消息，那么……来玩EQAD喵~来玩EQAD谢谢喵~ 群号：859298157');

window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    setTimeout(function() {
        loader.classList.add('fade-out');
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    }, 500);
});

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');

window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        nav.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        nav.classList.remove('scrolled');
    }
});

const navLinks = document.querySelectorAll('.nav a[href^="#"]');

function highlightNavOnScroll() {
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

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        
        navLinks.forEach(navLink => {
            navLink.classList.remove('active');
        });
        this.classList.add('active');
    });
});

const activityTabs = document.querySelectorAll('.activity-tab');
const activities = document.querySelectorAll('.activity');

activityTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabType = tab.getAttribute('data-tab');
        
        activityTabs.forEach(t => t.classList.remove('active'));
        
        tab.classList.add('active');
        
        activities.forEach(activity => {
            activity.style.display = 'none';
        });
        
        document.querySelector(`.activity.${tabType}`).style.display = 'flex';
    });
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

const qaQuestions = document.querySelectorAll('.qa-question');

qaQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const toggle = question.querySelector('.qa-toggle');
        
        answer.classList.toggle('active');
        
        if (answer.classList.contains('active')) {
            toggle.textContent = '-';
        } else {
            toggle.textContent = '+';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const heroImage = document.querySelector('.hero-custom-image');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const hero = document.querySelector('.hero');
    
    function isMobile() {
        return window.innerWidth < 768;
    }
    
    function resetParallaxElements() {
        if (heroImage) {
            heroImage.style.transform = 'translate(-50%, -50%)';
        }
        if (heroTitle) {
            heroTitle.style.transform = 'translate(0, 0)';
        }
        if (heroSubtitle) {
            heroSubtitle.style.transform = 'translate(0, 0)';
        }
    }
    
    if (heroImage && hero) {
        let heroRect = hero.getBoundingClientRect();
        let heroCenterX = heroRect.width / 2;
        let heroCenterY = heroRect.height / 2;
        
        const parallaxIntensity = 30;
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
            
            const moveX = offsetX * parallaxIntensity;
            const moveY = offsetY * parallaxIntensity;
            
            const titleMoveX = offsetX * titleParallaxIntensity;
            const titleMoveY = offsetY * titleParallaxIntensity;
            
            heroImage.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
            
            const rotateX = -offsetY * 2;
            const rotateY = offsetX * 2;
            heroImage.style.transform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            if (heroTitle) {
                heroTitle.style.transform = `translate(${titleMoveX}px, ${titleMoveY}px)`;
            }
            
            if (heroSubtitle) {
                heroSubtitle.style.transform = `translate(${titleMoveX}px, ${titleMoveY}px)`;
            }
        }
        
        document.addEventListener('mousemove', function(e) {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
            updateParallaxEffect();
        });
        
        window.addEventListener('scroll', function() {
            updateParallaxEffect();
        });
        
        window.addEventListener('resize', function() {
            heroRect = hero.getBoundingClientRect();
            heroCenterX = heroRect.width / 2;
            heroCenterY = heroRect.height / 2;
            
            if (isMobile()) {
                resetParallaxElements();
            }
        });
    }
});