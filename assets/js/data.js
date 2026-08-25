/* ============================================================================
   Juventud ON — datos del sitio
   ----------------------------------------------------------------------------
   TODO lo editable del sitio vive en este archivo. No hace falta tocar el HTML
   para cambiar horarios, anuncios, devocionales, equipos o retos.

   Hay dos marcadores distintos y NO significan lo mismo:

     PENDIENTE  → el dato existe pero todavía no se ha confirmado. Sale en la
                  web resaltado en ámbar como [COMPLETAR]. Sustitúyelo por el
                  dato real y aparece solo.
     null       → el ministerio NO tiene ese dato (por ejemplo, no hay TikTok).
                  La web omite la fila entera, sin dejar hueco ni marcador.

   Nunca se inventan direcciones, teléfonos ni correos.
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

  // Confirmados por el liderazgo
  mision:
    "Llevar a los jóvenes a tener un encuentro personal y real con Jesús en un ambiente lleno de alegría, dinamismo y diversión.",
  vision:
    "Ser una comunidad de jóvenes unidos donde podamos disfrutar, ser auténticos y crecer juntos espiritualmente, demostrando que seguir a Cristo es la mejor aventura.",
  valores: [
    { icono: "🤝", titulo: "Amistad", texto: "Crear lazos fuertes y verdaderos entre nosotros." },
    { icono: "🎉", titulo: "Diversión sana", texto: "Disfrutar cada momento juntos con alegría y energía." },
    { icono: "🙌", titulo: "Fe auténtica", texto: "Conocer a Jesús de una manera real y aplicable a nuestra vida diaria." }
  ],

  edades: "13 a 25 años",
  lema: null, // el ministerio no tiene lema ni versículo oficial por ahora

  servicio: {
    dia: "Viernes",
    diaSemana: 5, // 0 = domingo … 5 = viernes
    hora: "7:30pm",
    horas: 19,
    minutos: 30,
    lugar: "Iglesia Odres Nuevos",
    ciudad: "Aruba",
    entreSemana: null // no hay actividad los jueves ni entre semana
  },

  ubicacion: {
    direccion: "Paradera 4, Aruba",
    mapa: "https://maps.google.com/?q=Paradera+4,+Aruba"
  },

  contacto: {
    email: "juventudon1@gmail.com",
    whatsapp: null, // no tienen WhatsApp de contacto
    telefono: null
  },

  redes: {
    // Canal principal y hoy el único activo: por aquí se les escribe de verdad.
    instagram: { url: "https://www.instagram.com/juventud.on", handle: "@juventud.on", seguidores: "24.7 mil", publicaciones: "1,239" },
    instagramIglesia: { url: "https://www.instagram.com/odresaruba", handle: "@odresaruba" },
    tiktok: null,
    youtube: null,
    facebook: null
  }
};

/* ---------------------------------------------------------------------------
   2. Devocionales
   revisado: true  → contenido oficial entregado por el liderazgo.
   revisado: false → contenido de ejemplo del prototipo; la web lo avisa debajo
                     del devocional hasta que el liderazgo lo apruebe o sustituya.
   El campo `reto` es opcional: si no está, la web no muestra ese bloque.
   El campo `fuente` también es opcional: si se indica, la web muestra el crédito
   debajo del devocional (para material inspirado en libros u otros autores).
   El tiempo de lectura se calcula solo si no se indica `minutos`.
   Citas bíblicas: Reina-Valera 1960.
   ------------------------------------------------------------------------- */
