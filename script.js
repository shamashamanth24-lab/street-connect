// StreetConnect demo website
// Data is saved only in this browser using localStorage. This is not a live government service.

const STORAGE_KEY = "streetconnect_vendors";
const PRODUCT_KEY = "streetconnect_products";
const SUPPORT_KEY = "streetconnect_support";
const REVIEW_KEY = "streetconnect_reviews";

const sampleVendors = [
  {id:"SC-DEMO101",name:"Ananya Rao",business:"Ananya Fresh Fruits",category:"Fruits",phone:"9876543210",email:"ananya@example.com",address:"Jayanagar 4th Block",city:"Bengaluru",pin:"560011",status:"Approved",available:true,photo:"https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=700&q=80"},
  {id:"SC-DEMO102",name:"Ramesh Kumar",business:"Ramesh Vegetable Cart",category:"Vegetables",phone:"9876501234",email:"",address:"RR Nagar, near bus stop",city:"Bengaluru",pin:"560098",status:"Pending",available:true,photo:"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80"},
  {id:"SC-DEMO103",name:"Farah Begum",business:"Farah's Flower Stall",category:"Flowers",phone:"9988776655",email:"",address:"Vijayanagar Market",city:"Bengaluru",pin:"560040",status:"Approved",available:false,photo:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80"},
  {id:"SC-DEMO104",name:"Suresh",business:"South Spice Snacks",category:"Food",phone:"9900112233",email:"",address:"Basavanagudi Main Road",city:"Bengaluru",pin:"560004",status:"Rejected",available:true,photo:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"},
  {id:"SC-DEMO105",name:"Meena",business:"Meena Clothing Corner",category:"Clothing",phone:"9845012345",email:"",address:"Malleshwaram 8th Cross",city:"Bengaluru",pin:"560003",status:"Approved",available:true,photo:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80"},
  {id:"SC-DEMO106",name:"Imran Khan",business:"Fresh Cut Sugarcane",category:"Food",phone:"9845098765",email:"",address:"Kengeri Satellite Town",city:"Bengaluru",pin:"560060",status:"Pending",available:true,photo:"https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=700&q=80"}
];

function getVendors() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (error) { console.error("Could not read vendor data", error); }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleVendors));
  return [...sampleVendors];
}
function saveVendors(vendors) { localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors)); }
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
}
function placeholderPhoto(category) {
  const photos = {
    Food:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80",
    Vegetables:"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
    Fruits:"https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=700&q=80",
    Flowers:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80",
    Clothing:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
    Other:"https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=700&q=80"
  };
  return photos[category] || photos.Other;
}

function renderVendors() {
  const grid = document.getElementById("vendorGrid");
  const search = document.getElementById("vendorSearch").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const filtered = getVendors().filter(v => {
    const matchesSearch = [v.name,v.business,v.city,v.address,v.category].join(" ").toLowerCase().includes(search);
    return matchesSearch && (category === "all" || v.category === category) && v.status !== "Rejected";
  });
  grid.innerHTML = filtered.map(v => `
    <article class="vendor-card">
      <div class="vendor-image"><img src="${escapeHTML(v.photo || placeholderPhoto(v.category))}" alt="${escapeHTML(v.business)}" onerror="this.src='${placeholderPhoto(v.category)}'"></div>
      <div class="vendor-info">
        <span class="category-tag">${escapeHTML(v.category)}</span>
        <h3>${escapeHTML(v.business)}</h3>
        <p class="business-name">Vendor: ${escapeHTML(v.name)}</p>
        <p class="vendor-meta">📍 ${escapeHTML(v.address)}, ${escapeHTML(v.city)} ${escapeHTML(v.pin)}</p>
        <p class="vendor-meta">${v.available ? "🟢 Available" : "⚪ Currently unavailable"}</p>
        <div class="vendor-actions"><button onclick="viewVendor('${v.id}')">View details</button><a href="https://wa.me/91${encodeURIComponent(v.phone)}" target="_blank" rel="noopener">WhatsApp ↗</a></div>
      </div>
    </article>`).join("");
  document.getElementById("noVendors").classList.toggle("hidden", filtered.length !== 0);
}
window.viewVendor = function(id) {
  const vendor = getVendors().find(v => v.id === id);
  if (!vendor) return;
  alert(`VENDOR DETAILS\n\n${vendor.business}\nVendor: ${vendor.name}\nCategory: ${vendor.category}\nLocation: ${vendor.address}, ${vendor.city} - ${vendor.pin}\nContact: ${vendor.phone}\nStatus: ${vendor.status}\n\nThis is sample information from the demo website.`);
};

