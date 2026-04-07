document.addEventListener("DOMContentLoaded", function () {
  initBubbles();
  loadMenuFromSupabase();
});

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

    bubble.animate(
      [
        { transform: "translateY(0) translateX(0) scale(1)", opacity: bubble.style.opacity },
        { transform: `translateY(-${window.innerHeight + 100}px) translateX(${horizontalMovement}px) scale(0.5)`, opacity: 0 }
      ],
      { duration, easing: "ease-out" }
    ).onfinish = () => bubble.remove();
  }

  setInterval(createBubble, 800);
  for (let i = 0; i < 5; i++) setTimeout(createBubble, i * 200);
}

async function loadMenuFromSupabase() {
  const root = document.getElementById("menuFromDb");
  const cfg = window.SUPABASE_CONFIG;

  if (!root) return;

  if (!cfg || !cfg.url || !cfg.anonKey) {
    root.innerHTML = `<div class="menu-error">Ошибка: не настроен supabase-config.js</div>`;
    return;
  }

  try {
    const endpoint =
      `${cfg.url}/rest/v1/drinks` +
      `?select=id,name,price,color,category,availability` +
      `&availability=eq.true&order=category.asc,id.asc`;

    const res = await fetch(endpoint, {
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load drinks");
    }

    const drinks = await res.json();

    if (!Array.isArray(drinks) || drinks.length === 0) {
      root.innerHTML = `<div class="menu-empty">Пока нет напитков.</div>`;
      return;
    }

    const groups = drinks.reduce((acc, item) => {
      const category = item.category || "Без категории";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    root.innerHTML = Object.entries(groups)
      .map(([category, items]) => {
        return `
          <section class="menu-group">
            <h2 class="menu-group-title">${escapeHtml(category)}</h2>
            <div class="menu-grid-db">
              ${items
                .map((d) => {
                  const color = d.color || "#FF6363";
                  const price = Number(d.price || 0).toFixed(0);
                  return `
                    <article class="drink-db-card">
                      <div class="drink-db-circle" style="background:${escapeAttr(color)}"></div>
                      <h3>${escapeHtml(d.name || "Без названия")}</h3>
                      <p>${price}р</p>
                    </article>
                  `;
                })
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");
  } catch (_err) {
    root.innerHTML = `<div class="menu-error">Ошибка загрузки меню из Supabase.</div>`;
  }
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, function (s) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[s];
  });
}

function escapeAttr(str) {
  return String(str || "").replace(/"/g, "&quot;");
}

window.addEventListener("load", hydrateMenuFromSupabase);

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

    // Группировка по категории
    const grouped = {};
    for (const d of drinks) {
      const cat = d.category || "Без категории";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(d);
    }

    const groups = Object.entries(grouped); // [ [category, items], ... ]
    const carouselIds = ["carousel1", "carousel2", "carousel3"];
    const titleEls = document.querySelectorAll(".menu-category .category-title");

    // Если категорий больше 3 - лишние добавляем в 3-ю
    if (groups.length > 3) {
      const merged = groups.slice(2).flatMap((g) => g[1]);
      groups.splice(2, groups.length - 2, ["Другое", merged]);
    }

    carouselIds.forEach((id, i) => {
      const group = groups[i];
      if (!group) return;

      const [category, items] = group;

      if (titleEls[i]) titleEls[i].textContent = category;
      applyDrinksToCarousel(id, items);
    });

    // обновим обработчики на случай новых карточек
    if (typeof initDrinkCardHover === "function") {
      initDrinkCardHover();
    }
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

  // подгоняем количество карточек
  while (cards.length < items.length) {
    const clone = template.cloneNode(true);
    track.appendChild(clone);
    cards.push(clone);
  }
  while (cards.length > items.length) {
    cards.pop().remove();
  }

  cards.forEach((card, i) => {
    const d = items[i];
    const nameEl = card.querySelector(".drink-name");
    const priceEl = card.querySelector(".drink-price");
    const circleEl = card.querySelector(".drink-circle");

    if (nameEl) nameEl.textContent = d.name || "Напиток";
    if (priceEl) priceEl.textContent = `${Math.round(Number(d.price || 0))}р`;
    if (circleEl) circleEl.style.background = d.color || "#FF6363";
  });

  // выставим активную карточку по центру
  if (typeof carouselStates !== "undefined" && carouselStates[carouselId]) {
    carouselStates[carouselId].currentIndex = Math.floor(items.length / 2);
  }
  if (typeof updateCarousel === "function") {
    updateCarousel(carouselId);
  }
}
