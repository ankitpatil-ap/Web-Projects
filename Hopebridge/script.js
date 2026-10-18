// Listing data taken from Justdial search results (Nashik only). Edit here to add or fix entries.
const ORGS = [
  { name:"Anath Balakashram Orphanage", img:"images/anath.jpg", rating:4.7, ratings:508, badge:"Top Search", kind:"Orphanage",
    area:"Nashik Trimbakeshwar Road, Gangapur Road", tags:["Orphanages","Ashrams"], phone:"" },
  { name:"Kiran Vikas Group", img:"images/kiran.jpg", rating:4.2, ratings:33, badge:"Trending", kind:"Child welfare",
    area:"Makhmalabad Road, Canada Corner", tags:["NGOs For Child Labour","NGOs"], phone:"08401094508" },
  { name:"Sahara Care Centre & Old Age Home", img:"images/sahara.jpg", rating:4.0, ratings:53, badge:"Responsive", kind:"Elder care",
    area:"Anandwalli Gaon", tags:["NGOs","Institutions For Aged"], phone:"07383357367", highlight:"High call pick up rate" },
  { name:"Sukh Samruddhi Care Centre", img:"images/sukh.jpg", rating:4.3, ratings:69, badge:"Trending", kind:"Care centre",
    area:"Meri Rasbihari Road, Panchavati", tags:["Healthcare","7 years in healthcare"], phone:"08401342062", open24:true, highlight:"Open 24 hours" }
];

const $ = id => document.getElementById(id);
const mk = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x) n.textContent = x; return n; };
const intl = p => "+91" + p.replace(/\D/g, "").replace(/^0/, "");
let kind = "All";

function link(cls, text, href, ext) {
  const a = mk("a", "btn " + cls, text); a.href = href;
  if (ext) { a.target = "_blank"; a.rel = "noopener"; }
  return a;
}

function card(o, i) {
  const el = mk("article", "org k" + (i % 4 + 1));
  const ph = mk("div", "ph"), img = mk("img");
  img.src = o.img; img.alt = o.name; img.loading = "lazy";
  ph.append(img, mk("span", "kind", o.kind)); el.append(ph);
  const b = mk("div", "body");
  b.append(mk("h3", "", o.name));
  const m = mk("div", "meta");
  m.append(mk("span", "rate", o.rating.toFixed(1) + " \u2605"), mk("span", "", o.ratings + " ratings"), mk("span", "badge", o.badge));
  b.append(m, mk("p", "addr", o.area + ", Nashik"));
  const t = mk("div", "tags"); o.tags.forEach(x => t.append(mk("span", "", x))); b.append(t);
  if (o.highlight) b.append(mk("p", "hl", o.highlight));
  const a = mk("div", "acts");
  if (o.phone) {
    a.append(link("call", "Call " + o.phone, "tel:" + intl(o.phone)),
             link("wa", "WhatsApp", "https://wa.me/" + intl(o.phone).slice(1), true));
  } else {
    a.append(mk("span", "btn off", "Number not shown in source"));
  }
  a.append(link("map", "Directions", "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(o.name + ", " + o.area + ", Nashik"), true));
  b.append(a); el.append(b); return el;
}

function render() {
  const q = $("q").value.trim().toLowerCase();
  const rows = ORGS.filter(o => (kind === "All" || o.kind === kind) &&
    (!q || [o.name, o.area, o.kind, o.tags.join(" ")].join(" ").toLowerCase().includes(q)));
  const list = $("list"); list.replaceChildren();
  if (!rows.length) list.append(mk("div", "empty", "No matches. Try another type or clear the search."));
  rows.forEach(o => list.append(card(o, ORGS.indexOf(o))));
  $("count").textContent = rows.length + " of " + ORGS.length + " organisations shown";
}

function init() {
  ["All", ...new Set(ORGS.map(o => o.kind))].forEach(c => {
    const b = mk("button", "chip", c); b.type = "button"; b.setAttribute("aria-pressed", c === "All");
    b.addEventListener("click", () => { kind = c; [...$("chips").children].forEach(x => x.setAttribute("aria-pressed", x === b)); render(); });
    $("chips").append(b);
  });
  $("q").addEventListener("input", render);
  const total = ORGS.reduce((s, o) => s + o.ratings, 0);
  $("sCount").textContent = ORGS.length;
  $("sRate").textContent = (ORGS.reduce((s, o) => s + o.rating, 0) / ORGS.length).toFixed(1);
  $("s24").textContent = ORGS.filter(o => o.open24).length;
  $("sPeople").textContent = total;
  $("year").textContent = "\u00A9 " + new Date().getFullYear() + " Hopebridge";
  render();
}
init();
