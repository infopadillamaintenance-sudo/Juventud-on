/* ============================================================================
   Juventud ON — datos del sitio
   ----------------------------------------------------------------------------
   TODO lo editable del sitio vive en este archivo. No hace falta tocar el HTML
   para cambiar horarios, anuncios, devocionales, equipos o retos.

   ⚠ El valor PENDIENTE marca datos reales que todavía no se han confirmado
   (ver contexto/02-informacion-practica.md). Están a propósito: no se inventan
   direcciones, teléfonos ni correos. Sustituye PENDIENTE por el dato real y
   la web lo muestra automáticamente.
   ========================================================================== */

const PENDIENTE = "[COMPLETAR]";

/* ---------------------------------------------------------------------------
   1. Identidad y datos prácticos
   Fuente: contexto/01-sobre-juventud-on.md y contexto/02-informacion-practica.md
   ------------------------------------------------------------------------- */
const CONFIG = {
  ministerio: "Juventud ON",
  iglesia: "Odres Nuevos",
  descripcionCorta: "El ministerio juvenil de Odres Nuevos",
  // Tomado literal de la bio de Instagram
  bioInstagram: "Grupo de jóvenes en @odresaruba — Todos los viernes a las 7:30pm",

  // BORRADOR sugerido en contexto/01 — el liderazgo debe confirmar o reemplazar
  mision:
    "Acercar a los jóvenes a la Palabra de Dios de una manera relevante, dinámica y cercana a su generación, formando una comunidad de jóvenes comprometidos con su fe.",
  vision:
    "Ser una comunidad juvenil referente que impacte a una nueva generación de jóvenes con el mensaje de Cristo, dentro y fuera de la iglesia.",
  valores: [
    { icono: "📖", titulo: "Fe real", texto: "Compromiso con la Palabra, no con la apariencia." },
    { icono: "🤝", titulo: "Comunidad", texto: "Aquí nadie camina solo." },
    { icono: "💯", titulo: "Autenticidad", texto: "Vivir la fe sin fingir." },
    { icono: "🙌", titulo: "Servicio", texto: "A la iglesia, a la comunidad y entre nosotros." },
    { icono: "⚡", titulo: "Excelencia", texto: "Damos lo mejor en todo lo que hacemos." },
    { icono: "🎉", titulo: "Diversión con propósito", texto: "Reír juntos también nos acerca." }
  ],
  lema: PENDIENTE, // ¿existe un lema o versículo oficial del ministerio?
  edades: PENDIENTE, // rango de edad del ministerio (ej. 13-25 años)

  servicio: {
    dia: "Viernes",
    diaSemana: 5, // 0 = domingo … 5 = viernes
    hora: "7:30pm",
    horas: 19,
    minutos: 30,
    lugar: "Iglesia Odres Nuevos",
    ciudad: "Aruba"
  },

  ubicacion: {
    direccion: PENDIENTE, // calle / edificio exacto en Aruba
    mapa: PENDIENTE // enlace de Google Maps
  },

  contacto: {
    email: PENDIENTE,
    whatsapp: PENDIENTE,
    telefono: PENDIENTE
  },

  redes: {
    instagram: { url: "https://www.instagram.com/juventud.on", handle: "@juventud.on", seguidores: "24.7 mil", publicaciones: "1,239" },
    instagramIglesia: { url: "https://www.instagram.com/odresaruba", handle: "@odresaruba" },
    tiktok: PENDIENTE,
    youtube: PENDIENTE,
    facebook: PENDIENTE
  }
};

/* ---------------------------------------------------------------------------
   2. Devocionales
   Contenido de EJEMPLO escrito para el prototipo. Debe ser revisado y
   reemplazado por el contenido oficial del liderazgo de Juventud ON.
   Citas bíblicas: Reina-Valera 1960.
   ------------------------------------------------------------------------- */
