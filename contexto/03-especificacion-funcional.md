# Especificación funcional — Plataforma web Juventud ON

Este documento describe qué debe hacer la plataforma web de Juventud ON. Es la base funcional para que Claude Code construya el frontend (y eventualmente el backend, si se necesita persistencia real).

## Concepto general

Landing page / aplicación web para el grupo de jóvenes **Juventud ON** (ministerio de la iglesia **Odres Nuevos**). Debe sentirse **juvenil, dinámica, moderna e interactiva** — no como el sitio institucional típico de una iglesia, sino como una app social/gamificada pensada para adolescentes y jóvenes.

## 1. Hero Section & Bienvenida

- Nombre de la comunidad visible de forma protagónica: **Juventud ON — Odres Nuevos**.
- Mensaje de bienvenida impactante, con lenguaje juvenil.
- Llamada a la acción (CTA) principal: registrarse / unirse a la comunidad.

## 2. Sistema de racha (estilo "streaks" de apps tipo Bible App / Duolingo)

### 2.1 Devocional diario
- Módulo visual que muestre la racha diaria del usuario, ej: 🔥 "5 días seguidos".
- Contador de racha.
- Sección donde el usuario puede leer el devocional del día y marcarlo como completado (esto es lo que suma a la racha).

### 2.2 Racha de asistencia a servicios (viernes)
- Como los servicios son solo los viernes, debe existir un indicador especial y diferenciado para la racha de asistencia presencial a los viernes juveniles (distinto del streak del devocional diario, porque tiene una cadencia semanal, no diaria).

## 3. Feed social de fotos (estilo Instagram)

- Muro / grid interactivo donde los jóvenes puedan ver y compartir fotos tomadas en servicios, eventos o momentos con amigos dentro de la iglesia.
- Botones interactivos de "Me gusta" (❤️) y comentarios.

## 4. Módulo de anuncios oficiales (líderes y capitanes)

- Sección destacada donde líderes y capitanes puedan publicar avisos importantes, convocatorias y novedades de actividades especiales.
- Debe distinguirse visualmente del feed social (es contenido "oficial", no de usuarios).

## 5. Juegos y desafíos en equipo (gamificación)

- Sistema de retos/juegos semanales o mensuales que equipos o jóvenes individuales deben completar.
- Marcador de puntos y avance por equipo.
- Diseñado para poder integrarse a futuro con un sistema de recompensas (no es necesario construir el backend de recompensas todavía, pero el diseño debe dejar espacio para ello).

## Requerimientos técnicos y de estilo

- **Tailwind CSS** para diseño responsive, limpio y atractivo.
- Tonos modernos y enérgicos: neones, modo oscuro (dark mode), o colores vibrantes que transmitan energía y juventud (ver `04-guia-estilo-visual.md` para el detalle de paleta y personalidad).
- JavaScript para simular interactividad en una primera versión (frontend-only / mock data), incluyendo:
  - Marcar devocional como completado (y actualizar la racha).
  - Aumentar la racha visualmente.
  - Dar "me gusta" a fotos del feed.
  - Cambiar entre pestañas/secciones (navegación tipo tabs, tal como una app).
- Entregable esperado: componentes organizados o un único archivo HTML completo listo para probar (a definir con Claude Code según se prefiera app multi-archivo con framework o un solo HTML autocontenido para el primer prototipo).

## Consideraciones a futuro (fuera del alcance del primer prototipo, pero a tener en mente en la arquitectura)

- Autenticación real de usuarios (para que la racha y los puntos persistan por persona).
- Backend/base de datos para guardar rachas, likes, comentarios, publicaciones y puntajes de equipo de forma real (hoy se simula con datos de ejemplo/JS).
- Sistema de recompensas conectado al marcador de puntos de los juegos/desafíos.
- Moderación de contenido en el feed social (fotos/comentarios), especialmente considerando que hay menores de edad.
- Notificaciones (push o WhatsApp) para recordar el devocional diario y mantener la racha.
