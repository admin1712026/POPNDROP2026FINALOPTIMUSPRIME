// ==================== РџР•Р Р•РҐРћР” РњР•Р–Р”РЈ РЎРўР РђРќРР¦РђРњР ====================
function initPageTransition() {
    // РЎРѕР·РґР°С‘Рј СЌР»РµРјРµРЅС‚ РґР»СЏ Р°РЅРёРјР°С†РёРё РїРµСЂРµС…РѕРґР°
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    transition.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #FF6363 0%, #FFB5B5 100%);
        z-index: 9999;
        transform: translateY(100%);
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
    `;
    document.body.appendChild(transition);
    
    // РђРЅРёРјР°С†РёСЏ РїРѕСЏРІР»РµРЅРёСЏ СЃС‚СЂР°РЅРёС†С‹ РїСЂРё Р·Р°РіСЂСѓР·РєРµ
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // РћР±СЂР°Р±РѕС‚С‡РёРє РґР»СЏ РєРЅРѕРїРєРё "РЎРјРѕС‚СЂРµС‚СЊ РІСЃРµ"
    const viewAllBtn = document.getElementById('viewAllMenu');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            transition.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    }
    
    // РћР±СЂР°Р±РѕС‚С‡РёРє РґР»СЏ РІСЃРµС… РІРЅСѓС‚СЂРµРЅРЅРёС… СЃСЃС‹Р»РѕРє РЅР° РґСЂСѓРіРёРµ СЃС‚СЂР°РЅРёС†С‹
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        if (link.id === 'viewAllMenu') return; // РЈР¶Рµ РѕР±СЂР°Р±РѕС‚Р°РЅ
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            transition.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
}

// ==================== РђРќРРњРђР¦РРЇ РџРћРЇР’Р›Р•РќРРЇ Р‘Р›РћРљРћР’ РџР Р РЎРљР РћР›Р›Р• ====================
document.addEventListener('DOMContentLoaded', function() {
    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїРµСЂРµС…РѕРґР° РјРµР¶РґСѓ СЃС‚СЂР°РЅРёС†Р°РјРё
    initPageTransition();
    // Intersection Observer РґР»СЏ РїРѕСЏРІР»РµРЅРёСЏ СЌР»РµРјРµРЅС‚РѕРІ
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Р”РѕР±Р°РІР»СЏРµРј Р·Р°РґРµСЂР¶РєСѓ РґР»СЏ РєР°СЃРєР°РґРЅРѕРіРѕ СЌС„С„РµРєС‚Р°
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // РќР°Р±Р»СЋРґР°РµРј Р·Р° РІСЃРµРјРё СЌР»РµРјРµРЅС‚Р°РјРё СЃ РєР»Р°СЃСЃРѕРј fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // ==================== РђРќРРњРђР¦РРЇ РџРЈР—Р«Р Р¬РљРћР’ РќРђ Р¤РћРќР• ====================
    createBubbles();
    
    // ==================== РЎР›РђР™Р”Р•Р  РћРўР—Р«Р’РћР’ ====================
    initReviewsSlider();
    
    // ==================== РћР‘Р РђР‘РћРўРљРђ Р¤РћР РњР« ====================
    initContactForm();
    
    // ==================== РџР›РђР’РќРђРЇ РџР РћРљР РЈРўРљРђ ====================
    initSmoothScroll();
});

// РЎРѕР·РґР°РЅРёРµ Р°РЅРёРјРёСЂРѕРІР°РЅРЅС‹С… РїСѓР·С‹СЂСЊРєРѕРІ
function createBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    if (!bubblesContainer) return;
    
    const colors = ['#FF6363', '#FFB5B5', '#FFE566', '#98FB98', '#DDA0DD'];
    const bubbleCount = 15;
    
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 30 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 5;
        
        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        bubblesContainer.appendChild(bubble);
        
        // РЈРґР°Р»СЏРµРј РїСѓР·С‹СЂС‘Рє РїРѕСЃР»Рµ Р·Р°РІРµСЂС€РµРЅРёСЏ Р°РЅРёРјР°С†РёРё Рё СЃРѕР·РґР°С‘Рј РЅРѕРІС‹Р№
        setTimeout(() => {
            bubble.remove();
            createBubble();
        }, (duration + delay) * 1000);
    }
    
    // РЎРѕР·РґР°С‘Рј РЅР°С‡Р°Р»СЊРЅС‹Рµ РїСѓР·С‹СЂСЊРєРё
    for (let i = 0; i < bubbleCount; i++) {
        setTimeout(() => createBubble(), i * 500);
    }
}

// РЎР»Р°Р№РґРµСЂ РѕС‚Р·С‹РІРѕРІ
function initReviewsSlider() {
    const dots = document.querySelectorAll('.reviews-dots .dot');
    const reviewsGrid = document.getElementById('reviewsGrid');
    
    if (!dots.length || !reviewsGrid) return;
    
    let currentSlide = 0;
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    function updateSlider() {
        // РќР° РјРѕР±РёР»СЊРЅС‹С… СѓСЃС‚СЂРѕР№СЃС‚РІР°С… РјРѕР¶РЅРѕ РґРѕР±Р°РІРёС‚СЊ РїСЂРѕРєСЂСѓС‚РєСѓ
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Р”РѕР±Р°РІР»СЏРµРј СЌС„С„РµРєС‚ РїСЂРё РєР»РёРєРµ
        const items = reviewsGrid.querySelectorAll('.review-item');
        items.forEach((item, index) => {
            item.style.transform = index === currentSlide ? 'scale(1.02)' : 'scale(1)';
            item.style.opacity = index === currentSlide ? '1' : '0.7';
        });
        
        // РЎР±СЂР°СЃС‹РІР°РµРј С‡РµСЂРµР· СЃРµРєСѓРЅРґСѓ
        setTimeout(() => {
            items.forEach(item => {
                item.style.transform = '';
                item.style.opacity = '';
            });
        }, 1000);
    }
    
    // РђРІС‚РѕРјР°С‚РёС‡РµСЃРєР°СЏ СЃРјРµРЅР° СЃР»Р°Р№РґРѕРІ
    setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        updateSlider();
    }, 5000);
}

// РћР±СЂР°Р±РѕС‚РєР° С„РѕСЂРјС‹
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        form.querySelectorAll(".form-group").forEach(group => {
            group.classList.remove("error");
            const errorMsg = group.querySelector(".error-message");
            if (errorMsg) errorMsg.textContent = "";
        });

        let isValid = true;
        const name = form.querySelector("input[type=\"text\"]");
        const email = form.querySelector("input[type=\"email\"]");
        const phone = form.querySelector("input[type=\"tel\"]");
        const message = form.querySelector("textarea");

        if (!name.value.trim()) {
            showError(name, "Пожалуйста, введите ваше имя");
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, "Пожалуйста, введите email");
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, "Введите корректный email");
            isValid = false;
        }

        if (!phone.value.trim()) {
            showError(phone, "Пожалуйста, введите телефон");
            isValid = false;
        }

        if (!message.value.trim()) {
            showError(message, "Пожалуйста, введите сообщение");
            isValid = false;
        }

        if (!isValid) return;

        const button = form.querySelector("button[type=\"submit\"]");
        const originalText = button.textContent;

        button.textContent = "Отправляется...";
        button.disabled = true;
        button.style.opacity = "0.7";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const cfg = window.SUPABASE_CONFIG;
            if (!cfg?.url || !cfg?.anonKey) {
                showError(message, "Не настроен Supabase конфиг для GitHub Pages.");
                return;
            }

            const response = await fetch(`${cfg.url}/rest/v1/contact_requests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: cfg.anonKey,
                    Authorization: `Bearer ${cfg.anonKey}`,
                    Prefer: "return=minimal"
                },
                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    message: message.value.trim()
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                let errorText = "Ошибка отправки. Попробуйте еще раз.";
                try {
                    const payload = await response.json();
                    if (payload?.error) errorText = payload.error;
                } catch (_error) {}

                showError(message, errorText);
                return;
            }

            button.textContent = "Отправлено!";
            button.style.background = "#7ED957";
            form.reset();

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.opacity = "1";
                button.style.background = "";
            }, 2000);
        } catch (error) {
            if (error?.name === "AbortError") {
                showError(message, "Сервер долго отвечает. Попробуйте еще раз через пару секунд.");
            } else {
                showError(message, "Не удалось отправить форму. Проверьте соединение.");
            }
        } finally {
            clearTimeout(timeoutId);
            if (button.textContent !== "Отправлено!") {
                button.textContent = originalText;
                button.disabled = false;
                button.style.opacity = "1";
            }
        }
    });

    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(input => {
        input.addEventListener("focus", function() {
            this.parentElement.style.transform = "scale(1.02)";
        });

        input.addEventListener("blur", function() {
            this.parentElement.style.transform = "scale(1)";
        });

        input.addEventListener("input", function() {
            this.parentElement.classList.remove("error");
            const errorMsg = this.parentElement.querySelector(".error-message");
            if (errorMsg) errorMsg.textContent = "";
        });
    });
}