const DEVOCIONALES = [
  {
    titulo: "Nadie tiene en poco tu juventud",
    ref: "1 Timoteo 4:12",
    versiculo:
      "Ninguno tenga en poco tu juventud, sino sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza.",
    minutos: 2,
    reflexion: [
      "Existe una mentira que se repite mucho: que ser joven es sinónimo de “todavía no”. Todavía no estás listo, todavía no tienes experiencia, todavía no te toca.",
      "Pablo le escribe justo lo contrario a Timoteo, que era joven y estaba liderando. No le dice que espere a tener más edad. Le dice que su vida hable tan fuerte que nadie pueda usar su edad como excusa para descartarlo.",
      "Tu testimonio no empieza cuando cumplas 30. Empieza hoy, en cómo hablas, cómo tratas a la gente y qué haces cuando nadie está mirando."
    ],
    reto: "Hoy sé ejemplo en una sola cosa concreta: tu forma de hablar. Nada de bajar a nadie."
  },
  {
    titulo: "Enciende la luz",
    ref: "Mateo 5:14",
    versiculo:
      "Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder.",
    minutos: 2,
    reflexion: [
      "Una luz encendida no tiene que anunciarse. Simplemente se nota. Ese es el punto de estar “ON”: no es un show, es una consecuencia.",
      "Jesús no dijo “deberían ser luz”. Dijo que ya lo son. La pregunta no es si tienes luz, sino qué le pusiste encima esta semana.",
      "A veces lo que tapa la luz no es un pecado escandaloso, es el miedo a que se rían de ti."
    ],
    reto: "Habla de tu fe con naturalidad delante de alguien que no la comparte. Sin sermón, solo real."
  },
  {
    titulo: "Permanece conectado",
    ref: "Juan 15:4",
    versiculo:
      "Permaneced en mí, y yo en vosotros. Como el pámpano no puede llevar fruto por sí mismo, si no permanece en la vid, así tampoco vosotros, si no permanecéis en mí.",
    minutos: 3,
    reflexion: [
      "Una rama desconectada no muere al instante. Sigue verde un rato, y por eso engaña. El problema aparece semanas después, cuando ya no da nada.",
      "Lo mismo pasa con nosotros. Puedes sostener la apariencia un tiempo sin oración, sin Palabra, sin comunidad. Pero se nota después.",
      "Permanecer no es un evento, es una rutina. Por eso la racha importa: no por el número, sino por lo que construye en ti."
    ],
    reto: "Cinco minutos de silencio sin teléfono. Solo tú y Dios."
  },
  {
    titulo: "Esfuérzate y sé valiente",
    ref: "Josué 1:9",
    versiculo:
      "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.",
    minutos: 2,
    reflexion: [
      "Dios le dice esto a Josué justo antes de la parte difícil, no después. La valentía no es la ausencia de miedo: es avanzar con el miedo puesto.",
      "Fíjate que la razón no es “porque eres fuerte”. Es “porque Jehová tu Dios estará contigo”. La confianza no está en ti, está en quién va contigo.",
      "Hoy hay algo que estás posponiendo por miedo. Ya sabes cuál es."
    ],
    reto: "Da el primer paso de eso que vienes evitando. Solo el primero."
  },
  {
    titulo: "Confía aunque no entiendas",
    ref: "Proverbios 3:5-6",
    versiculo:
      "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.",
    minutos: 2,
    reflexion: [
      "“No te apoyes en tu propia prudencia” no significa apagar el cerebro. Significa no convertir tu criterio en tu único dios.",
      "Hay decisiones que se ven perfectas en tu cabeza y terminan mal. Y hay caminos que no entiendes hoy y agradeces en dos años.",
      "Confiar es soltar el control de algo específico. Nombra qué es."
    ],
    reto: "Escribe una decisión que te tiene ansioso y ora por ella antes de dormir."
  },
  {
    titulo: "Tu palabra alumbra",
    ref: "Salmo 119:105",
    versiculo: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.",
    minutos: 2,
    reflexion: [
      "Una lámpara de mano no ilumina todo el camino. Ilumina el siguiente paso. Y eso es suficiente para no caerte.",
      "Muchas veces le pedimos a Dios el mapa completo y Él nos da luz para hoy. No es que te esconda algo: es que quiere que camines con Él, no sin Él.",
      "Si estás esperando claridad total para obedecer, vas a esperar mucho tiempo."
    ],
    reto: "Lee un capítulo completo de un evangelio. No un versículo suelto: un capítulo."
  },
  {
    titulo: "Planes de bien",
    ref: "Jeremías 29:11",
    versiculo:
      "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
    minutos: 3,
    reflexion: [
      "Este versículo se cita mucho en camisetas, pero Dios lo dijo a un pueblo que estaba en el exilio y le quedaban 70 años ahí. O sea: no era una promesa de que todo se arregla mañana.",
      "Y aun así, seguía siendo verdad. Los planes de Dios son buenos incluso cuando el capítulo actual es duro.",
      "Confiar en su plan no es negar que estás pasándola mal. Es creer que Él no te soltó en el proceso."
    ],
    reto: "Cuéntale a alguien de confianza algo que te está costando. No lo cargues solo."
  }
];

