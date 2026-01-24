// assets/section-nav.js
// Barra superior automática para TODAS las secciones
// - Botón "Volver al inicio"
// - Botón "Descargar PDF" y "Ver PDF" si existe planCompleto en secciones.json
// - Preparado para futuras opciones (breadcrumbs, login, etc.)

(async function () {
  try {
    // Detectar nombre del archivo actual (ej: fm-3-07-san-remo.html)
    const currentFile = location.pathname.split("/").pop();

    // Cargar secciones.json
    const res = await fetch("../assets/secciones.json", { cache: "no-store" });
    if (!res.ok) return;
    const secciones = await res.json();

    // Buscar la sección actual
    const sec = secciones.find(s => (s.ruta || "").endsWith(currentFile));

    // Crear contenedor
    const bar = document.createElement("div");
    bar.className =
      "sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200";

    // Botón inicio (siempre)
    let html = `
      <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="../index.html"
           class="text-sm font-semibold text-slate-900 hover:underline">
          ← Volver al inicio
        </a>
        <div class="flex items-center gap-2">
    `;

    // Botones PDF (solo si la sección tiene planCompleto)
    if (sec && sec.planCompleto) {
      html += `
        <a href="../${sec.planCompleto}" download
           class="text-sm font-semibold px-3 py-2 rounded-lg bg-slate-900 text-white">
          ⬇️ Descargar PDF
        </a>
        <a href="../${sec.planCompleto}" target="_blank" rel="noopener"
           class="text-sm font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900">
          👁️ Ver PDF
        </a>
      `;
    }

    html += `
        </div>
      </div>
    `;

    bar.innerHTML = html;

    // Insertar la barra al inicio del body
    document.body.prepend(bar);

  } catch (e) {
    // Silencioso a propósito: nunca rompe la página
    console.warn("section-nav.js:", e.message);
  }
})();
