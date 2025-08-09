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

document.addEventListener('DOMContentLoaded', function() {
    initTypingEffect();
});

function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-title');
    if (!typingElements.length) return;
    
    function createCursor() {
        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        return cursor;
    }
    
    function typeWriter(element) {
        return new Promise((resolve) => {
            const text = element.dataset.text || '';
            const speed = parseInt(element.dataset.speed) || 100;
            const keepCursor = element.dataset.cursor !== 'false';
            let i = 0;
            element.innerHTML = '';
            
            function typing() {
                if (i < text.length) {
                    if (element.lastChild?.classList.contains('type-cursor')) {
                        element.removeChild(element.lastChild);
                    }
                    
                    element.innerHTML = text.substring(0, i + 1);
                    element.appendChild(createCursor());
                    i++;
                    setTimeout(typing, speed);
                } else {
                    if (element.lastChild?.classList.contains('type-cursor')) {
                        element.removeChild(element.lastChild);
                    }

                    if (keepCursor) {
                        element.appendChild(createCursor());
                    }
                    
                    resolve();
                }
            }
            
            typing();
        });
    }
    
    let promiseChain = Promise.resolve();
    
    typingElements.forEach((element, index) => {
        const delay = index > 0 ? parseInt(element.dataset.delay) || 0 : 0;
        
        promiseChain = promiseChain.then(() => {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeWriter(element).then(resolve);
                }, delay);
            });
        });
    });
}