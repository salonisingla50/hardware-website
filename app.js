const CONFIG = {
  SHEET_ID: "1wQsRlecyCphDCQ5DTFzGnJGwJN5NsDJK",
  PRODUCTS_SHEET: "Products",
  VIDEOS_SHEET: "Videos",
  FEATURED_VIDEOS: [
    {
      id: "FEATURED-001",
      title: "VAAMS ITALIAN",
      video_url: "https://drive.google.com/file/d/1xi9w6-DxfY8hFH1LVlmiWOFwiWexjYaL/view?usp=drive_link",
      thumbnail_url: "",
      active: true
    }
  ],
  UPI_ID: "vaams88888.ibz@icici",
  UPI_NAME: "VAAMS Italian",
  PAYMENT_KEY_HASH: "ad6113dc67594b2be69649d90e530e9ec58becc9c3d511705a0730adca0d653d"
};

const CONTACT = {
  phone: "+91 95170 83300",
  digits: "919517083300",
  salesPhone: "+91 93570 40000",
  salesDigits: "919357040000",
  email: "vaamsitalian@gmail.com",
  instagram: "https://www.instagram.com/vaamsitalian.in?igsh=MmI5aXltNXdoZmll&utm_source=qr",
  youtube: "https://youtube.com/@vaamsitalian?si=cXd7yQvolP5HIau4",
  directions: "https://www.google.com/maps/dir/?api=1&destination=Dr.+Melaram+Road,+Nr.+SBI+Bank,+Bathinda,+Punjab+151001"
};

const DEMO_PRODUCTS = [
  { id: "VI-001", name: "Premium Cabinet Handle", category: "Cabinet Hardware", image_url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80", description: "Contemporary handle for kitchens, wardrobes, and premium furniture.", in_stock: true },
  { id: "VI-002", name: "Stainless Steel Hinge", category: "Door Hardware", image_url: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80", description: "Durable hinge engineered for smooth movement and long service life.", in_stock: true },
  { id: "VI-003", name: "Designer Basin Mixer", category: "Bath Fittings", image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80", description: "Refined bathroom fitting with a clean, modern Italian-inspired profile.", in_stock: true },
  { id: "VI-004", name: "Soft-Close Drawer Channel", category: "Furniture Fittings", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80", description: "Smooth soft-close movement for modular furniture applications.", in_stock: true },
  { id: "VI-005", name: "Multipurpose Fastener Set", category: "Fasteners", image_url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=900&q=80", description: "Reliable fastening selection for installers and project requirements.", in_stock: true },
  { id: "VI-006", name: "Architectural Door Handle", category: "Door Hardware", image_url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80", description: "Statement door hardware built for residential and commercial interiors.", in_stock: true }
];

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  hydrateSharedLinks();
  markActivePage();
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  if (document.querySelector("#product-grid")) initializeProducts();
  if (document.querySelector("#video-grid")) initializeVideos();
  if (document.querySelector("#payment-lock")) initializePayment();
  if (document.querySelector("#contact-form")) initializeContactForm();
});

function bindNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}

async function initializeVideos() {
  let videos = [];
  const status = document.querySelector("#video-status");
  if (CONFIG.SHEET_ID) {
    try {
      videos = await fetchSheetRows(CONFIG.VIDEOS_SHEET);
    } catch (error) {
      status.textContent = "Videos will appear here when valid links are added to the Videos sheet.";
    }
  } else {
    status.textContent = "Add video links in the included catalogue workbook, then connect its Google Sheet ID in app.js.";
  }
  const activeVideos = [...CONFIG.FEATURED_VIDEOS, ...videos.filter(video => truthy(video.active))]
    .filter((video, index, items) => items.findIndex(item => item.video_url === video.video_url) === index)
    .filter(video => getYouTubeId(video.video_url) || getGoogleDriveId(video.video_url) || isDirectVideoUrl(video.video_url));
  renderVideos(activeVideos);
}

function markActivePage() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === page) link.classList.add("active");
  });
}