const DEVOCIONALES = [
  {
    titulo: "Dios en nuestra diversión",
    ref: "Salmos 16:11",
    versiculo: "Me mostrarás la senda de la vida; en tu presencia hay plenitud de gozo.",
    revisado: true,
    reflexion: [
      "Seguir a Jesús no es aburrido, al contrario, en Él encontramos la verdadera alegría."
    ]
  },
  {
    titulo: "Amigos que suman",
    ref: "Proverbios 17:17",
    versiculo: "En todo tiempo ama el amigo, y es como un hermano en tiempo de angustia.",
    revisado: true,
    reflexion: [
      "Rodéate de personas que te acerquen más a tu propósito."
    ]
  },
  {
    titulo: "Nadie tiene en poco tu juventud",
    ref: "1 Timoteo 4:12",
    versiculo:
      "Ninguno tenga en poco tu juventud, sino sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza.",
    minutos: 2,
    revisado: false,
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
    revisado: false,
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
    revisado: false,
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
    revisado: false,
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
    revisado: false,
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
    revisado: false,
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
    revisado: false,
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
   Se quitaron las tarjetas de Campamento, Conferencia Inconformes, FIFA TRNMNT
   y EVNGLM: eran eventos vistos en Instagram sin fecha confirmada, y el propio
   liderazgo indica que las nuevas fechas están por definir. Cuando se confirmen,
   se vuelven a añadir aquí como tarjetas independientes.
   ------------------------------------------------------------------------- */
const ANUNCIOS = [
  {
    id: "servicio",
    fijado: true,
    etiqueta: "Servicio",
    color: "violeta",
    titulo: "Viernes Juvenil",
    cuando: "Todos los viernes · 7:30pm",
    lugar: "Iglesia Odres Nuevos — Paradera 4, Aruba",
    texto: "Alabanza en vivo, palabra y comunidad. Trae a un amigo — la entrada es libre.",
    autor: { nombre: "Liderazgo Juventud ON", rol: "Líderes", inicial: "J" },
    cta: { texto: "Marcar asistencia", accion: "ir-racha" }
  },
  {
    id: "proximamente",
    etiqueta: "Próximamente",
    color: "fuego",
    titulo: "¡Nuevas actividades muy pronto!",
    cuando: "Fechas por confirmar",
    lugar: "Iglesia Odres Nuevos, Aruba",
    texto: "Estamos preparando grandes sorpresas, campamentos y torneos para este año. ¡Manténganse atentos a la aplicación para futuras actualizaciones!",
    autor: { nombre: "Eider y Nancy Mendoza", rol: "Líderes de Juventud ON", inicial: "E" },
    cta: { texto: "Seguirnos en Instagram", accion: "instagram" }
  }
];

/* ---------------------------------------------------------------------------
   4. Gamificación: equipos y retos
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
  { id: "r4", titulo: "Etiquétanos en tu historia", detalle: "Sube una foto del viernes a tu Instagram y etiqueta a @juventud.on.", puntos: 30, tipo: "Mensual", icono: "📸" },
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
   5. Checklist de datos por completar
   Panel del prototipo (botón flotante). Al abrirlo se resaltan en la página
   los bloques que todavía muestran un placeholder.
   Para producción: borrar este array y el panel #panel-pendientes del HTML.

   Ya resueltos por el liderazgo: dirección, correo, misión, visión, valores,
   rango de edad, nombres de líderes. El feed social se retiró del proyecto, así
   que los permisos de imagen y el aviso de privacidad dejan de ser necesarios
   para esta web (siguen siendo relevantes para lo que se publique en Instagram). Confirmados como inexistentes (no son pendientes):
   lema, WhatsApp, TikTok, YouTube, Facebook y actividad entre semana.
   ------------------------------------------------------------------------- */
const PENDIENTES = [
  { campo: "Logo en alta resolución (PNG/SVG)", donde: "Toda la web", archivo: "assets/ (hoy el emblema es una reconstrucción en SVG)" },
  { campo: "Revisión pastoral de los 7 devocionales de ejemplo", donde: "Racha", archivo: "data.js → DEVOCIONALES con revisado: false" },
  { campo: "Fechas de campamento, conferencia y torneo, cuando se confirmen", donde: "Anuncios", archivo: "data.js → ANUNCIOS (añadir una tarjeta por evento)" }
];
