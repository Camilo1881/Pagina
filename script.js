// ====== CONFIGURACIÓN ====== //

const WHATSAPP_NUMBER = "573001112233"; // Cambia por tu número real con indicativo

const DEFAULT_HEADER_MSG = "Hola, me gustaría conocer más sobre Perfumes Fresh 💬";



// ====== HELPERS ======

const q = (sel, ctx = document) => ctx.querySelector(sel);
const qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const encode = (s) => encodeURIComponent(s);



function waUrl({ phone, text }) {

  return `https://wa.me/${phone}?text=${encode(text)}`;

}

function buildOrderMessage({ nombre, perfumes, envase, ubicacion }) {

  return [

    "🧾 Nuevo pedido desde la web:",
    `• Nombre: ${nombre}`,
    `• Perfumes: ${perfumes}`,
    `• Envase: ${envase}`,
    `• Ubicación: ${ubicacion}`,

    "",

    "Gracias, quedo pendiente ✅"

  ].join("\n");

}



// ====== FORMULARIO -> WHATSAPP ====== //

function initFormToWhatsApp() {

  const form = q("#formPedido");
  if (!form) return;

  form.addEventListener("submit", (e) => {

    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());



    const required = ["nombre", "perfumes", "envase", "ubicacion"];
    for (const field of required) {
      if (!data[field] || !data[field].toString().trim()) {
        alert(`Por favor completa el campo: ${field}`);
        return;
      }
    }

    const text = buildOrderMessage({

      nombre: data.nombre.trim(),
      perfumes: data.perfumes.trim(),
      envase: data.envase.trim(),
      ubicacion: data.ubicacion.trim()

    });
    window.open(waUrl({ phone: WHATSAPP_NUMBER, text }), "_blank");
  });

}



// ====== BOTONES "PEDIR" EN PRODUCTOS ======

function initProductButtons() {

  const cards = qa(".producto");
  if (!cards.length) return;

  cards.forEach((card) => {
    const nameEl = q("h3", card);
    const btn = q(".btn-wapp", card);
    if (!nameEl || !btn) return;

    const perfumeName = nameEl.textContent.trim();
    const msg = `Hola 👋, quiero el perfume: ${perfumeName}. ¿Me cuentas opciones de envase y precios?`;



    btn.setAttribute("href", waUrl({ phone: WHATSAPP_NUMBER, text: msg }));
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener");
  });

}



// ====== BOTÓN WHATSAPP DEL HEADER ======//
function initHeaderWhatsApp() {

  const headerBtn = qa("header .btn-wapp").find(Boolean);
  if (!headerBtn) return;

  const msg = headerBtn.getAttribute("data-text")?.trim() || DEFAULT_HEADER_MSG;
  headerBtn.setAttribute("href", waUrl({ phone: WHATSAPP_NUMBER, text: msg }));
  headerBtn.setAttribute("target", "_blank");
  headerBtn.setAttribute("rel", "noopener");

}

// ====== FILTROS DE CATÁLOGO ====== //

function initCatalogFilters() {
  const filterBar = q(".filtros");
  const products = qa(".producto");
  if (!filterBar || !products.length) return;

  const buttons = qa("button", filterBar);
  if (!buttons.length) return;

  // Ocultar todos los productos al inicio
  products.forEach(card => card.style.display = "none");

  function applyFilter(filter) {
    products.forEach((card) => {
      const cat = (card.getAttribute("data-category") || "").toLowerCase();
      const match = filter === "todos" || filter === cat;
      card.style.display = match ? "block" : "none";
    });
  }    

 // No se llama a applyFilter() aquí para que inicie vacío
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = (btn.getAttribute("data-filter") || btn.textContent).toLowerCase();
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(filter);
    });
  });
}

// ====== SCROLL SUAVE ====== //

function initSmoothScroll() {
  const links = qa('a[href^="#"]');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = id && q(id);
      if (!target) return;

      e.preventDefault();
      target.scrollintoview({
        behavior: "smooth",
        block: "start",
      })      
    });
  });
}
// ====== SWIPER DESTACADOS ======

function initSwiperDestacados() {

  new Swiper('.destacados-swiper', {

    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }

  });

}

// ====== INICIALIZACIÓN GENERAL ======

document.addEventListener("DOMContentLoaded", () => {

  initFormToWhatsApp();
  initProductButtons();
  initHeaderWhatsApp();
  initCatalogFilters();
  initSmoothScroll();
  initSwiperDestacados();
});