// Menu Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  initBubbles();
  initScrollAnimations();
  initCarousels();
  initDrinkCardHover();
  initPageTransition();

  // Подтягиваем напитки из Supabase поверх старой верстки
  hydrateMenuFromSupabase();
});

// Carousel state
const carouselStates = {
  carousel1: { currentIndex: 2, isAnimating: false, pendingDirection: 0 },
  carousel2: { currentIndex: 2, isAnimating: false, pendingDirection: 0 },
  carousel3: { currentIndex: 2, isAnimating: false, pendingDirection: 0 }
};

// Initialize carousels
function initCarousels() {
  Object.keys(carouselStates).forEach((carouselId) => {
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
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  if (!track) return;

  const cards = track.querySelectorAll(".drink-card");
  const totalCards = cards.length;
  if (!totalCards) return;

  state.isAnimating = true;

  state.currentIndex += direction;
  if (state.currentIndex < 0) state.currentIndex = totalCards - 1;
  if (state.currentIndex >= totalCards) state.currentIndex = 0;

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
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  if (!track) return;

  const cards = track.querySelectorAll(".drink-card");
  const state = carouselStates[carouselId];
  if (!state || !cards.length) return;

  const currentIndex = Math.max(0, Math.min(state.currentIndex, cards.length - 1));

  cards.forEach((card, index) => {
    card.classList.remove("active");

    const distance = Math.abs(index - currentIndex);

    if (distance === 0) {
      card.classList.add("active");
      card.style.opacity = "1";
      card.style.transform = "scale(1.05)";
      card.style.filter = "none";
    } else if (distance === 1) {
      card.style.opacity = "0.9";
      card.style.transform = "scale(0.95)";
      card.style.filter = "none";
    } else {
      card.style.opacity = "0.7";
      card.style.transform = "scale(0.9)";
      card.style.filter = "grayscale(0.1)";
    }
  });

  const activeCard = cards[currentIndex];
  const translateX =
    carousel.clientWidth / 2 - (activeCard.offsetLeft + activeCard.offsetWidth / 2);

  track.style.transform = `translate3d(${translateX}px, 0, 0)`;

  state.currentIndex = currentIndex;
}

// Animated bubbles background
function initBubbles() {
  const container = document.getElementById("bubbles");
  if (!container) return;

  const colors = ["#FF6363", "#FFB74D", "#81C784", "#64B5F6", "#CE93D8"];

  function createBubble() {
    const bubble = document.createElement("div");
    bubble.className = "bubble-bg";

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

    const duration = Math.random() * 5000 + 5000;
    const horizontalMovement = (Math.random() - 0.5) * 100;

    bubble
      .animate(
        [
          {
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: bubble.style.opacity
          },
          {
            transform: `translateY(-${window.innerHeight + 100}px) translateX(${horizontalMovement}px) scale(0.5)`,
            opacity: 0
          }
        ],
        {
          duration: duration,
          easing: "ease-out"
        }
      )
      .onfinish = () => {
        bubble.remove();
      };
  }

  setInterval(createBubble, 800);

  for (let i = 0; i < 5; i++) {
    setTimeout(createBubble, i * 200);
  }
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, observerOptions);

  document.querySelectorAll(".menu-category, .category-title, .carousel-wrapper").forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
}

// Drink card hover effects
function initDrinkCardHover() {
  const cards = document.querySelectorAll(".drink-card");
  cards.forEach(bindDrinkCardListeners);
}

function bindDrinkCardListeners(card) {
  if (!card || card.dataset.bound === "1") return;
  card.dataset.bound = "1";

  card.addEventListener("mouseenter", function () {
    const bubbles = this.querySelectorAll(".bubble");
    bubbles.forEach((bubble, index) => {
      bubble.style.animation = `bubbleFloat 1.5s ease-in-out infinite ${index * 0.2}s`;
    });
  });

  card.addEventListener("mouseleave", function () {
    const bubbles = this.querySelectorAll(".bubble");
    bubbles.forEach((bubble) => {
      bubble.style.animation = "bubbleFloat 3s ease-in-out infinite";
    });
  });

  card.addEventListener("click", function () {
    const carousel = this.closest(".carousel");
    if (!carousel) return;

    const carouselId = carousel.id;
    const cards = carousel.querySelectorAll(".drink-card");
    const index = Array.from(cards).indexOf(this);

    if (!carouselStates[carouselId]) return;
    carouselStates[carouselId].currentIndex = index;

    if (!carouselStates[carouselId].isAnimating) {
      carouselStates[carouselId].isAnimating = true;
      updateCarousel(carouselId);

      setTimeout(() => {
        carouselStates[carouselId].isAnimating = false;
      }, 560);
    }
  });
}

// Page transition
function initPageTransition() {
  const transition = document.createElement("div");
  transition.className = "page-transition";
  document.body.appendChild(transition);

  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);

  const backLink = document.querySelector(".back-link");
  if (backLink) {
    backLink.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      transition.classList.add("active");
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  }

  document.querySelectorAll('a[href^="index.html"], a[href^="menu.html"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.classList.contains("back-link")) return;
      e.preventDefault();
      const href = this.getAttribute("href");
      transition.classList.add("active");
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Mobile touch support for carousels
let touchStartX = 0;
let touchEndX = 0;

document.querySelectorAll(".carousel").forEach((carousel) => {
  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(carousel.id);
    },
    { passive: true }
  );
});