function updateStats() {
  const vendors = getVendors();
  document.getElementById("statVendors").textContent = `${vendors.length}+`;
  document.getElementById("statActive").textContent = `${vendors.filter(v => v.available && v.status === "Approved").length}+`;
}
function renderAdmin() {
  const vendors = getVendors();
  const query = document.getElementById("adminSearch").value.toLowerCase();
  const status = document.getElementById("adminFilter").value;
  document.getElementById("adminTotal").textContent = vendors.length;
  document.getElementById("adminPending").textContent = vendors.filter(v => v.status === "Pending").length;
  document.getElementById("adminApproved").textContent = vendors.filter(v => v.status === "Approved").length;
  document.getElementById("adminRejected").textContent = vendors.filter(v => v.status === "Rejected").length;
  const shown = vendors.filter(v => `${v.id} ${v.name} ${v.business} ${v.city}`.toLowerCase().includes(query) && (status === "all" || v.status === status));
  document.getElementById("adminTable").innerHTML = shown.map(v => `
    <tr><td>${escapeHTML(v.id)}</td><td><strong>${escapeHTML(v.name)}</strong><br>${escapeHTML(v.business)}</td><td>${escapeHTML(v.category)}</td><td>${escapeHTML(v.city)}</td>
    <td><span class="status ${v.status.toLowerCase()}">${v.status}</span></td>
    <td><button class="table-action approve" onclick="updateVendorStatus('${v.id}','Approved')">Approve</button><button class="table-action reject" onclick="updateVendorStatus('${v.id}','Rejected')">Reject</button></td></tr>`).join("") || `<tr><td colspan="6">No applications found.</td></tr>`;
}
window.updateVendorStatus = function(id, status) {
  const vendors = getVendors();
  const vendor = vendors.find(v => v.id === id);
  if (!vendor) return;
  vendor.status = status;
  saveVendors(vendors);
  renderAdmin(); renderVendors(); updateStats();
  if (currentVendorId === id) loadVendorDashboard(id);
  showToast(`${vendor.business}: demo status changed to ${status}.`);
};

let currentVendorId = null;
function loadVendorDashboard(id) {
  const vendor = getVendors().find(v => v.id === id);
  if (!vendor) { showToast("No vendor profile found. Register first."); return; }
  currentVendorId = id;
  document.getElementById("dashboardStatus").textContent = vendor.status === "Pending" ? "Pending review" : vendor.status;
  document.getElementById("dashboardStatus").className = `status ${vendor.status.toLowerCase()}`;
  document.getElementById("profileContent").innerHTML = `<p><strong>${escapeHTML(vendor.business)}</strong></p><p class="muted">Vendor: ${escapeHTML(vendor.name)}</p><p class="muted">ID: ${escapeHTML(vendor.id)}</p><p class="muted">Category: ${escapeHTML(vendor.category)}</p><p class="muted">📍 ${escapeHTML(vendor.address)}, ${escapeHTML(vendor.city)} - ${escapeHTML(vendor.pin)}</p><p class="muted">☎ ${escapeHTML(vendor.phone)}</p>`;
  document.getElementById("availabilityToggle").checked = !!vendor.available;
  document.getElementById("availabilityText").textContent = vendor.available ? "Your business is marked available." : "Your business is marked unavailable.";
  renderProducts();
  const qrText = encodeURIComponent(`${location.origin}${location.pathname}#vendor-${vendor.id}`);
  document.getElementById("qrContainer").innerHTML = `<img alt="QR code for ${escapeHTML(vendor.business)}" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrText}">`;
}
function renderProducts() {
  const products = JSON.parse(localStorage.getItem(PRODUCT_KEY) || "{}");
  const items = currentVendorId ? (products[currentVendorId] || []) : [];
  document.getElementById("productList").innerHTML = items.length ? items.map((p,i) => `<div class="product-row"><span>${escapeHTML(p.name)}</span><strong>₹${Number(p.price).toFixed(2)}</strong><button onclick="deleteProduct(${i})">Remove</button></div>`).join("") : `<p class="muted">No products added yet.</p>`;
}
window.deleteProduct = function(index) {
  const products = JSON.parse(localStorage.getItem(PRODUCT_KEY) || "{}");
  products[currentVendorId].splice(index,1);
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  renderProducts();
};