function showError(input, message) {
    const group = input.parentElement;
    group.classList.add('error');
    const errorMsg = group.querySelector('.error-message');
    if (errorMsg) errorMsg.textContent = message;
}

// РџР»Р°РІРЅР°СЏ РїСЂРѕРєСЂСѓС‚РєР°
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== РџРђР РђР›Р›РђРљРЎ Р­Р¤Р¤Р•РљРў Р”Р›РЇ РљР РЈР“РћР’ ====================
window.addEventListener('scroll', function() {
    const circles = document.querySelectorAll('.circle');
    const scrollY = window.scrollY;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.1;
        circle.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
    });
});

// ==================== РђРќРРњРђР¦РРЇ РџРЈР—Р«Р Р¬РљРћР’ Р’ РЎРўРђРљРђРќРђРҐ РџР Р РќРђР’Р•Р”Р•РќРР ====================
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const bubbles = this.querySelectorAll('.menu-bubble');
        bubbles.forEach((bubble, index) => {
            bubble.style.animationDuration = '1.5s';
        });
    });
    
    item.addEventListener('mouseleave', function() {
        const bubbles = this.querySelectorAll('.menu-bubble');
        bubbles.forEach(bubble => {
            bubble.style.animationDuration = '2.5s';
        });
    });
});