function handleSwipe(carouselId) {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) moveCarousel(carouselId, 1);
    else moveCarousel(carouselId, -1);
  }
}

// ---------- SUPABASE HYDRATION ----------
async function hydrateMenuFromSupabase() {
  const cfg = window.SUPABASE_CONFIG;
  if (!cfg?.url || !cfg?.anonKey) return;

  try {
    const url =
      `${cfg.url}/rest/v1/drinks` +
      `?select=id,name,price,color,category,availability` +
      `&availability=eq.true&order=category.asc,id.asc`;

    const res = await fetch(url, {
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`
      }
    });

    if (!res.ok) {
      console.error("Supabase drinks error:", res.status);
      return;
    }

    const drinks = await res.json();
    if (!Array.isArray(drinks) || drinks.length === 0) return;

    console.log("Drinks from Supabase:", drinks);

    const grouped = {};
    for (const d of drinks) {
      const cat = d.category || "Без категории";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(d);
    }

    let groups = Object.entries(grouped);
    if (groups.length > 3) {
      const merged = groups.slice(2).flatMap((g) => g[1]);
      groups = [groups[0], groups[1], ["Другое", merged]];
    }

    const carouselIds = ["carousel1", "carousel2", "carousel3"];
    const titleEls = document.querySelectorAll(".menu-category .category-title");

    carouselIds.forEach((id, i) => {
      const group = groups[i];
      if (!group) return;

      const category = group[0];
      const items = group[1];

      if (titleEls[i]) titleEls[i].textContent = category;
      applyDrinksToCarousel(id, items);
    });

    initDrinkCardHover();
  } catch (e) {
    console.error("Failed to hydrate menu:", e);
  }
}

function applyDrinksToCarousel(carouselId, items) {
  if (!items || !items.length) return;

  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  if (!track) return;

  let cards = Array.from(track.querySelectorAll(".drink-card"));
  if (!cards.length) return;

  const template = cards[0].cloneNode(true);

  while (cards.length < items.length) {
    const clone = template.cloneNode(true);
    clone.dataset.bound = "";
    track.appendChild(clone);
    cards.push(clone);
  }

  while (cards.length > items.length) {
    const last = cards.pop();
    if (last) last.remove();
  }

  cards.forEach((card, i) => {
    const d = items[i];

    const nameEl = card.querySelector(".drink-name");
    const priceEl = card.querySelector(".drink-price");
    const circleEl = card.querySelector(".drink-circle");

    if (nameEl) nameEl.textContent = d.name || "Напиток";
    if (priceEl) priceEl.textContent = `${Math.round(Number(d.price || 0))}р`;
    if (circleEl) {
      const color = d.color || "#FF6363";
      circleEl.style.background = color;
      card.setAttribute("data-color", color);
    }

    card.style.opacity = "";
    card.style.transform = "";
    card.style.filter = "";
  });

  if (carouselStates[carouselId]) {
    carouselStates[carouselId].currentIndex = Math.floor(items.length / 2);
    carouselStates[carouselId].isAnimating = false;
    carouselStates[carouselId].pendingDirection = 0;
  }

  updateCarousel(carouselId);

  cards.forEach(bindDrinkCardListeners);
}