document.getElementById("registrationForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const photoFile = data.get("photo");
  let photo = "";
  if (photoFile && photoFile.size) {
    if (!photoFile.type.startsWith("image/")) { showToast("Please upload an image file."); return; }
    if (photoFile.size > 1024 * 1024) { showToast("Please choose an image smaller than 1 MB."); return; }
    photo = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(photoFile);
    });
  }
  const vendors = getVendors();
  const id = `SC-${Date.now().toString().slice(-7)}`;
  const vendor = {
    id, name:data.get("name").trim(), phone:data.get("phone").trim(), email:data.get("email").trim(),
    business:data.get("business").trim(), category:data.get("category"), address:data.get("address").trim(),
    city:data.get("city").trim(), pin:data.get("pin").trim(), photo:photo || placeholderPhoto(data.get("category")),
    status:"Pending", available:true
  };
  vendors.unshift(vendor); saveVendors(vendors);
  document.getElementById("registrationMessage").textContent = `Success! Your demo Vendor ID is ${id}. Registration status: Pending.`;
  form.reset(); renderVendors(); renderAdmin(); updateStats(); loadVendorDashboard(id);
  showToast("Registration submitted. Your demo status is Pending.");
});

document.getElementById("productForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!currentVendorId) { showToast("Load or register a vendor profile first."); return; }
  const name = document.getElementById("productName").value.trim();
  const price = Number(document.getElementById("productPrice").value);
  if (!name || price < 0 || !Number.isFinite(price)) return;
  const products = JSON.parse(localStorage.getItem(PRODUCT_KEY) || "{}");
  products[currentVendorId] = products[currentVendorId] || [];
  products[currentVendorId].push({name,price});
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  event.currentTarget.reset(); renderProducts(); showToast("Product added to your demo profile.");
});
document.getElementById("availabilityToggle").addEventListener("change", event => {
  if (!currentVendorId) { event.target.checked = true; showToast("Register or load a vendor profile first."); return; }
  const vendors = getVendors();
  const vendor = vendors.find(v => v.id === currentVendorId);
  vendor.available = event.target.checked; saveVendors(vendors);
  document.getElementById("availabilityText").textContent = vendor.available ? "Your business is marked available." : "Your business is marked unavailable.";
  renderVendors(); updateStats(); showToast("Availability updated.");
});
document.getElementById("loadLatest").addEventListener("click", () => {
  const latest = getVendors()[0];
  if (latest) { loadVendorDashboard(latest.id); showToast("Loaded the latest vendor profile."); }
});
document.getElementById("supportForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const requests = JSON.parse(localStorage.getItem(SUPPORT_KEY) || "[]");
  requests.push({...data, createdAt:new Date().toISOString()});
  localStorage.setItem(SUPPORT_KEY, JSON.stringify(requests));
  event.currentTarget.reset();
  document.getElementById("supportMessage").textContent = "Your demo support request has been saved in this browser.";
  showToast("Support request saved locally.");
});
document.getElementById("reviewForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const reviews = JSON.parse(localStorage.getItem(REVIEW_KEY) || "[]");
  reviews.push({...data, createdAt:new Date().toISOString()});
  localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
  event.currentTarget.reset();
  document.getElementById("reviewMessage").textContent = "Thank you! Your demo review was saved.";
  showToast("Review saved locally.");
});

document.getElementById("vendorSearch").addEventListener("input", renderVendors);
document.getElementById("categoryFilter").addEventListener("change", renderVendors);
document.getElementById("adminSearch").addEventListener("input", renderAdmin);
document.getElementById("adminFilter").addEventListener("change", renderAdmin);
document.getElementById("loginNav").addEventListener("click", () => {
  document.getElementById("dashboard").scrollIntoView({behavior:"smooth"});
  showToast("Demo mode: use the vendor dashboard below.");
});
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open")));

// Lightweight bilingual text toggle for selected navigation and hero labels.
const translations = {
  en:{home:"Home",about:"About",vendors:"Find Vendors",register:"Vendor Registration",support:"Support",hero:"Empowering Street Vendors Digitally."},
  kn:{home:"ಮುಖಪುಟ",about:"ನಮ್ಮ ಬಗ್ಗೆ",vendors:"ವ್ಯಾಪಾರಿಗಳನ್ನು ಹುಡುಕಿ",register:"ಮಾರಾಟಗಾರರ ನೋಂದಣಿ",support:"ಸಹಾಯ",hero:"ಬೀದಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಡಿಜಿಟಲ್ ಶಕ್ತಿ."}
};
document.getElementById("languageSelect").addEventListener("change", event => {
  const t = translations[event.target.value];
  const links = document.querySelectorAll("#mainNav a");
  if (event.target.value === "kn") {
    links[0].textContent=t.home; links[1].textContent=t.about; links[2].textContent=t.vendors; links[3].textContent=t.register; links[4].textContent=t.support;
    document.querySelector(".hero h1").textContent=t.hero;
  } else {
    links[0].textContent="Home"; links[1].textContent="About"; links[2].textContent="Find Vendors"; links[3].textContent="Vendor Registration"; links[4].textContent="Support";
    document.querySelector(".hero h1").innerHTML='Empowering Street Vendors <span>Digitally.</span>';
  }
});

renderVendors();
renderAdmin();
updateStats();
