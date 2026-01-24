async function cargarSecciones() {
  const res = await fetch("assets/secciones.json", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar assets/secciones.json");
  return await res.json();
}

function normalizar(txt = "") {
  return txt.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function crearCard(sec) {
  const tags = (sec.tags || []).map(t => `
    <span class="text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded">${t}</span>
  `).join("");

  return `
    <a href="${sec.ruta}" class="card block bg-white border border-slate-200 rounded-xl p-6">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
          <i class="${sec.icono || "fa-solid fa-file"}"></i>
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-lg leading-snug">${sec.titulo}</h3>
          <p class="text-sm text-slate-600 mt-2">${sec.descripcion || ""}</p>
          <div class="flex flex-wrap gap-2 mt-4">${tags}</div>
        </div>
      </div>
    </a>
  `;
}

function poblarTags(secciones) {
  const tagSelect = document.getElementById("tag");
  const set = new Set();
  secciones.forEach(s => (s.tags || []).forEach(t => set.add(t)));
  [...set].sort().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tagSelect.appendChild(opt);
  });
}

function render(secciones, filtroTexto, filtroTag) {
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");

  const ft = normalizar(filtroTexto);
  const filtradas = secciones.filter(s => {
    const blob = normalizar(`${s.titulo} ${s.descripcion} ${(s.tags || []).join(" ")}`);
    const okTexto = !ft || blob.includes(ft);
    const okTag = !filtroTag || (s.tags || []).includes(filtroTag);
    return okTexto && okTag;
  });

  count.textContent = `${filtradas.length} sección(es)`;
  grid.innerHTML = filtradas.map(crearCard).join("") || `
    <div class="col-span-full text-slate-600 bg-white border border-slate-200 rounded-xl p-6">
      No hay resultados con esos filtros.
    </div>
  `;
}

(async function init() {
  try {
    const secciones = await cargarSecciones();
    const q = document.getElementById("q");
    const tag = document.getElementById("tag");

    poblarTags(secciones);
    render(secciones, "", "");

    q.addEventListener("input", () => render(secciones, q.value, tag.value));
    tag.addEventListener("change", () => render(secciones, q.value, tag.value));
  } catch (e) {
    document.getElementById("grid").innerHTML = `
      <div class="col-span-full text-red-700 bg-red-50 border border-red-200 rounded-xl p-6">
        Error cargando secciones: ${e.message}
      </div>
    `;
  }
})();
