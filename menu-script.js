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