/* ---------------------------------------------------------------------------
   3. Anuncios oficiales (líderes y capitanes)
   Eventos reales observados en @juventud.on. Falta confirmar año/edición.
   ------------------------------------------------------------------------- */
const ANUNCIOS = [
  {
    id: "servicio",
    fijado: true,
    etiqueta: "Servicio",
    color: "violeta",
    titulo: "Viernes Juvenil",
    cuando: "Todos los viernes · 7:30pm",
    lugar: "Iglesia Odres Nuevos, Aruba",
    texto: "Alabanza en vivo, palabra y comunidad. Trae a un amigo — la entrada es libre.",
    autor: { nombre: "Liderazgo Juventud ON", rol: "Líderes", inicial: "J" },
    cta: { texto: "Marcar asistencia", accion: "ir-racha" }
  },
  {
    id: "campamento",
    etiqueta: "Campamento",
    color: "fuego",
    titulo: "Campamento Juvenil",
    cuando: "17 al 19 de julio",
    lugar: PENDIENTE,
    texto: "Tres días fuera de la rutina: dinámicas, adoración y noches que no se olvidan. Inscripciones abiertas hasta llenar cupo.",
    autor: { nombre: PENDIENTE, rol: "Líder", inicial: "?" },
    cta: { texto: "Quiero inscribirme", accion: "contacto" }
  },
  {
    id: "inconformes",
    etiqueta: "Conferencia",
    color: "magenta",
    titulo: "Conferencia Inconformes",
    cuando: PENDIENTE,
    lugar: "Iglesia Odres Nuevos, Aruba",
    texto: "Con invitada especial Paola Nicole (Puerto Rico). Una conferencia para los que no se conforman con una fe tibia.",
    autor: { nombre: PENDIENTE, rol: "Líder", inicial: "?" },
    cta: { texto: "Ver detalles", accion: "contacto" }
  },
  {
    id: "fifa",
    etiqueta: "Recreativo",
    color: "cian",
    titulo: "FIFA TRNMNT",
    cuando: "18 de noviembre",
    lugar: "Iglesia Odres Nuevos, Aruba",
    texto: "Torneo de FIFA abierto. Arma tu equipo, trae tu control y demuestra que puedes. Habrá premio.",
    autor: { nombre: PENDIENTE, rol: "Capitán", inicial: "?" },
    cta: { texto: "Anotarme", accion: "contacto" }
  },
  {
    id: "evnglm",
    etiqueta: "Evangelismo",
    color: "ambar",
    titulo: "EVNGLM — Salida de evangelismo",
    cuando: PENDIENTE,
    lugar: PENDIENTE,
    texto: "Salimos a la calle a compartir el mensaje. No necesitas experiencia, solo ganas.",
    autor: { nombre: PENDIENTE, rol: "Líder", inicial: "?" },
    cta: { texto: "Sumarme", accion: "contacto" }
  }
];

