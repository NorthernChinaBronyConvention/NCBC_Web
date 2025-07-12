console.log(
    "     __           _   _                         ___ _     _\n" +
    "  /\\ \\ \\___  _ __| |_| |__   ___ _ __ _ __     / __\\ |__ (_)_ __   __ _\n" +
    " /  \\/ / _ \\| '__| __| '_ \\ / _ \\ '__| '_ \\   / /  | '_ \\| | '_ \\ / _` |\n" +
    "/ /\\  / (_) | |  | |_| | | |  __/ |  | | | | / /___| | | | | | | | (_| |\n" +
    "\\_\\ \\/ \\___/|_|   \\__|_| |_|\\___|_|  |_| |_| \\____/|_| |_|_|_| |_|\\__,_|\n" +
    "   ___                           ___                           _   _\n" +
    "  / __\\_ __ ___  _ __  _   _    / __\\___  _ ____   _____ _ __ | |_(_) ___  _ __\n" +
    " /__\\// '__/ _ \\| '_ \\| | | |  / /  / _ \\| '_ \\ \\ / / _ \\ '_ \\| __| |/ _ \\| '_ \\\n" +
    "/ \\/  \\ | | (_) | | | | |_| | / /__| (_) | | | \\ V /  __/ | | | |_| | (_) | | | |\n" +
    "\\_____/_|  \\___/|_| |_|\\__, | \\____/\\___/|_| |_|\\_/ \\___|_| |_|\\__|_|\\___/|_| |_|\n" +
    "                       |___/\n" +
    "\n" +
    "NCBC - 华北马聚 | Web by JessDaodao、Leonsu_L & Raku Inkyetta\n" +
    "网站已在GitHub开源：https://github.com/NorthernChinaBronyConvention/NCBC_Web"
);

function initSite() {
    setInterval(function() {
        if(Math.random() > 0.9) {
            document.body.style.opacity = 0.8 + Math.random() * 0.4;
            setTimeout(function() {
                document.body.style.opacity = 1;
            }, 50 + Math.random() * 300);
        }
    }, 5000);
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if ((currentPage === 'index.html' && linkPage === '#home') || 
            (currentPage === 'about.html' && linkPage === '#about')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const hamburgerNavLinks = document.querySelector('.nav-links');
    
    if (hamburger && hamburgerNavLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            hamburgerNavLinks.classList.toggle('active');
        });
    }

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
        });
    });

    initMap();
}

function initMap() {
    const mapContainer = document.querySelector('.zoomable-map');
    const mapImage = document.querySelector('.map-image');
    const markers = document.querySelectorAll('.map-marker');
    const mapXElement = document.querySelector('.map-x');
    const mapYElement = document.querySelector('.map-y');
    const mapScaleElement = document.querySelector('.map-scale');
    
    if (!mapContainer || !mapImage) return;
    
    const isMobileView = window.matchMedia("(max-width: 768px)").matches;
    
    let scale, posX, posY;
    if (isMobileView) {
        scale = parseFloat(mapContainer.dataset.mobileScale) || 1.0;
        posX = parseFloat(mapContainer.dataset.mobileX) || 50;
        posY = parseFloat(mapContainer.dataset.mobileY) || 0;
    } else {
        scale = parseFloat(mapContainer.dataset.defaultScale) || 1.5;
        posX = parseFloat(mapContainer.dataset.defaultX) || 0;
        posY = parseFloat(mapContainer.dataset.defaultY) || 0;
    }
    
    let isDragging = false;
    let startX, startY;

    function updateCoordinateDisplay() {
        if (mapXElement && mapYElement && mapScaleElement) {
            mapXElement.textContent = posX.toFixed(1);
            mapYElement.textContent = posY.toFixed(1);
            mapScaleElement.textContent = scale.toFixed(2);
        }
    }
    
    updateMapTransform();
    updateAllMarkersPosition();
    
    markers.forEach(marker => {
        const markerLeft = parseFloat(marker.style.left);
        const markerTop = parseFloat(marker.style.top);
        
        marker.dataset.originalLeft = markerLeft;
        marker.dataset.originalTop = markerTop;
        
        updateMarkerPosition(marker);
    });
    
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const mapX = (mouseX - posX) / scale;
        const mapY = (mouseY - posY) / scale;
        
        const delta = -e.deltaY;
        let zoomFactor = 1.1;
        
        if (delta < 0) {
            zoomFactor = 1 / zoomFactor;
        }
        
        const newScale = scale * zoomFactor;
        
        if (newScale < 1) {
            scale = 1;
            posX = 0;
            posY = 0;
        } else if (newScale > 5) {
            scale = 5;
        } else {
            scale = newScale;
            
            posX = mouseX - mapX * scale;
            posY = mouseY - mapY * scale;
        }
        
        updateMapTransform();
        updateAllMarkersPosition();
    }, { passive: false });
    
    mapContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        
        isDragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
        mapContainer.classList.add('grabbing');
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        posX = e.clientX - startX;
        posY = e.clientY - startY;
        
        updateMapTransform();
        updateAllMarkersPosition();
    });
    
    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isDragging = false;
            mapContainer.classList.remove('grabbing');
        }
    });
    
    mapContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        
        posX = e.touches[0].clientX - startX;
        posY = e.touches[0].clientY - startY;
        
        updateMapTransform();
        updateAllMarkersPosition();
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    function updateMapTransform() {
        mapImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
        updateCoordinateDisplay();
    }
    
    function updateMarkerPosition(marker) {
        const originalLeft = parseFloat(marker.dataset.originalLeft);
        const originalTop = parseFloat(marker.dataset.originalTop);
        
        const containerRect = mapContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        const offsetX = (originalLeft / 100) * containerWidth - centerX;
        const offsetY = (originalTop / 100) * containerHeight - centerY;
        
        const newX = centerX + offsetX * scale + posX;
        const newY = centerY + offsetY * scale + posY;
        
        marker.style.left = `${newX}px`;
        marker.style.top = `${newY}px`;
    }
    
    function updateAllMarkersPosition() {
        markers.forEach(marker => {
            updateMarkerPosition(marker);
        });
    }
    
    markers.forEach(marker => {
        marker.addEventListener('mouseenter', () => {
            const tooltip = marker.querySelector('.marker-tooltip');
            const title = marker.getAttribute('data-title');
            const details = marker.getAttribute('data-details');
            
            if (tooltip) {
                tooltip.innerHTML = `<strong>${title}</strong><br>${details}`;
            }
            
            const locationTitle = document.querySelector('.location-details h3');
            const locationDetails = document.querySelector('.location-details');
            
            if (locationTitle && locationDetails) {
                locationTitle.textContent = title;
            }
        });
    });
}