function hydrateSharedLinks() {
  const whatsapp = `https://wa.me/${CONTACT.digits}?text=${encodeURIComponent("Hello VAAMS Italian, I would like to enquire about your products.")}`;
  document.querySelectorAll("[data-phone]").forEach(el => {
    el.textContent = CONTACT.phone;
    if (el.tagName === "A") el.href = `tel:+${CONTACT.digits}`;
  });
  document.querySelectorAll("[data-email]").forEach(el => {
    el.textContent = CONTACT.email;
    if (el.tagName === "A") el.href = `mailto:${CONTACT.email}`;
  });
  document.querySelectorAll("[data-sales-phone]").forEach(el => {
    el.textContent = CONTACT.salesPhone;
    if (el.tagName === "A") el.href = `tel:+${CONTACT.salesDigits}`;
  });
  document.querySelectorAll("[data-whatsapp]").forEach(el => el.href = whatsapp);
  document.querySelectorAll("[data-instagram]").forEach(el => el.href = CONTACT.instagram);
  document.querySelectorAll("[data-youtube]").forEach(el => el.href = CONTACT.youtube);
  document.querySelectorAll("[data-directions]").forEach(el => el.href = CONTACT.directions);
}

async function initializeProducts() {
  let products = DEMO_PRODUCTS;
  const status = document.querySelector("#catalog-status");
  if (CONFIG.SHEET_ID) {
    try {
      products = await fetchProducts();
    } catch (error) {
      status.textContent = "Live catalogue could not be loaded. Showing sample products.";
    }
  } else {
    status.textContent = "Showing sample products. Upload the included Excel template to Google Sheets and add its Sheet ID in app.js to publish your full catalogue.";
  }
  window.catalogProducts = products.filter(product => truthy(product.in_stock));
  renderCategories(window.catalogProducts);
  renderProducts(window.catalogProducts);
  document.querySelector("#product-search").addEventListener("input", filterProducts);
  document.querySelector("#category-select").addEventListener("change", filterProducts);
}

async function fetchProducts() {
  return fetchSheetRows(CONFIG.PRODUCTS_SHEET);
}

async function fetchSheetRows(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Catalogue load failed");
  const text = await response.text();
  const data = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  const headers = data.table.cols.map(col => String(col.label || "").trim().toLowerCase());
  return data.table.rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row.c[index]?.v ?? ""])));
}

function renderVideos(videos) {
  const grid = document.querySelector("#video-grid");
  if (!videos.length) {
    grid.innerHTML = '<div class="catalog-status">No videos added yet.</div>';
    return;
  }
  grid.innerHTML = videos.map(video => {
    const youtubeId = getYouTubeId(video.video_url);
    const driveId = getGoogleDriveId(video.video_url);
    const directUrl = driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : video.video_url;
    const directVideo = driveId || isDirectVideoUrl(video.video_url);
    const media = youtubeId
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0" title="${escapeHtml(video.title)}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : directVideo
        ? `<video class="story-video" autoplay muted loop playsinline preload="metadata" ${video.thumbnail_url ? `poster="${escapeHtml(video.thumbnail_url)}"` : ""}><source src="${escapeHtml(directUrl)}" type="video/mp4">Your browser does not support this video.</video><button class="story-sound" type="button" aria-label="Toggle video sound"><i class="fa-solid fa-volume-xmark"></i></button>`
        : `<a class="video-link-card" href="${escapeHtml(video.video_url)}" target="_blank" rel="noopener"><i class="fa-brands fa-youtube"></i><strong>Open video channel or link</strong><span>Use an individual YouTube video link to play it directly on this page.</span></a>`;
    return `<article class="video-card">${media}<div class="video-copy"><h3>${escapeHtml(video.title || "VAAMS Italian Story")}</h3></div></article>`;
  }).join("");
  setupStoryCarousel();
}

function getYouTubeId(url) {
  const match = String(url || "").match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : "";
}

function getGoogleDriveId(url) {
  const match = String(url || "").match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : "";
}