/* ---------------------------------------------------------------------------
   4. Feed social — CONTENIDO DE EJEMPLO
   Las "fotos" son degradados CSS, no imágenes reales, y los usuarios son
   ficticios. Está pendiente confirmar derechos de imagen de los jóvenes antes
   de publicar fotos reales (ver contexto/06-referencias-visuales-instagram.md).
   ------------------------------------------------------------------------- */
const FEED = [
  { id: 1, ph: "ph-1", autor: "Ejemplo 01", inicial: "A", pilar: "Viernes Juvenil", texto: "Anoche estuvo encendido 🔥 gracias a todos los que vinieron", likes: 128, comentarios: [
      { autor: "Ejemplo 04", texto: "Se sintió diferente ayer 🙌" },
      { autor: "Ejemplo 07", texto: "El que faltó, se lo perdió" } ] },
  { id: 2, ph: "ph-2", autor: "Ejemplo 02", inicial: "B", pilar: "Banda", texto: "Ensayo de banda antes del servicio", likes: 86, comentarios: [ { autor: "Ejemplo 03", texto: "Suenan brutal" } ] },
  { id: 3, ph: "ph-3", autor: "Ejemplo 03", inicial: "C", pilar: "Campamento", texto: "Recap del campamento — todavía no lo superamos", likes: 231, comentarios: [ { autor: "Ejemplo 05", texto: "El mejor de todos" }, { autor: "Ejemplo 01", texto: "¿Cuándo el próximo?" } ] },
  { id: 4, ph: "ph-4", autor: "Ejemplo 04", inicial: "D", pilar: "Conferencia", texto: "Inconformes. Nada volvió a ser igual después de esa noche", likes: 174, comentarios: [] },
  { id: 5, ph: "ph-5", autor: "Ejemplo 05", inicial: "E", pilar: "Comunidad", texto: "Después del servicio siempre hay plan 😎", likes: 64, comentarios: [ { autor: "Ejemplo 02", texto: "La próxima me avisan" } ] },
  { id: 6, ph: "ph-6", autor: "Ejemplo 06", inicial: "F", pilar: "Viernes Juvenil", texto: "Manos arriba, sin pena", likes: 142, comentarios: [] },
  { id: 7, ph: "ph-7", autor: "Ejemplo 07", inicial: "G", pilar: "Vlog", texto: "Vlog nuevo arriba — link en el Insta", likes: 97, comentarios: [ { autor: "Ejemplo 06", texto: "Ya lo vi 3 veces" } ] },
  { id: 8, ph: "ph-8", autor: "Ejemplo 08", inicial: "H", pilar: "Evangelismo", texto: "Salimos a la calle y pasaron cosas buenas", likes: 118, comentarios: [] }
];

/* ---------------------------------------------------------------------------
   5. Gamificación: equipos y retos
   ------------------------------------------------------------------------- */
const EQUIPOS = [
  { id: "encendidos", nombre: "Encendidos", emoji: "🔥", color: "fuego", puntos: 1840, miembros: 24 },
  { id: "voltaje", nombre: "Voltaje", emoji: "⚡", color: "ambar", puntos: 1720, miembros: 21 },
  { id: "corriente", nombre: "Corriente", emoji: "🌊", color: "cian", puntos: 1495, miembros: 19 },
  { id: "chispa", nombre: "Chispa", emoji: "✨", color: "magenta", puntos: 1310, miembros: 22 }
];