function initLoader() {
    const loader = document.getElementById('loader');
    const loaderContent = document.getElementById('loader-content');
    const lines = loaderContent?.querySelectorAll('.loader-line');
    
    if (!loader || !lines || lines.length === 0) return;
    
    const hasLoaded = sessionStorage.getItem('siteLoaded');
    const hasSpecialLoader = document.querySelector('meta[name="ncbc-loader"][content="special"]');
    const quickLoaderContent = document.getElementById('quick-loader-content');
    
    if (!hasLoaded && !hasSpecialLoader) {
        lines.forEach(line => {
            line.style.visibility = 'hidden';
        });
        
        function showLines(index) {
            if (index < lines.length) {
                lines[index].style.visibility = 'visible';
                
                const customDelay = lines[index].getAttribute('data-delay');
                const delay = customDelay ? parseInt(customDelay) : 300 + Math.random() * 700;
                
                setTimeout(() => {
                    showLines(index + 1);
                }, delay);
            } else {
                setTimeout(() => {
                    loaderContent.innerHTML = '';
                    
                    setTimeout(() => {
                        loader.style.display = 'none';
                        document.body.style.display = 'block';
                        sessionStorage.setItem('siteLoaded', 'true');
                    }, 1000);
                }, 2000);
            }
        }
        
        setTimeout(() => {
            showLines(0);
        }, 500);
    } else if (hasSpecialLoader) {
        loaderContent.innerHTML = `
            <div class="loader-line" ><span style="color: rgb(255, 105, 105);">[ERROR] 404 Not Found! </span></div>
            <div class="loader-line" data-delay="1000000000"><span style="color: #00ff00;">Back Home in <span class="time5s"></span> seconds.</span></div>
        `;

        const quickLines = loaderContent.querySelectorAll('.loader-line');
        quickLines.forEach(line => {
            line.style.visibility = 'hidden';
        });
        
        function showQuickLines(index) {
            if (index < quickLines.length) {
                quickLines[index].style.visibility = 'visible';
                
                const delay = quickLines[index].getAttribute('data-delay') ? 
                    parseInt(quickLines[index].getAttribute('data-delay')) : 200;
                
                setTimeout(() => {
                    showQuickLines(index + 1);
                }, delay);
            } else {
                setTimeout(() => {
                    loaderContent.innerHTML = '';
                    
                    setTimeout(() => {
                        loader.style.display = 'none';
                        document.body.style.display = 'block';
                    }, 500);
                }, 1000);
            }
        }

        setTimeout(() => {
            showQuickLines(0);
        }, 300);
    } else {
        loaderContent.innerHTML = quickLoaderContent.innerHTML;
        
        const quickLines = loaderContent.querySelectorAll('.loader-line');
        quickLines.forEach(line => {
            line.style.visibility = 'hidden';
        });
        
        function showQuickLines(index) {
            if (index < quickLines.length) {
                quickLines[index].style.visibility = 'visible';
                
                const delay = quickLines[index].getAttribute('data-delay') ? 
                    parseInt(quickLines[index].getAttribute('data-delay')) : 200;
                
                setTimeout(() => {
                    showQuickLines(index + 1);
                }, delay);
            } else {
                setTimeout(() => {
                    loaderContent.innerHTML = '';
                    
                    setTimeout(() => {
                        loader.style.display = 'none';
                        document.body.style.display = 'block';
                    }, 500);
                }, 1000);
            }
        }
        
        setTimeout(() => {
            showQuickLines(0);
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initSite();
    initCountdown();
});

function initCountdown() {
    // 这里设置倒计时目标时间
    const eventDate = new Date('2025-08-09T09:00:00');
    const daysElement = document.querySelector('.countdown-days');
    const hoursElement = document.querySelector('.countdown-hours');
    const minutesElement = document.querySelector('.countdown-minutes');
    const secondsElement = document.querySelector('.countdown-seconds');
    const timerElement = document.querySelector('.countdown-timer');
    const titleElement = document.querySelector('.countdown-title');
    
    const criticalSeconds = 60;
    const finalCountdownSeconds = 10;
    
    function updateCountdown() {
        const now = new Date();
        const diff = eventDate - now;
        
        if (diff <= 0) {
            timerElement.textContent = "倒计时已结束";
            timerElement.classList.add('critical');
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        if (days === 0 && hours === 0 && minutes === 0 && seconds <= criticalSeconds) {
            timerElement.classList.add('critical');
        } else {
            timerElement.classList.remove('critical');
        }
        
        if (days === 0 && hours === 0 && minutes === 0 && seconds <= finalCountdownSeconds) {
            timerElement.classList.add('final-countdown');
            titleElement.textContent = " ";
        } else {
            timerElement.classList.remove('final-countdown');
            titleElement.textContent = "距离活动开始还有";
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}