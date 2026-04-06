// Menu Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initBubbles();
    initScrollAnimations();
    initCarousels();
    initDrinkCardHover();
    initPageTransition();
});

// Carousel state
const carouselStates = {
    carousel1: { currentIndex: 2, isAnimating: false, pendingDirection: 0 },
    carousel2: { currentIndex: 2, isAnimating: false, pendingDirection: 0 },
    carousel3: { currentIndex: 2, isAnimating: false, pendingDirection: 0 }
};

// Initialize carousels
function initCarousels() {
    Object.keys(carouselStates).forEach(carouselId => {
        updateCarousel(carouselId);
    });
}

// Move carousel
function moveCarousel(carouselId, direction) {
    const state = carouselStates[carouselId];
    if (!state) return;
    if (state.isAnimating) {
        state.pendingDirection = direction;
        return;
    }

    const carousel = document.getElementById(carouselId);
    const track = carousel.querySelector('.carousel-track');
    const cards = track.querySelectorAll('.drink-card');
    const totalCards = cards.length;
    state.isAnimating = true;

    // Update index
    state.currentIndex += direction;
    
    // Loop around
    if (state.currentIndex < 0) {
        state.currentIndex = totalCards - 1;
    } else if (state.currentIndex >= totalCards) {
        state.currentIndex = 0;
    }
    
    updateCarousel(carouselId);

    setTimeout(() => {
        state.isAnimating = false;
        if (state.pendingDirection !== 0) {
            const nextDirection = state.pendingDirection;
            state.pendingDirection = 0;
            moveCarousel(carouselId, nextDirection);
        }
    }, 560);
}

// Update carousel display
function updateCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    const track = carousel.querySelector('.carousel-track');
    const cards = track.querySelectorAll('.drink-card');
    const currentIndex = carouselStates[carouselId].currentIndex;
    
    // Remove active class from all cards
    const totalCards = cards.length;

    cards.forEach((card, index) => {
        card.classList.remove('active');

        // Circular distance for smoother loop edges
        const distance = Math.min(
            Math.abs(index - currentIndex),
            totalCards - Math.abs(index - currentIndex)
        );

        let signedOffset = index - currentIndex;
        if (signedOffset > totalCards / 2) signedOffset -= totalCards;
        if (signedOffset < -totalCards / 2) signedOffset += totalCards;

        if (distance === 0) {
            card.classList.add('active');
            card.style.opacity = '1';
            card.style.filter = 'none';
        } else if (distance === 1) {
            card.style.opacity = '0.75';
            card.style.filter = 'grayscale(0.08)';
        } else {
            card.style.opacity = '0.55';
            card.style.filter = 'grayscale(0.2)';
        }

    });
    
    // Center based on real card geometry (stable on all breakpoints)
    const activeCard = cards[currentIndex];
    const translateX = (carousel.clientWidth / 2) - (activeCard.offsetLeft + activeCard.offsetWidth / 2);
    track.style.transform = `translate3d(${translateX}px, 0, 0)`;
}

// Animated bubbles background
function initBubbles() {
    const container = document.getElementById('bubbles');
    if (!container) return;
    
    const colors = ['#FF6363', '#FFB74D', '#81C784', '#64B5F6', '#CE93D8'];
    
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-bg';
        
        const size = Math.random() * 20 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        bubble.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            bottom: -50px;
            opacity: ${Math.random() * 0.3 + 0.1};
            pointer-events: none;
        `;
        
        container.appendChild(bubble);
        
        // Animate bubble rising
        const duration = Math.random() * 5000 + 5000;
        const horizontalMovement = (Math.random() - 0.5) * 100;
        
        bubble.animate([
            { 
                transform: 'translateY(0) translateX(0) scale(1)',
                opacity: bubble.style.opacity
            },
            { 
                transform: `translateY(-${window.innerHeight + 100}px) translateX(${horizontalMovement}px) scale(0.5)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        }).onfinish = () => {
            bubble.remove();
        };
    }
    
    // Create bubbles periodically
    setInterval(createBubble, 800);
    
    // Initial bubbles
    for (let i = 0; i < 5; i++) {
        setTimeout(createBubble, i * 200);
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements
    document.querySelectorAll('.menu-category, .category-title, .carousel-wrapper').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Drink card hover effects
function initDrinkCardHover() {
    const cards = document.querySelectorAll('.drink-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Animate bubbles inside the cup
            const bubbles = this.querySelectorAll('.bubble');
            bubbles.forEach((bubble, index) => {
                bubble.style.animation = `bubbleFloat 1.5s ease-in-out infinite ${index * 0.2}s`;
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const bubbles = this.querySelectorAll('.bubble');
            bubbles.forEach(bubble => {
                bubble.style.animation = 'bubbleFloat 3s ease-in-out infinite';
            });
        });
        
        // Click to make active
        card.addEventListener('click', function() {
            const carousel = this.closest('.carousel');
            const carouselId = carousel.id;
            const cards = carousel.querySelectorAll('.drink-card');
            const index = Array.from(cards).indexOf(this);
            
            carouselStates[carouselId].currentIndex = index;
            if (!carouselStates[carouselId].isAnimating) {
                carouselStates[carouselId].isAnimating = true;
                updateCarousel(carouselId);
                setTimeout(() => {
                    carouselStates[carouselId].isAnimating = false;
                    if (carouselStates[carouselId].pendingDirection !== 0) {
                        const nextDirection = carouselStates[carouselId].pendingDirection;
                        carouselStates[carouselId].pendingDirection = 0;
                        moveCarousel(carouselId, nextDirection);
                    }
                }, 560);
            }
        });
    });
}

// Page transition
function initPageTransition() {
    // Create transition element
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    
    // Animate page in on load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Handle back link click
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            transition.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    }
    
    // Handle all internal links
    document.querySelectorAll('a[href^="index.html"], a[href^="menu.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('back-link')) return; // Already handled
            
            e.preventDefault();
            const href = this.getAttribute('href');
            
            transition.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for circles (disabled for stable alignment)
// window.addEventListener('scroll', function() {
//     const scrollY = window.scrollY;
//     
//     document.querySelectorAll('.drink-circle').forEach((circle, index) => {
//         const speed = 0.02 + (index * 0.005);
//         circle.style.transform = `translateX(-50%) translateY(${scrollY * speed}px)`;
//     });
// });

// Mobile touch support for carousels
let touchStartX = 0;
let touchEndX = 0;

document.querySelectorAll('.carousel').forEach(carousel => {
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(carousel.id);
    }, { passive: true });
});

function handleSwipe(carouselId) {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next
            moveCarousel(carouselId, 1);
        } else {
            // Swipe right - prev
            moveCarousel(carouselId, -1);
        }
    }
}
