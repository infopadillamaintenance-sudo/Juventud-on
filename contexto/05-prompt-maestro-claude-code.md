# Prompt maestro para Claude Code

Copia y pega este prompt en Claude Code junto con el resto de la carpeta de contexto (`01` a `04`) para que los use como referencia.

---

Actúa como un Diseñador UX/UI y Desarrollador Web Senior experto en aplicaciones web modernas y gamificadas.

Necesito que crees la estructura completa, el diseño visual (UI) y el código frontend (HTML, Tailwind CSS y JavaScript interactivo) para la landing page / aplicación web de un grupo de jóvenes llamado **"Juventud ON"**, ministerio juvenil de la iglesia **Odres Nuevos**.

Antes de escribir código, lee los archivos de contexto adjuntos:
- `01-sobre-juventud-on.md` — qué es Juventud ON, misión, visión, valores y audiencia.
- `02-informacion-practica.md` — horarios, ubicación, redes sociales y contacto reales.
- `03-especificacion-funcional.md` — especificación funcional detallada de la plataforma.
- `04-guia-estilo-visual.md` — tono de marca, paleta y personalidad visual.
- `06-referencias-visuales-instagram.md` y la carpeta `imagenes-referencia-instagram/` — moodboard real tomado del Instagram oficial (@juventud.on, 24.7 mil seguidores): úsalo como referencia directa de estilo fotográfico, tipografía de gráficas y pilares de contenido reales del ministerio (servicios de viernes, campamentos, conferencias, vlogs, devocionales cortos).

La plataforma debe ser **juvenil, dinámica, moderna e interactiva**, e incluir las siguientes secciones y características clave:

### Hero Section & Bienvenida
- Nombre de la comunidad: Juventud ON – Odres Nuevos.
- Mensaje impactante de bienvenida y llamada a la acción (CTA) para registrarse o unirse.

### Sistema de racha (streaks, estilo Bible App)
- **Devocional diario:** módulo visual que muestre la racha diaria del usuario (ej. 🔥 "5 días seguidos") con un contador y una sección donde se pueda leer o marcar como completado el devocional del día.
- **Racha de asistencia a servicios:** dado que los servicios son solo los viernes, incluye un indicador especial de racha de asistencia presencial a los viernes juveniles, diferenciado del streak diario.

### Feed social de fotos (estilo Instagram)
- Muro o grid interactivo donde los jóvenes puedan ver y compartir fotos de servicios, eventos o momentos con amigos en la iglesia.
- Botones interactivos para dar "Me gusta" (❤️) y comentar.

### Módulo de anuncios oficiales (líderes y capitanes)
- Sección destacada donde líderes y capitanes puedan publicar avisos importantes, convocatorias y novedades de actividades especiales.

### Juegos y desafíos en equipo (gamificación)
- Sistema de retos o juegos semanales/mensuales que equipos o jóvenes deban completar.
- Marcador de puntos y avance del equipo, preparado para integrarse a futuro con un sistema de recompensas.

### Requerimientos técnicos y de estilo
- Utiliza Tailwind CSS para un diseño responsive, limpio y atractivo.
- Usa tonos modernos y enérgicos (neones, dark mode, colores vibrantes que transmitan energía y juventud), según la guía en `04-guia-estilo-visual.md`.
- Incluye JavaScript básico para simular la interactividad: marcar devocional, aumentar racha, dar like a fotos y cambiar entre pestañas.
- Entrega el resultado organizado por componentes, o en un único archivo HTML completo y listo para probar (decide el enfoque que consideres mejor para un primer prototipo funcional).
- Usa los datos reales de horarios, ubicación, redes sociales y contacto de `02-informacion-practica.md` (si algún campo sigue como `[COMPLETAR]`, usa un placeholder claro en el código, no inventes datos como direcciones o teléfonos).

---

**Nota:** revisa que los archivos `01` y `02` estén completos antes de generar la versión final del sitio, para que el contenido mostrado (misión, horarios, redes sociales, contacto) sea real y no un placeholder.
