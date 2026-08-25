/* ============================================================================
   Juventud ON — lógica del prototipo
   ----------------------------------------------------------------------------
   Todo el estado (rachas, retos, puntos) se guarda en
   localStorage, o sea SOLO en el dispositivo de cada persona. Para que sea
   compartido y real hace falta backend + cuentas (ver README, siguientes pasos).
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------------------------------------------------------------- utilidades */

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /** Fecha local en formato YYYY-MM-DD (no UTC: importa para la racha). */
  const iso = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  const hoy = () => iso(new Date());
  const sumarDias = (fecha, n) => {
    const d = new Date(fecha);
    d.setDate(d.getDate() + n);
    return d;
  };
  const ayer = () => iso(sumarDias(new Date(), -1));

  /** Viernes más reciente en o antes de `d`. */
  const viernesDe = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const diff = (x.getDay() - 5 + 7) % 7; // 5 = viernes
    x.setDate(x.getDate() - diff);
    return x;
  };

  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const DIAS_LARGOS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  /**
   * Muestra un dato real, un placeholder resaltado si sigue en [COMPLETAR],
   * o nada en absoluto si es null (el ministerio no tiene ese dato).
   */
  const dato = (valor, pista) => {
    if (valor == null) return "";
    if (valor === PENDIENTE) {
      return `<span class="font-semibold text-ambar-500" data-pendiente>[COMPLETAR]${pista ? " " + esc(pista) : ""}</span>`;
    }
    return esc(valor);
  };

  let temporizadorToast;
  function toast(mensaje) {
    const t = $("#toast");
    t.textContent = mensaje;
    t.style.opacity = "1";
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => (t.style.opacity = "0"), 2600);
  }

  /* ---------------------------------------------------------------- estado */

  const CLAVE = "juventud-on:v1";

  const estadoInicial = () => ({
    dev:   { ultimo: null, racha: 0, record: 0, historial: [] },
    asis:  { ultimo: null, racha: 0, historial: [] },
    puntos: 0,
    equipo: EQUIPOS[0].id,
    retos: [],          // ids de retos completados
    demo: false
  });

  let estado = estadoInicial();

  function cargar() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo) estado = Object.assign(estadoInicial(), JSON.parse(crudo));
    } catch (e) {
      /* localStorage bloqueado (modo privado, etc.): seguimos en memoria */
    }
  }
  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (e) { /* sin persistencia, pero la sesión sigue funcionando */ }
  }

  /* ---------------------------------------------------------------- navegación */

  const VISTAS = ["inicio", "racha", "anuncios", "retos"];

  function ir(vista) {
    if (!VISTAS.includes(vista)) vista = "inicio";
    VISTAS.forEach((v) => $("#vista-" + v).classList.toggle("hidden", v !== vista));
    $$("[data-ir]").forEach((b) =>
      b.setAttribute("aria-current", b.dataset.ir === vista ? "page" : "false"));
    // En algunos contextos (iframe en sandbox, file://) replaceState lanza
    // SecurityError. La navegación ya funcionó, así que no debe romper nada.
    try {
      if (location.hash.slice(1) !== vista) history.replaceState(null, "", "#" + vista);
    } catch (e) { /* sin cambio de URL, la navegación sigue funcionando */ }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ---------------------------------------------------------------- cuenta regresiva */

  function proximoServicio() {
    const ahora = new Date();
    const d = new Date(ahora);
    const dif = (5 - ahora.getDay() + 7) % 7; // próximo viernes
    d.setDate(ahora.getDate() + dif);
    d.setHours(CONFIG.servicio.horas, CONFIG.servicio.minutos, 0, 0);
    if (d < ahora) {
      // Ya pasó la hora de hoy: ¿sigue en vivo (2h de servicio) o toca la próxima semana?
      const fin = new Date(d.getTime() + 2 * 60 * 60 * 1000);
      if (ahora < fin) return { enVivo: true, fecha: d };
      d.setDate(d.getDate() + 7);
    }
    return { enVivo: false, fecha: d };
  }

  function pintarCuentaRegresiva() {
    const destino = $("#cuenta-regresiva");
    if (!destino) return;
    const { enVivo, fecha } = proximoServicio();
    if (enVivo) {
      destino.innerHTML = '<span class="text-rojo-500">en vivo ahora mismo</span>';
      return;
    }
    let ms = fecha - new Date();
    const dias = Math.floor(ms / 86400000); ms -= dias * 86400000;
    const hrs  = Math.floor(ms / 3600000);  ms -= hrs * 3600000;
    const min  = Math.floor(ms / 60000);    ms -= min * 60000;
    const seg  = Math.floor(ms / 1000);
    destino.textContent = dias > 0
      ? `${dias}d ${hrs}h ${min}m`
      : `${String(hrs).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  }

  /* ---------------------------------------------------------------- inicio */

  function pintarInicio() {
    $("#txt-mision").textContent = CONFIG.mision;
    $("#txt-vision").textContent = CONFIG.vision;

    $("#grid-valores").innerHTML = CONFIG.valores.map((v) => `
      <article class="tarjeta p-5">
        <p class="text-2xl" aria-hidden="true">${v.icono}</p>
        <h3 class="mt-2 text-lg text-white">${esc(v.titulo)}</h3>
        <p class="mt-1 text-sm text-white/55">${esc(v.texto)}</p>
      </article>`).join("");

    $("#txt-edades").textContent = CONFIG.edades ? `Para jóvenes de ${CONFIG.edades}` : "";

    // Dirección, con enlace a Google Maps si lo hay
    $("#txt-direccion").innerHTML = dato(CONFIG.ubicacion.direccion, "· dirección exacta") +
      (CONFIG.ubicacion.mapa
        ? ` · <a href="${CONFIG.ubicacion.mapa}" target="_blank" rel="noopener"
             class="font-semibold text-cian-400 underline underline-offset-2">Cómo llegar</a>`
        : "");

    // El Instagram va primero porque es el canal por el que más responden.
    // Las filas con valor null (no existen) se omiten enteras, sin dejar hueco.
    const enlace = "font-semibold text-white underline underline-offset-2 break-all";
    const filas = [
      { icono: "📸", etiqueta: "Instagram",
        html: `<a href="${CONFIG.redes.instagram.url}" target="_blank" rel="noopener" class="${enlace}">${esc(CONFIG.redes.instagram.handle)}</a>
               <span class="text-white/45">— por mensaje directo</span>` },
      { icono: "✉️", etiqueta: "Correo", valor: CONFIG.contacto.email, esquema: "mailto:" },
      { icono: "💬", etiqueta: "WhatsApp", valor: CONFIG.contacto.whatsapp, esquema: "https://wa.me/" },
      { icono: "📞", etiqueta: "Teléfono", valor: CONFIG.contacto.telefono, esquema: "tel:" }
    ].filter((f) => f.html || f.valor != null);

    $("#lista-contacto").innerHTML = filas.map((f) => {
      let cuerpo;
      if (f.html) cuerpo = f.html;
      else if (f.valor === PENDIENTE) cuerpo = dato(f.valor);
      else cuerpo = `<a href="${esc(f.esquema + String(f.valor).replace(/\s/g, ""))}" class="${enlace}">${esc(f.valor)}</a>`;
      return `<li class="flex gap-3"><span aria-hidden="true">${f.icono}</span>
        <span><strong class="text-white">${f.etiqueta}</strong><br>
        <span class="text-sm">${cuerpo}</span></span></li>`;
    }).join("");

    // Solo las redes que el ministerio realmente tiene. El Instagram propio no
    // se repite aquí: ya aparece arriba como vía de contacto.
    $("#lista-redes").innerHTML = [
      ["La iglesia", CONFIG.redes.instagramIglesia]
    ].filter(([, r]) => r && r.url).map(([n, r]) => `
      <a href="${r.url}" target="_blank" rel="noopener"
         class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
         ${n} <span class="text-white/45">${esc(r.handle)}</span></a>`).join("");
  }

  /* ---------------------------------------------------------------- racha: devocional */

  /** Tiempo de lectura estimado (~180 palabras por minuto), mínimo 1 minuto. */
  function minutosDeLectura(d) {
    const palabras = [d.versiculo].concat(d.reflexion, d.reto || []).join(" ").split(/\s+/).length;
    return Math.max(1, Math.round(palabras / 180));
  }

  /** Devocional del día: rota por día del año, así todos ven el mismo. */
  function devocionalDeHoy() {
    const inicio = new Date(new Date().getFullYear(), 0, 0);
    const diaDelAnio = Math.floor((new Date() - inicio) / 86400000);
    return DEVOCIONALES[diaDelAnio % DEVOCIONALES.length];
  }

  /** La racha solo sigue viva si se completó hoy o ayer. */
  function rachaDevVigente() {
    if (estado.dev.ultimo === hoy() || estado.dev.ultimo === ayer()) return estado.dev.racha;
    return 0;
  }

  /** Casillas de la semana (lunes a domingo) marcadas con lo ya completado. */
  function casillasSemana(compacto) {
    const base = new Date();
    const lunes = sumarDias(base, -((base.getDay() + 6) % 7));
    return ["L", "M", "X", "J", "V", "S", "D"].map((letra, i) => {
      const dia = iso(sumarDias(lunes, i));
      const completado = estado.dev.historial.includes(dia);
      const clase = completado ? "dia-hecho" : dia === hoy() ? "dia-hoy" : "dia-vacio";
      return `<div class="dia-semana ${clase} ${compacto ? "!text-[0.6rem]" : ""}" title="${dia}">${completado ? "🔥" : letra}</div>`;
    }).join("");
  }

  function pintarHero() {
    const racha = rachaDevVigente();
    $("#hero-racha-dev").textContent = racha;
    $("#hero-racha-asis").textContent = estado.asis.racha;
    $("#hero-semana").innerHTML = casillasSemana(true);
    $("#hero-mensaje").textContent = racha === 0
      ? "Tu racha empieza hoy"
      : racha < 7
        ? "Vas bien. No la rompas."
        : "Imparable. Sigue así.";
  }

  function pintarDevocional() {
    const d = devocionalDeHoy();
    const hecho = estado.dev.ultimo === hoy();
    const racha = rachaDevVigente();

    $("#num-racha-dev").textContent = racha;
    $("#chip-racha").textContent = racha;
    $("#record-dev").innerHTML = `Tu récord<br><strong class="text-white">${estado.dev.record} día${estado.dev.record === 1 ? "" : "s"}</strong>`;

    const f = new Date();
    $("#dev-fecha").textContent = `${DIAS_LARGOS[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]}`;
    $("#dev-duracion").textContent = `${d.minutos || minutosDeLectura(d)} min de lectura`;
    $("#dev-titulo").textContent = d.titulo;
    $("#dev-versiculo").textContent = `“${d.versiculo}”`;
    $("#dev-ref").textContent = d.ref + " (RVR1960)";
    $("#dev-reflexion").innerHTML = d.reflexion.map((p) => `<p>${esc(p)}</p>`).join("");
    // Crédito de la fuente, cuando el devocional viene de otro autor o libro
    $("#dev-fuente").classList.toggle("hidden", !d.fuente);
    if (d.fuente) $("#dev-fuente").textContent = d.fuente;

    // El reto es opcional: el contenido oficial del liderazgo no lo trae
    $("#dev-reto-bloque").classList.toggle("hidden", !d.reto);
    if (d.reto) $("#dev-reto").textContent = d.reto;

    // El aviso de "contenido de ejemplo" solo aparece si aún no está revisado
    $("#dev-aviso").classList.toggle("hidden", d.revisado === true);

    const btn = $("#btn-devocional");
    btn.disabled = hecho;
    btn.textContent = hecho ? "✅ Completado hoy — nos vemos mañana" : "Marcar como completado";

    $("#semana-dev").innerHTML = casillasSemana(false);
    pintarHero();
  }

  function marcarDevocional() {
    if (estado.dev.ultimo === hoy()) return;
    estado.dev.racha = estado.dev.ultimo === ayer() ? estado.dev.racha + 1 : 1;
    estado.dev.ultimo = hoy();
    estado.dev.record = Math.max(estado.dev.record, estado.dev.racha);
    if (!estado.dev.historial.includes(hoy())) estado.dev.historial.push(hoy());
    sumarPuntos(10);
    guardar();
    pintarDevocional();
    pintarLogros();
    pintarEquipos(); // los +10 puntos deben verse también en la pestaña de Retos
    $("#num-racha-dev").classList.remove("pop");
    void $("#num-racha-dev").offsetWidth;
    $("#num-racha-dev").classList.add("pop");
    toast(`🔥 ¡Racha de ${estado.dev.racha}! +10 puntos`);
  }

  /* ---------------------------------------------------------------- racha: asistencia */

  function pintarAsistencia() {
    const viernesActual = iso(viernesDe(new Date()));
    const esViernes = new Date().getDay() === 5;
    const yaMarcado = estado.asis.historial.includes(viernesActual);

    $("#num-racha-asis").textContent = estado.asis.racha;

    // Últimos 5 viernes, del más antiguo al más reciente
    const chips = [];
    for (let i = 4; i >= 0; i--) {
      const v = sumarDias(viernesDe(new Date()), -7 * i);
      const clave = iso(v);
      const presente = estado.asis.historial.includes(clave);
      const clase = presente
        ? "border-cian-400/60 bg-cian-400/15 text-cian-400"
        : "border-white/10 bg-white/[0.02] text-white/30";
      chips.push(`<div class="viernes-chip ${clase}">
        <span class="text-[0.6rem] font-semibold uppercase">${v.getDate()} ${MESES[v.getMonth()]}</span>
        <span class="text-base leading-none" aria-hidden="true">${presente ? "✓" : "·"}</span>
        <span class="sr-only">${presente ? "asististe" : "sin marcar"}</span>
      </div>`);
    }
    $("#viernes-lista").innerHTML = chips.join("");

    const btn = $("#btn-asistencia");
    const msg = $("#msg-asistencia");
    if (yaMarcado) {
      btn.disabled = true;
      btn.textContent = "✅ Asistencia marcada";
      msg.textContent = "Nos vemos el próximo viernes.";
    } else if (esViernes || estado.demo) {
      btn.disabled = false;
      btn.textContent = "Estoy aquí ✋";
      msg.textContent = estado.demo && !esViernes
        ? "Modo demo activo: estás marcando el viernes más reciente."
        : "Marca tu asistencia cuando llegues al servicio.";
    } else {
      btn.disabled = true;
      btn.textContent = "Se activa el viernes";
      msg.textContent = "El botón se enciende los viernes a la hora del servicio.";
    }
  }

  function marcarAsistencia() {
    const viernesActual = iso(viernesDe(new Date()));
    if (estado.asis.historial.includes(viernesActual)) return;
    const viernesAnterior = iso(sumarDias(viernesDe(new Date()), -7));
    estado.asis.racha = estado.asis.ultimo === viernesAnterior ? estado.asis.racha + 1 : 1;
    estado.asis.ultimo = viernesActual;
    estado.asis.historial.push(viernesActual);
    sumarPuntos(25);
    guardar();
    pintarAsistencia();
    pintarHero();
    pintarLogros();
    pintarEquipos(); // los +25 puntos deben verse también en la pestaña de Retos
    toast(`📅 ${estado.asis.racha} viernes seguidos. +25 puntos`);
  }

  /* ---------------------------------------------------------------- logros */

  function pintarLogros() {
    $("#grid-logros").innerHTML = LOGROS.map((l) => {
      const actual = l.tipo === "devocional" ? estado.dev.record : estado.asis.racha;
      const logrado = actual >= l.meta;
      const pct = Math.min(100, Math.round((actual / l.meta) * 100));
      return `<article class="tarjeta p-5 ${logrado ? "glow-violeta" : "opacity-60"}">
        <div class="flex items-center gap-3">
          <span class="text-3xl ${logrado ? "" : "grayscale"}" aria-hidden="true">${l.icono}</span>
          <div class="min-w-0">
            <h4 class="text-base text-white">${esc(l.titulo)}</h4>
            <p class="text-xs text-white/50">${esc(l.detalle)}</p>
          </div>
        </div>
        <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div class="h-full grad-on" style="width:${pct}%"></div>
        </div>
        <p class="mt-1.5 text-right text-[0.7rem] font-semibold ${logrado ? "text-violeta-400" : "text-white/40"}">
          ${logrado ? "¡Desbloqueada!" : `${actual} / ${l.meta}`}
        </p>
      </article>`;
    }).join("");
  }

  /* ---------------------------------------------------------------- anuncios */

  const COLORES = {
    violeta: ["border-violeta-500/40", "bg-violeta-500/15", "text-violeta-400"],
    magenta: ["border-magenta-500/40", "bg-magenta-500/15", "text-magenta-400"],
    cian:    ["border-cian-400/40",    "bg-cian-400/15",    "text-cian-400"],
    fuego:   ["border-fuego-500/40",   "bg-fuego-500/15",   "text-fuego-400"],
    ambar:   ["border-ambar-500/40",   "bg-ambar-500/15",   "text-ambar-500"]
  };

  function pintarAnuncios() {
    $("#lista-anuncios").innerHTML = ANUNCIOS.map((a) => {
      const [borde, fondo, texto] = COLORES[a.color] || COLORES.violeta;
      return `<article class="tarjeta ${a.fijado ? "borde-grad" : ""} p-6">
        <div class="flex flex-wrap items-center gap-2">
          ${a.fijado ? '<span class="rounded-full grad-on px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">📌 Fijado</span>' : ""}
          <span class="rounded-full border ${borde} ${fondo} px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${texto}">${esc(a.etiqueta)}</span>
          <span class="ml-auto rounded-full bg-white/5 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white/50">Oficial</span>
        </div>

        <h3 class="mt-4 text-2xl text-white">${esc(a.titulo)}</h3>

        <dl class="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/60">
          <div class="flex gap-2"><dt aria-hidden="true">🗓️</dt><dd>${dato(a.cuando, "· fecha")}</dd></div>
          <div class="flex gap-2"><dt aria-hidden="true">📍</dt><dd>${dato(a.lugar, "· lugar")}</dd></div>
        </dl>

        <p class="mt-4 text-white/75">${esc(a.texto)}</p>

        <div class="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-4">
          <span class="avatar !h-9 !w-9 text-xs">${esc(a.autor.inicial)}</span>
          <p class="text-sm">
            <span class="font-semibold text-white">${dato(a.autor.nombre, "· nombre")}</span><br>
            <span class="text-xs text-white/45">${esc(a.autor.rol)}</span>
          </p>
          <button class="btn-secundario ml-auto !px-4 !py-2 !text-xs" data-anuncio="${esc(a.cta.accion)}">${esc(a.cta.texto)}</button>
        </div>
      </article>`;
    }).join("");
  }

  /* ---------------------------------------------------------------- retos y equipos */

  function puntosDeEquipo(id) {
    const base = EQUIPOS.find((e) => e.id === id).puntos;
    return id === estado.equipo ? base + estado.puntos : base;
  }

  function sumarPuntos(n) {
    estado.puntos += n;
  }

  const DEGRADADOS = {
    fuego:   "linear-gradient(90deg,#ff7a18,#ffc233)",
    ambar:   "linear-gradient(90deg,#ffb800,#ffa03d)",
    cian:    "linear-gradient(90deg,#06b6d4,#67e8f9)",
    magenta: "linear-gradient(90deg,#ff2d8a,#ff5fa2)",
    violeta: "linear-gradient(90deg,#7c3aed,#a78bfa)"
  };

  function pintarEquipos() {
    $("#mis-puntos").textContent = estado.puntos.toLocaleString("es");

    const sel = $("#sel-equipo");
    if (!sel.options.length) {
      sel.innerHTML = EQUIPOS.map((e) => `<option value="${e.id}">${e.emoji} ${esc(e.nombre)}</option>`).join("");
    }
    sel.value = estado.equipo;

    const orden = EQUIPOS.slice().sort((a, b) => puntosDeEquipo(b.id) - puntosDeEquipo(a.id));
    const tope = puntosDeEquipo(orden[0].id);
    const medallas = ["🥇", "🥈", "🥉", ""];

    $("#tabla-equipos").innerHTML = orden.map((e, i) => {
      const pts = puntosDeEquipo(e.id);
      const mio = e.id === estado.equipo;
      const [borde] = COLORES[e.color] || COLORES.violeta;
      return `<article class="tarjeta ${mio ? "glow-violeta" : ""} flex items-center gap-4 p-4">
        <span class="w-7 text-center text-xl" aria-hidden="true">${medallas[i] || i + 1}</span>
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${borde} bg-white/5 text-xl" aria-hidden="true">${e.emoji}</span>
        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-2 font-semibold text-white">${esc(e.nombre)}
            ${mio ? '<span class="rounded-full bg-violeta-500/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-violeta-400">Tu equipo</span>' : ""}</p>
          <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
            <div class="h-full transition-all duration-700" style="width:${Math.round((pts / tope) * 100)}%;background-image:${DEGRADADOS[e.color] || DEGRADADOS.violeta}"></div>
          </div>
        </div>
        <div class="text-right">
          <p class="font-display text-xl text-white">${pts.toLocaleString("es")}</p>
          <p class="text-[0.65rem] text-white/40">${e.miembros} jóvenes</p>
        </div>
      </article>`;
    }).join("");
  }

  function pintarRetos() {
    $("#grid-retos").innerHTML = RETOS.map((r) => {
      const hecho = estado.retos.includes(r.id);
      return `<article class="tarjeta flex flex-col p-5 ${hecho ? "opacity-60" : ""}">
        <div class="flex items-start gap-3">
          <span class="text-2xl" aria-hidden="true">${r.icono}</span>
          <div class="min-w-0 flex-1">
            <p class="text-[0.65rem] font-bold uppercase tracking-wider text-white/40">${esc(r.tipo)}</p>
            <h4 class="text-lg text-white">${esc(r.titulo)}</h4>
            <p class="mt-1 text-sm text-white/55">${esc(r.detalle)}</p>
          </div>
          <span class="shrink-0 rounded-full bg-ambar-500/15 px-2.5 py-1 text-xs font-bold text-ambar-500">+${r.puntos}</span>
        </div>
        <button data-reto="${r.id}" class="${hecho ? "btn-secundario w-full justify-center !py-2.5 !text-xs" : "btn-reto"} mt-4" ${hecho ? "disabled" : ""}>
          ${hecho ? "✅ Completado" : "Marcar completado"}
        </button>
      </article>`;
    }).join("");
  }

  function completarReto(id) {
    if (estado.retos.includes(id)) return;
    const r = RETOS.find((x) => x.id === id);
    estado.retos.push(id);
    sumarPuntos(r.puntos);
    guardar();
    pintarRetos();
    pintarEquipos();
    toast(`⚡ +${r.puntos} puntos para tu equipo`);
  }

  /* ---------------------------------------------------------------- pendientes */

  function pintarPendientes() {
    $("#num-pendientes").textContent = PENDIENTES.length;
    $("#lista-pendientes").innerHTML = PENDIENTES.map((p) => `
      <li class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p class="font-semibold text-white">${esc(p.campo)}</p>
        <p class="mt-1 text-xs text-white/45">Aparece en: ${esc(p.donde)}</p>
        <p class="mt-1 text-xs"><code class="text-ambar-500">${esc(p.archivo)}</code></p>
      </li>`).join("");
  }

  function alternarPanelPendientes(abrir) {
    const panel = $("#panel-pendientes");
    const visible = abrir !== undefined ? abrir : panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !visible);
    document.body.classList.toggle("mostrar-pendientes", visible);
    if (visible) $("#cerrar-pendientes").focus();
  }

  /* ---------------------------------------------------------------- eventos */

  function conectarEventos() {
    document.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-ir]");
      if (nav) { e.preventDefault(); ir(nav.dataset.ir); return; }

      const reto = e.target.closest("[data-reto]");
      if (reto) { completarReto(reto.dataset.reto); return; }

      const anuncio = e.target.closest("[data-anuncio]");
      if (anuncio) {
        const accion = anuncio.dataset.anuncio;
        if (accion === "ir-racha") {
          ir("racha");
        } else if (accion === "instagram") {
          window.open(CONFIG.redes.instagram.url, "_blank", "noopener");
        } else {
          ir("inicio");
          setTimeout(() => $("#info").scrollIntoView({ behavior: "smooth" }), 60);
        }
        return;
      }
    });

    $("#btn-devocional").addEventListener("click", marcarDevocional);
    $("#btn-asistencia").addEventListener("click", marcarAsistencia);
    $("#btn-pendientes").addEventListener("click", () => alternarPanelPendientes());
    $("#cerrar-pendientes").addEventListener("click", () => alternarPanelPendientes(false));

    $("#sel-equipo").addEventListener("change", (e) => {
      estado.equipo = e.target.value;
      guardar();
      pintarEquipos();
      toast("Equipo actualizado");
    });

    $("#modo-demo").addEventListener("change", (e) => {
      estado.demo = e.target.checked;
      guardar();
      pintarAsistencia();
    });

    $("#btn-reset").addEventListener("click", () => {
      if (!confirm("¿Borrar tu racha y tus puntos de este dispositivo?")) return;
      estado = estadoInicial();
      guardar();
      pintarTodo();
      toast("Progreso reiniciado");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !$("#panel-pendientes").classList.contains("hidden")) {
        alternarPanelPendientes(false);
      }
    });

    window.addEventListener("hashchange", () => ir(location.hash.slice(1)));
  }

  /* ---------------------------------------------------------------- arranque */

  function pintarTodo() {
    pintarInicio();
    pintarHero();
    pintarDevocional();
    pintarAsistencia();
    pintarLogros();
    pintarAnuncios();
    pintarEquipos();
    pintarRetos();
    pintarPendientes();
    $("#modo-demo").checked = estado.demo;
  }

  cargar();
  pintarTodo();
  conectarEventos();
  ir(location.hash.slice(1) || "inicio");
  pintarCuentaRegresiva();
  setInterval(pintarCuentaRegresiva, 1000);
})();