const RETOS = [
  { id: "r1", titulo: "Invita a un amigo el viernes", detalle: "Trae a alguien que nunca ha venido a Juventud ON.", puntos: 50, tipo: "Semanal", icono: "🤝" },
  { id: "r2", titulo: "7 días de devocional seguidos", detalle: "Completa una semana entera sin romper la racha.", puntos: 100, tipo: "Semanal", icono: "🔥" },
  { id: "r3", titulo: "Sirve en un área este viernes", detalle: "Alabanza, producción, bienvenida, limpieza… donde haga falta.", puntos: 75, tipo: "Semanal", icono: "🙌" },
  { id: "r4", titulo: "Sube una foto con #JuventudON", detalle: "Comparte un momento real del servicio o del grupo.", puntos: 30, tipo: "Mensual", icono: "📸" },
  { id: "r5", titulo: "Memoriza el versículo del mes", detalle: "Recítalo a tu capitán para validar el reto.", puntos: 60, tipo: "Mensual", icono: "📖" },
  { id: "r6", titulo: "Escribe a alguien que se alejó", detalle: "Un mensaje sincero a quien hace rato no viene.", puntos: 80, tipo: "Mensual", icono: "💬" }
];

const LOGROS = [
  { id: "l1", icono: "🔥", titulo: "Primera chispa", detalle: "Completa tu primer devocional", meta: 1, tipo: "devocional" },
  { id: "l2", icono: "🎯", titulo: "Semana completa", detalle: "7 días seguidos de devocional", meta: 7, tipo: "devocional" },
  { id: "l3", icono: "💎", titulo: "Un mes ON", detalle: "30 días seguidos de devocional", meta: 30, tipo: "devocional" },
  { id: "l4", icono: "🏅", titulo: "Fiel al viernes", detalle: "4 viernes seguidos presente", meta: 4, tipo: "asistencia" },
  { id: "l5", icono: "👑", titulo: "Imparable", detalle: "12 viernes seguidos presente", meta: 12, tipo: "asistencia" }
];

/* ---------------------------------------------------------------------------
   6. Checklist de datos por completar
   Panel del prototipo (botón flotante). Al abrirlo se resaltan en la página
   los bloques que todavía muestran un placeholder.
   Para producción: borrar este array y el panel #panel-pendientes del HTML.
   ------------------------------------------------------------------------- */
const PENDIENTES = [
  { campo: "Dirección exacta en Aruba", donde: "Info y contacto", archivo: "data.js → CONFIG.ubicacion.direccion" },
  { campo: "Correo de contacto", donde: "Info y contacto", archivo: "data.js → CONFIG.contacto.email" },
  { campo: "WhatsApp / teléfono", donde: "Info y contacto", archivo: "data.js → CONFIG.contacto.whatsapp" },
  { campo: "TikTok, YouTube y Facebook", donde: "Info y contacto", archivo: "data.js → CONFIG.redes" },
  { campo: "Misión y visión oficiales", donde: "Inicio", archivo: "data.js → CONFIG.mision / CONFIG.vision (hoy hay un borrador sugerido)" },
  { campo: "Valores oficiales del ministerio", donde: "Inicio", archivo: "data.js → CONFIG.valores (hoy hay una propuesta)" },
  { campo: "Rango de edad del ministerio", donde: "Inicio", archivo: "data.js → CONFIG.edades" },
  { campo: "Lema o versículo del ministerio", donde: "Inicio", archivo: "data.js → CONFIG.lema" },
  { campo: "Nombres de líderes y capitanes", donde: "Anuncios", archivo: "data.js → ANUNCIOS[].autor.nombre" },
  { campo: "Año / edición de campamento, conferencia y torneo", donde: "Anuncios", archivo: "data.js → ANUNCIOS[].cuando" },
  { campo: "Actividad de los jueves (nombre y horario)", donde: "Info y contacto", archivo: "data.js → añadir a CONFIG.servicio" },
  { campo: "Logo en alta resolución (PNG/SVG)", donde: "Toda la web", archivo: "assets/ (hoy el logo es un emblema hecho en SVG)" },
  { campo: "Fotos reales + permiso de imagen de los jóvenes", donde: "Feed", archivo: "data.js → FEED (hoy son degradados de ejemplo)" },
  { campo: "Revisión pastoral del contenido devocional", donde: "Racha", archivo: "data.js → DEVOCIONALES (contenido de ejemplo)" },
  { campo: "Aviso de privacidad para menores de edad", donde: "Feed / registro", archivo: "index.html → pie de página" }
];
