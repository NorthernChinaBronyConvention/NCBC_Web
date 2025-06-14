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