// ==================== Р­Р¤Р¤Р•РљРў РџР•Р§РђРўР Р”Р›РЇ Р—РђР“РћР›РћР’РљРђ ====================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === '<') {
                // РџСЂРѕРїСѓСЃРєР°РµРј HTML С‚РµРіРё
                const closeTag = text.indexOf('>', i);
                element.innerHTML += text.substring(i, closeTag + 1);
                i = closeTag + 1;
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ==================== РЎР§РЃРўР§РРљ Р”Р›РЇ РЎРўРђРўРРЎРўРРљР ====================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString('ru-RU');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// ==================== РРќРўР•Р РђРљРўРР’РќР«Р• BLOB-Р­Р›Р•РњР•РќРўР« ====================
document.querySelectorAll('.franchise-blob, .decor-blob').forEach(blob => {
    blob.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2) rotate(15deg)';
        this.style.transition = 'transform 0.4s ease';
    });
    
    blob.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ==================== РљРЈР РЎРћР -РЎР›Р•Р”РћР’РђРўР•Р›Р¬ (РћРџР¦РРћРќРђР›Р¬РќРћ) ====================
// Р Р°СЃРєРѕРјРјРµРЅС‚РёСЂСѓР№С‚Рµ РґР»СЏ РІРєР»СЋС‡РµРЅРёСЏ РєР°СЃС‚РѕРјРЅРѕРіРѕ РєСѓСЂСЃРѕСЂР°
/*
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    background: rgba(255, 99, 99, 0.5);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

document.querySelectorAll('a, button, .menu-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});
*/

// POP & DROP website loaded successfully!

// Static build for GitHub Pages: no Next.js /api endpoints