function isDirectVideoUrl(url) {
  const value = String(url || "");
  return !/example\.com/i.test(value) && /\.(mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(value);
}

function setupStoryCarousel() {
  const track = document.querySelector("#video-grid");
  const shell = document.querySelector(".stories-shell");
  const previous = document.querySelector(".story-prev");
  const next = document.querySelector(".story-next");
  if (!track || !previous || !next) return;
  const singleStory = track.querySelectorAll(".video-card").length === 1;
  track.classList.toggle("single-story", singleStory);
  shell?.classList.toggle("single-story", singleStory);
  const move = direction => track.scrollBy({ left: direction * Math.min(track.clientWidth * .8, 820), behavior: "smooth" });
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.querySelectorAll(".story-sound").forEach(button => button.addEventListener("click", () => {
    const video = button.parentElement.querySelector("video");
    video.muted = !video.muted;
    button.innerHTML = `<i class="fa-solid ${video.muted ? "fa-volume-xmark" : "fa-volume-high"}"></i>`;
  }));
}

function renderCategories(products) {
  const categories = ["All", ...new Set(products.map(product => product.category).filter(Boolean))];
  const select = document.querySelector("#category-select");
  const tabs = document.querySelector("#category-tabs");
  select.innerHTML = categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
  tabs.innerHTML = categories.map((category, index) => `<button class="category-tab ${index === 0 ? "active" : ""}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");
  tabs.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    select.value = button.dataset.category;
    tabs.querySelectorAll("button").forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    filterProducts();
  }));
}

function filterProducts() {
  const search = document.querySelector("#product-search").value.trim().toLowerCase();
  const category = document.querySelector("#category-select").value;
  const filtered = window.catalogProducts.filter(product => {
    const matchesCategory = category === "All" || product.category === category;
    const haystack = `${product.name} ${product.category} ${product.description} ${product.id}`.toLowerCase();
    return matchesCategory && haystack.includes(search);
  });
  document.querySelectorAll(".category-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.category === category));
  renderProducts(filtered);
}

function renderProducts(products) {
  const grid = document.querySelector("#product-grid");
  if (!products.length) {
    grid.innerHTML = '<div class="catalog-status">No products match your search.</div>';
    return;
  }
  grid.innerHTML = products.map(product => `
    <article class="product-card">
      <img src="${escapeHtml(product.image_url || "assets/vaams-logo.png")}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='assets/vaams-logo.png'">
      <div class="product-content">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-code">Product code: ${escapeHtml(product.id)}</div>
      </div>
    </article>
  `).join("");
}

function initializePayment() {
  const form = document.querySelector("#payment-lock");
  const status = document.querySelector("#payment-status");
  const reveal = document.querySelector("#payment-reveal");
  const upiUri = `upi://pay?pa=${encodeURIComponent(CONFIG.UPI_ID)}&pn=${encodeURIComponent(CONFIG.UPI_NAME)}`;
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const entered = document.querySelector("#payment-key").value;
    const hash = await sha256(entered);
    if (hash !== CONFIG.PAYMENT_KEY_HASH) {
      status.textContent = "Incorrect payment key. Please call VAAMS Italian for access.";
      reveal.classList.remove("visible");
      return;
    }
    status.textContent = "";
    document.querySelector("#upi-id").textContent = CONFIG.UPI_ID;
    document.querySelector("#upi-link").href = upiUri;
    document.querySelector("#upi-qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUri)}`;
    reveal.classList.add("visible");
    document.querySelector("#payment-key").value = "";
  });
  document.querySelector("#lock-again").addEventListener("click", () => {
    reveal.classList.remove("visible");
    document.querySelector("#upi-qr").removeAttribute("src");
  });
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function initializeContactForm() {
  document.querySelector("#contact-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = `Hello VAAMS Italian,%0A%0AName: ${encodeURIComponent(form.get("name"))}%0APhone: ${encodeURIComponent(form.get("phone"))}%0ARequirement: ${encodeURIComponent(form.get("message"))}`;
    window.open(`https://wa.me/${CONTACT.digits}?text=${message}`, "_blank", "noopener");
  });
}

function truthy(value) {
  return value === true || String(value).toLowerCase() === "true" || String(value) === "1";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}
