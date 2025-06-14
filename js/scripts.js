function initSite() {
    setInterval(function() {
        if(Math.random() > 0.9) {
            document.body.style.opacity = 0.8 + Math.random() * 0.2;
            setTimeout(function() {
                document.body.style.opacity = 1;
            }, 50 + Math.random() * 150);
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
    
    if (!mapContainer || !mapImage) return;
    
    let scale = 1;
    let posX = 0;
    let posY = 0;
    let isDragging = false;
    let startX, startY;
    
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
            <div class="loader-line" data-delay="99999999999999999"><span style="color: rgb(255, 65, 65);">错误: 404 Not Found</span></div>
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
        loaderContent.innerHTML = `
            <div class="loader-line" >NCBC2025@web ~$ <span style="color: rgb(137, 255, 130);">load</span> <span style="opacity: 0.5;">RnJpZW5kc2hpcCBpcyBNYWdpYwpEYW9kYW8gJiBSYWt1IElua3lldHRhIQ==</span></div>
            <div class="loader-line" data-delay="1200">正在读取 <span class="rotating-chars"></span></div>
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
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initSite();
});