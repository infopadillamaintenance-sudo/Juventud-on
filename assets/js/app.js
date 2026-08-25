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
    // Cada reto enviado guarda su solicitud: nada suma puntos hasta que un
    // líder lo aprueba desde el panel de revisión.
    //   { [idReto]: { estado, fecha, prueba: {texto, foto}, motivo } }
    //   estado ∈ "pendiente" | "aprobado" | "rechazado"
    solicitudes: {},
    demo: false
  });

  let estado = estadoInicial();

  function cargar() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo) estado = Object.assign(estadoInicial(), JSON.parse(crudo));

      // Formato anterior: `retos` era una lista de ids ya completados y los
      // puntos se daban al instante. Se convierten en solicitudes aprobadas
      // para no borrarle el progreso a nadie que ya estuviera usando la web.
      if (Array.isArray(estado.retos)) {
        estado.retos.forEach((id) => {
          if (!estado.solicitudes[id]) {
            estado.solicitudes[id] = { estado: "aprobado", fecha: hoy(), prueba: null, migrado: true };
          }
        });
        delete estado.retos;
        guardar();
      }
    } catch (e) {
      /* localStorage bloqueado (modo privado, etc.): seguimos en memoria */
    }
  }
  /** Devuelve false si no se pudo persistir (cuota llena, modo privado…). */
  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
      return true;
    } catch (e) {
      return false; // sin persistencia, pero la sesión sigue funcionando
    }
  }

  /* ---------------------------------------------------------------- modo admin */

  /**
   * Las herramientas de líder (datos por completar y revisión de retos) están
   * ocultas para el público y se activan con ?admin=true en la URL, o al abrir
   * el sitio en local mientras se desarrolla.
   *
   * ATENCIÓN: esto NO es seguridad. Es un sitio estático: cualquiera que
   * escriba ?admin=true en la barra de direcciones entra. Sirve para que el
   * panel no moleste al público, no para proteger nada. Proteger de verdad
   * exige cuentas y servidor.
   */
  function esModoAdmin() {
    const p = new URLSearchParams(location.search);
    if (p.get("admin") === "true") {
      try { sessionStorage.setItem("juventud-on:admin", "1"); } catch (e) { /* da igual */ }
      return true;
    }
    if (p.get("admin") === "false") {
      try { sessionStorage.removeItem("juventud-on:admin"); } catch (e) { /* da igual */ }
      return false;
    }
    // Se recuerda durante la pestaña, para no arrastrar ?admin=true al navegar
    try { if (sessionStorage.getItem("juventud-on:admin")) return true; } catch (e) { /* da igual */ }

    // Desarrollo en local
    return ["localhost", "127.0.0.1", ""].includes(location.hostname);
  }

  function aplicarModoAdmin() {
    const admin = esModoAdmin();
    document.body.classList.toggle("modo-admin", admin);
    $("#barra-admin").classList.toggle("hidden", !admin);
    $("#barra-admin").classList.toggle("flex", admin);
    if (!admin) {
      $("#panel-pendientes").classList.add("hidden");
      $("#panel-revision").classList.add("hidden");
      document.body.classList.remove("mostrar-pendientes");
    }
    return admin;
  }

  /* ---------------------------------------------------------------- navegación */

  const VISTAS = ["inicio", "racha", "servir", "anuncios", "retos"];

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

  /* ---------------------------------------------------------------- servir */

  const COLORES = {
    violeta: ["border-violeta-500/40", "bg-violeta-500/15", "text-violeta-400"],
    magenta: ["border-magenta-500/40", "bg-magenta-500/15", "text-magenta-400"],
    cian:    ["border-cian-400/40",    "bg-cian-400/15",    "text-cian-400"],
    fuego:   ["border-fuego-500/40",   "bg-fuego-500/15",   "text-fuego-400"],
    ambar:   ["border-ambar-500/40",   "bg-ambar-500/15",   "text-ambar-500"]
  };

  /**
   * Atributos de fondo para una foto: la imagen real si existe, y si no un
   * degradado de marca de los que ya usa el resto del sitio.
   * `semilla` solo sirve para que dos bloques contiguos no salgan iguales.
   */
  function fondo(imagen, semilla, marcarPendiente) {
    if (imagen) {
      return `class="relative bg-cover bg-center" style="background-image:url('${esc(imagen)}')"`;
    }
    // Sin foto: degradado de marca. Solo se marca como pendiente la imagen
    // principal del ministerio; hacerlo también en cada área satura la vista.
    return `class="ph ph-${(semilla % 8) + 1} relative"${marcarPendiente ? " data-pendiente" : ""}`;
  }

  function pintarServir() {
    $("#req-titulo").textContent = REQUISITO_SERVIR.titulo;
    $("#req-texto").textContent = REQUISITO_SERVIR.texto;

    // Numeración explícita: es una secuencia real (Discipulado → bautismo →
    // servicio), no un adorno.
    $("#req-pasos").innerHTML = REQUISITO_SERVIR.pasos.map((p, i) => `
      <li class="rounded-2xl border border-white/10 bg-noche-900/60 p-4">
        <span class="grid h-8 w-8 place-items-center rounded-full bg-ambar-500 font-display text-base text-noche-950">${i + 1}</span>
        <p class="mt-3 font-display text-lg uppercase text-white">${esc(p.titulo)}</p>
        <p class="mt-1 text-sm text-white/55">${esc(p.detalle)}</p>
      </li>`).join("");

    $("#grid-ministerios").innerHTML = MINISTERIOS.map((m, iM) => {
      const [borde, tinte, texto] = COLORES[m.color] || COLORES.violeta;

      const areas = m.areas.length ? `
        <p class="mt-5 text-xs font-bold uppercase tracking-wider text-white/40">Áreas</p>
        <ul class="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5">
          ${m.areas.map((ar, iA) => `
            <li class="overflow-hidden rounded-xl border border-white/10 bg-noche-900/60">
              <span ${fondo(ar.imagen, iM * 3 + iA + 1, false)} style="display:grid;place-items:center;aspect-ratio:1">
                <span class="relative z-10 text-xl drop-shadow-lg" aria-hidden="true">${ar.icono}</span>
              </span>
              <span class="block px-1 py-1.5 text-center text-[0.7rem] font-semibold text-white/75">${esc(ar.nombre)}</span>
            </li>`).join("")}
        </ul>` : "";

      return `<article class="tarjeta overflow-hidden">
        <div ${fondo(m.imagen, iM, true)} style="aspect-ratio:16/7;width:100%">
          ${m.imagen ? "" : `<span class="absolute inset-0 z-10 grid place-items-center text-xs font-semibold text-white/45">
            📷 Aquí va una foto del equipo</span>`}
          <span class="absolute bottom-3 left-3 z-10 grid h-12 w-12 place-items-center rounded-2xl border ${borde} ${tinte} bg-noche-950/60 text-2xl backdrop-blur-sm" aria-hidden="true">${m.icono}</span>
        </div>
        <div class="p-5 sm:p-6">
          <p class="text-[0.65rem] font-bold uppercase tracking-wider ${texto}">${esc(m.subtitulo)}</p>
          <h4 class="display mt-1 text-2xl text-white">${esc(m.nombre)}</h4>
          <p class="mt-2 text-sm text-white/60">${esc(m.descripcion)}</p>
          ${areas}
        </div>
      </article>`;
    }).join("");
  }

  /* ---------------------------------------------------------------- anuncios */

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

  const ETIQUETAS = {
    pendiente: ["⏳", "Pendiente de verificación", "border-ambar-500/40 bg-ambar-500/10 text-ambar-500"],
    aprobado:  ["✅", "Aprobado", "border-cian-400/40 bg-cian-400/10 text-cian-400"],
    rechazado: ["✕",  "Rechazado", "border-rojo-500/40 bg-rojo-500/10 text-rojo-500"]
  };

  const solicitudDe = (id) => estado.solicitudes[id] || null;

  function pintarRetos() {
    $("#grid-retos").innerHTML = RETOS.map((r) => {
      const s = solicitudDe(r.id);
      const st = s && s.estado;
      const apagado = st === "aprobado" || st === "pendiente";

      let insignia = "";
      if (st) {
        const [ic, txt, clase] = ETIQUETAS[st];
        insignia = `<p class="mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-bold ${clase}">
          <span aria-hidden="true">${ic}</span>${txt}${st === "aprobado" ? ` · +${r.puntos}` : ""}</p>`;
      }

      const motivo = st === "rechazado" && s.motivo
        ? `<p class="mt-2 rounded-lg border border-rojo-500/25 bg-rojo-500/5 p-2.5 text-xs text-white/70"><strong class="text-rojo-500">Motivo:</strong> ${esc(s.motivo)}</p>`
        : "";

      const prueba = st === "pendiente" && s.prueba
        ? `<p class="mt-2 text-xs text-white/45">Enviaste: ${esc(s.prueba.texto)}${s.prueba.foto ? " · con foto" : ""}</p>`
        : "";

      let boton;
      if (st === "aprobado") {
        boton = `<button class="btn-secundario mt-4 w-full justify-center !py-2.5 !text-xs" disabled>✅ Aprobado</button>`;
      } else if (st === "pendiente") {
        boton = `<button data-cancelar="${r.id}" class="btn-secundario mt-4 w-full justify-center !py-2.5 !text-xs">Cancelar envío</button>`;
      } else {
        boton = `<button data-reto="${r.id}" class="btn-reto mt-4">${st === "rechazado" ? "Volver a enviar" : "Enviar prueba"}</button>`;
      }

      return `<article class="tarjeta flex flex-col p-5 ${apagado ? "opacity-70" : ""}">
        <div class="flex items-start gap-3">
          <span class="text-2xl" aria-hidden="true">${r.icono}</span>
          <div class="min-w-0 flex-1">
            <p class="text-[0.65rem] font-bold uppercase tracking-wider text-white/40">${esc(r.tipo)}</p>
            <h4 class="text-lg text-white">${esc(r.titulo)}</h4>
            <p class="mt-1 text-sm text-white/55">${esc(r.detalle)}</p>
          </div>
          <span class="shrink-0 rounded-full bg-ambar-500/15 px-2.5 py-1 text-xs font-bold text-ambar-500">+${r.puntos}</span>
        </div>
        ${insignia}${prueba}${motivo}
        ${boton}
      </article>`;
    }).join("");
  }

  /* --- Envío de la prueba --------------------------------------------------
     Aquí no se dan puntos: el reto queda "pendiente" hasta que un líder lo
     apruebe desde el panel de revisión. */

  /** Reduce la foto antes de guardarla: localStorage ronda los 5 MB y una foto
   *  de móvil sin tocar se lo come entero. */
  function comprimirFoto(archivo, ladoMax = 800, calidad = 0.7) {
    return new Promise((resolver, rechazar) => {
      if (!archivo.type.startsWith("image/")) return rechazar(new Error("Eso no es una imagen"));
      const lector = new FileReader();
      lector.onerror = () => rechazar(new Error("No se pudo leer el archivo"));
      lector.onload = () => {
        const img = new Image();
        img.onerror = () => rechazar(new Error("No se pudo abrir la imagen"));
        img.onload = () => {
          const escala = Math.min(1, ladoMax / Math.max(img.width, img.height));
          const lienzo = document.createElement("canvas");
          lienzo.width = Math.round(img.width * escala);
          lienzo.height = Math.round(img.height * escala);
          lienzo.getContext("2d").drawImage(img, 0, 0, lienzo.width, lienzo.height);
          resolver(lienzo.toDataURL("image/jpeg", calidad));
        };
        img.src = lector.result;
      };
      lector.readAsDataURL(archivo);
    });
  }

  let fotoEnCurso = null;

  function abrirEnvio(id) {
    const r = RETOS.find((x) => x.id === id);
    if (!r || (solicitudDe(id) || {}).estado === "pendiente") return;

    fotoEnCurso = null;
    $("#envio-titulo").textContent = r.titulo;
    $("#envio-puntos").textContent = `+${r.puntos} puntos si lo aprueban`;
    $("#envio-detalle").textContent = r.detalle;
    $("#form-envio").dataset.retoId = id; // no "reto": ese atributo lo usan los botones
    $("#envio-texto").value = "";
    $("#envio-foto").value = "";
    $("#envio-vista").innerHTML = "";
    $("#envio-vista").classList.add("hidden");

    const m = $("#modal-envio");
    m.classList.remove("hidden");
    m.classList.add("flex");
    document.body.style.overflow = "hidden";
    $("#envio-texto").focus();
  }

  function cerrarEnvio() {
    const m = $("#modal-envio");
    m.classList.add("hidden");
    m.classList.remove("flex");
    document.body.style.overflow = "";
    fotoEnCurso = null;
  }

  function enviarSolicitud(id, texto) {
    estado.solicitudes[id] = {
      estado: "pendiente",
      fecha: hoy(),
      prueba: { texto, foto: fotoEnCurso || null }
    };
    if (!guardar() && fotoEnCurso) {
      // La foto no cupo en localStorage: mejor guardar la solicitud sin ella
      // que perderla entera.
      estado.solicitudes[id].prueba.foto = null;
      guardar();
      toast("La foto no cabía; se envió solo la descripción");
    } else {
      toast("⏳ Enviado. Un líder lo revisará");
    }
    pintarRetos();
    pintarRevision();
  }

  function cancelarSolicitud(id) {
    if ((solicitudDe(id) || {}).estado !== "pendiente") return;
    delete estado.solicitudes[id];
    guardar();
    pintarRetos();
    pintarRevision();
    toast("Envío cancelado");
  }

  /* --- Panel de revisión (solo administrador) --- */

  function resolverSolicitud(id, aprobado, motivo) {
    const s = solicitudDe(id);
    const r = RETOS.find((x) => x.id === id);
    if (!s || !r) return;

    const eraAprobado = s.estado === "aprobado";
    s.estado = aprobado ? "aprobado" : "rechazado";
    s.motivo = aprobado ? null : (motivo || null);

    // Los puntos se mueven solo cuando el estado cambia de verdad, para que
    // aprobar dos veces no los duplique ni revocar los reste dos veces.
    if (aprobado && !eraAprobado) sumarPuntos(r.puntos);
    if (!aprobado && eraAprobado) sumarPuntos(-r.puntos);

    guardar();
    pintarRetos();
    pintarEquipos();
    pintarRevision();
    toast(aprobado ? `✅ Aprobado · +${r.puntos} puntos` : "Reto rechazado");
  }

  function pintarRevision() {
    const entradas = Object.entries(estado.solicitudes)
      .map(([id, s]) => [id, s, RETOS.find((r) => r.id === id)])
      .filter(([, , r]) => r);

    const orden = { pendiente: 0, rechazado: 1, aprobado: 2 };
    entradas.sort((a, b) => orden[a[1].estado] - orden[b[1].estado]);

    $("#num-revision").textContent = entradas.filter(([, s]) => s.estado === "pendiente").length;

    $("#lista-revision").innerHTML = entradas.length ? entradas.map(([id, s, r]) => {
      const [ic, txt, clase] = ETIQUETAS[s.estado];
      const foto = s.prueba && s.prueba.foto
        ? `<img src="${s.prueba.foto}" alt="Prueba enviada para ${esc(r.titulo)}" class="mt-3 max-h-48 w-full rounded-lg object-cover">`
        : "";
      const acciones = s.estado === "pendiente"
        ? `<div class="mt-3 flex gap-2">
             <button data-aprobar="${id}" class="btn-cian flex-1 justify-center !py-2 !text-xs">Aprobar</button>
             <button data-rechazar="${id}" class="btn-secundario flex-1 justify-center !py-2 !text-xs">Rechazar</button>
           </div>`
        : s.estado === "aprobado"
          ? `<button data-rechazar="${id}" class="mt-3 text-xs text-white/35 underline underline-offset-4 hover:text-rojo-500">Revocar la aprobación</button>`
          : "";

      return `<article class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-white">${r.icono} ${esc(r.titulo)}</p>
            <p class="text-xs text-white/45">Enviado el ${esc(s.fecha)} · vale ${r.puntos} puntos</p>
          </div>
          <span class="shrink-0 rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${clase}">${ic} ${txt}</span>
        </div>
        ${s.prueba && s.prueba.texto ? `<p class="mt-3 rounded-lg bg-noche-950/60 p-3 text-sm text-white/75">${esc(s.prueba.texto)}</p>` : ""}
        ${foto}
        ${s.motivo ? `<p class="mt-2 text-xs text-rojo-500">Motivo: ${esc(s.motivo)}</p>` : ""}
        ${acciones}
      </article>`;
    }).join("") : '<p class="text-sm text-white/35">Todavía no hay retos enviados.</p>';
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

  function alternarPanelRevision(abrir) {
    const panel = $("#panel-revision");
    const visible = abrir !== undefined ? abrir : panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !visible);
    if (visible) { pintarRevision(); $("#cerrar-revision").focus(); }
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
      // Los diálogos gestionan sus propios clics
      if (e.target.closest("#modal-envio")) return;

      const nav = e.target.closest("[data-ir]");
      if (nav) { e.preventDefault(); ir(nav.dataset.ir); return; }

      const reto = e.target.closest("[data-reto]");
      if (reto) { abrirEnvio(reto.dataset.reto); return; }

      const cancelar = e.target.closest("[data-cancelar]");
      if (cancelar) { cancelarSolicitud(cancelar.dataset.cancelar); return; }

      const aprobar = e.target.closest("[data-aprobar]");
      if (aprobar) { resolverSolicitud(aprobar.dataset.aprobar, true); return; }

      const rechazar = e.target.closest("[data-rechazar]");
      if (rechazar) {
        const motivo = prompt("Motivo del rechazo (opcional):") || "";
        resolverSolicitud(rechazar.dataset.rechazar, false, motivo.trim());
        return;
      }

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
    $("#btn-revision").addEventListener("click", () => alternarPanelRevision());
    $("#cerrar-revision").addEventListener("click", () => alternarPanelRevision(false));
    $("#cerrar-envio").addEventListener("click", cerrarEnvio);
    $("#modal-envio").addEventListener("click", (e) => { if (e.target === $("#modal-envio")) cerrarEnvio(); });

    $("#envio-foto").addEventListener("change", async (e) => {
      const archivo = e.target.files && e.target.files[0];
      const vista = $("#envio-vista");
      if (!archivo) { fotoEnCurso = null; vista.classList.add("hidden"); return; }
      try {
        fotoEnCurso = await comprimirFoto(archivo);
        vista.innerHTML = `<img src="${fotoEnCurso}" alt="Vista previa de la foto" class="max-h-40 w-full rounded-lg object-cover">`;
        vista.classList.remove("hidden");
      } catch (err) {
        fotoEnCurso = null;
        e.target.value = "";
        vista.classList.add("hidden");
        toast(err.message || "No se pudo usar esa foto");
      }
    });

    $("#form-envio").addEventListener("submit", (e) => {
      e.preventDefault();
      const texto = $("#envio-texto").value.trim();
      if (!texto) return;
      enviarSolicitud($("#form-envio").dataset.retoId, texto);
      cerrarEnvio();
    });

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
      if (e.key !== "Escape") return;
      if (!$("#modal-envio").classList.contains("hidden")) cerrarEnvio();
      else if (!$("#panel-revision").classList.contains("hidden")) alternarPanelRevision(false);
      else if (!$("#panel-pendientes").classList.contains("hidden")) alternarPanelPendientes(false);
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
    pintarServir();
    pintarAnuncios();
    pintarEquipos();
    pintarRetos();
    pintarRevision();
    pintarPendientes();
    $("#modo-demo").checked = estado.demo;
  }

  cargar();
  aplicarModoAdmin();
  pintarTodo();
  conectarEventos();
  ir(location.hash.slice(1) || "inicio");
  pintarCuentaRegresiva();
  setInterval(pintarCuentaRegresiva, 1000);
})();
