# Juventud ON — web del ministerio juvenil de Odres Nuevos

Landing page / aplicación web para **Juventud ON**, el ministerio juvenil de la iglesia
**Odres Nuevos** (Aruba). Está pensada como una app juvenil y gamificada —no como un sitio
institucional de iglesia— con devocional diario tipo racha, racha de asistencia a los
viernes, ministerios de servicio, anuncios oficiales y retos en equipo.

> **Servicio:** todos los viernes a las 7:30pm · Iglesia Odres Nuevos, Paradera 4, Aruba
> **Edades:** 13 a 25 años
> **Instagram:** [@juventud.on](https://www.instagram.com/juventud.on) · **Correo:** juventudon1@gmail.com
> **Líderes:** Eider y Nancy Mendoza

---

## Cómo abrirlo

**Opción 1 — la más fácil.** Abre `dist/juventud-on.html` haciendo doble clic. Es un único
archivo con todo dentro (estilos, código y tipografías); funciona sin internet y se puede
enviar por WhatsApp o correo tal cual.

**Opción 2 — el proyecto completo.** Abre `index.html` con doble clic. Necesita la carpeta
`assets/` al lado.

**Opción 3 — con un servidor local** (recomendado si vas a editar):

```bash
npm run serve      # http://localhost:8080
```

---

## Estructura

```
index.html                    La página (estructura y secciones)
assets/
  css/juventud-on.css         CSS ya compilado — no editar a mano
  js/data.js                  ← TODO el contenido editable vive aquí
  js/app.js                   Lógica: rachas, likes, retos, navegación
  fonts/                      Anton e Inter autohospedadas (sin CDN)
src/input.css                 Fuente del CSS (paleta, componentes, animaciones)
tools/build-single-file.mjs   Genera dist/juventud-on.html
dist/juventud-on.html         Versión de un solo archivo, lista para enviar
assets/img/ministerios/       Fotos de los equipos sirviendo (ver el README de ahí)
docs/                         Plantillas para el ministerio (permiso de imagen, devocionales)
contexto/                     Los documentos de contexto del ministerio
```

---

## Cómo cambiar el contenido

Casi todo se edita en **`assets/js/data.js`**, sin tocar el HTML:

| Qué quieres cambiar | Dónde |
|---|---|
| Horario, dirección, correo, redes sociales | `CONFIG` |
| Misión, visión, valores | `CONFIG.mision`, `CONFIG.vision`, `CONFIG.valores` |
| Devocionales | `DEVOCIONALES` |
| Anuncios de líderes y capitanes | `ANUNCIOS` |
| Requisito para servir y sus 3 pasos | `REQUISITO_SERVIR` |
| Ministerios, sus áreas y sus fotos | `MINISTERIOS` |
| Equipos de reto y retos | `EQUIPOS`, `RETOS` |
| Insignias | `LOGROS` |

Después de editar `data.js` solo hay que recargar la página. **No hace falta compilar nada**
salvo que cambies estilos.

### Cuidado con la palabra "equipo"

En el proyecto hay dos cosas distintas que se podrían llamar igual, y conviene no
mezclarlas:

- **`MINISTERIOS`** — las áreas de servicio reales: V.I.P., Multimedia, Banda y Ujier.
  Viven en la pestaña **Servir** y para entrar hace falta Discipulado y bautismo.
- **`EQUIPOS`** — los equipos de competición de la gamificación (Encendidos, Voltaje,
  Corriente, Chispa). Viven en la pestaña **Retos** y solo sirven para sumar puntos.

### Fotos de los ministerios

Cada ministerio y cada área tienen una propiedad `imagen`. Mientras valga `null`, la web
dibuja un degradado de marca con el texto "Aquí va una foto del equipo", así que la
sección se ve completa desde el primer día. Para poner fotos reales, sigue las
instrucciones de `assets/img/ministerios/README.md`.

El generador del archivo único incrusta esas fotos en base64, así que
`dist/juventud-on.html` sigue funcionando aunque se envíe suelto por WhatsApp.

### Dos marcadores que no significan lo mismo

| Valor | Qué significa | Qué hace la web |
|---|---|---|
| `PENDIENTE` | El dato existe pero no está confirmado | Lo muestra en ámbar como `[COMPLETAR]` |
| `null` | El ministerio **no tiene** ese dato | Omite la fila entera, sin dejar hueco |

Por eso no aparecen WhatsApp, TikTok, YouTube ni Facebook: están en `null` porque no
existen, no porque falten. Si algún día se abren, basta con poner la URL.

### Si cambias los estilos

```bash
npm install          # solo la primera vez
npm run css          # compila src/input.css → assets/css/juventud-on.css
npm run css:watch    # o en modo vigilancia mientras diseñas
npm run build        # compila el CSS y regenera dist/juventud-on.html
```

---

## Datos que faltan por confirmar

El sitio **no inventa** direcciones, teléfonos, correos ni nombres. Donde falta el dato real
aparece un marcador `[COMPLETAR]` en color ámbar.

Para verlos todos: pulsa el botón **⚠ Por completar** (abajo a la derecha). Se abre un panel
con la lista y, mientras está abierto, se resaltan en la página los bloques afectados.

Quedan **4 pendientes**:

1. **Fotos de los jóvenes sirviendo** en cada ministerio y área. Al volver a haber fotos de
   personas, vuelve a hacer falta el permiso de imagen de los menores que salgan: el
   formulario está en `docs/autorizacion-uso-de-imagen.html`.
2. **Logo en alta resolución** (PNG o SVG). El emblema actual es una reconstrucción hecha a
   partir de la captura de Instagram: sirve para el prototipo, no como archivo final.
3. **Contenido definitivo de los devocionales.** Los 7 de ejemplo (`revisado: false` en
   `data.js`) llevan un aviso hasta que se aprueben o se sustituyan. Los dos del liderazgo
   ya salen sin aviso. Formato para enviar los nuevos: `docs/plantilla-devocionales.md`.
4. **Fechas de campamento, conferencia y torneo**, cuando se confirmen. Hoy hay un único
   anuncio de "Nuevas actividades muy pronto"; cada evento confirmado se añade como una
   tarjeta propia en `ANUNCIOS`.

Ya resueltos: dirección, correo, misión, visión, valores, rango de edad y nombres de líderes.
Confirmados como inexistentes (y por eso ya no son pendientes): lema, WhatsApp, TikTok,
YouTube, Facebook y actividad entre semana.

Cuando el sitio esté listo para publicarse, borra de `index.html` el botón `#btn-pendientes`
y el panel `#panel-pendientes`, y de `data.js` el array `PENDIENTES`.

---

## Decisiones de construcción

- **Tailwind CSS compilado, no por CDN.** El CSS va compilado y las tipografías
  autohospedadas, así que la página carga entera sin depender de un servidor externo —
  importante si la conexión falla en el local.
- **Varios archivos, sin paso de compilación obligatorio.** El HTML, los datos y la lógica
  están separados para poder mantenerlos, pero se abren directamente con doble clic. Además
  se genera una versión de un solo archivo para compartir.
- **Modo oscuro fijo.** Es la identidad de la marca (ver `contexto/04-guia-estilo-visual.md`
  y el feed real de Instagram), no una preferencia del dispositivo.
- **Sin feed de fotos.** Se descartó a propósito: publicar fotos de jóvenes (varios menores
  de edad) obliga a gestionar permisos de imagen uno por uno, y el ministerio prefiere que
  ese contenido siga viviendo en Instagram. La web no publica fotos ni recoge datos
  personales de nadie.
- **Rachas con lógica real de fechas**: el devocional se rompe si te saltas un día, y la
  asistencia se cuenta por viernes consecutivos, no por días. El botón de asistencia solo
  se activa los viernes (hay un *modo demo* para probarlo cualquier día).

## Qué NO hace todavía

Esto es un prototipo de frontend. **Todo el progreso se guarda solo en el dispositivo de
cada persona** (`localStorage`): si alguien entra desde otro teléfono, empieza de cero, y
los puntos de equipo que se ven en la tabla son de ejemplo, no un marcador real compartido.

Para que funcione de verdad como comunidad hace falta:

1. **Cuentas de usuario**, para que la racha y los puntos sean de la persona y no del navegador.
2. **Backend y base de datos** para rachas, anuncios y puntajes compartidos.
3. **Panel de líderes** real, con cuentas: para publicar anuncios y para aprobar los retos
   que envían los jóvenes desde sus propios teléfonos (hoy la revisión solo ve lo enviado en
   el mismo dispositivo).
4. **Notificaciones** (push o correo) para recordar el devocional y no romper la racha.
5. **Recompensas** conectadas al marcador de puntos.

---

## Modo administrador

Las herramientas de líder están **ocultas para el público**. Se activan añadiendo
`?admin=true` al final de la URL:

```
https://juventud-on.vercel.app/?admin=true
```

Aparece entonces una barra flotante con dos botones: **Revisar retos** y **Por completar**.
El modo queda activo durante toda la pestaña (no hay que arrastrar el parámetro al navegar);
se desactiva con `?admin=false` o cerrando la pestaña. Al abrir el sitio en local también se
activa solo, para no estorbar mientras se desarrolla.

> **Esto no es seguridad, y conviene tenerlo claro.** Es un sitio estático: cualquiera que
> escriba `?admin=true` en la barra de direcciones entra. Sirve para que el panel no moleste
> al público, no para proteger nada. Una contraseña de verdad necesita servidor y cuentas.

## Retos: verificación antes de los puntos

Antes, pulsar "Marcar completado" sumaba los puntos al instante y cualquiera podía inflarse
el marcador. Ahora el flujo es:

1. El joven pulsa **Enviar prueba** y describe cómo lo cumplió. Puede adjuntar una foto (se
   reduce a 800 px y se comprime antes de guardarla, porque `localStorage` ronda los 5 MB).
2. El reto queda **⏳ Pendiente de verificación**. **No suma puntos.**
3. Un líder abre el panel de revisión y pulsa **Aprobar** o **Rechazar** (con motivo).
4. Solo al aprobar se suman los puntos. Una aprobación se puede **revocar** después, y los
   puntos se restan.

El joven ve el estado en su tarjeta, puede cancelar un envío pendiente y volver a enviarlo
si se lo rechazan.

### Qué resuelve esto y qué no

**Sí resuelve** el problema social: ya no se suman puntos solos, hay que enviar una prueba y
alguien la revisa. Y deja el modelo de datos exactamente en la forma que necesitará el día
que haya backend.

**No resuelve** el problema técnico, y hay que decirlo claro:

- Todo corre en el navegador del propio usuario. Quien sepa abrir las herramientas de
  desarrollo puede editar `localStorage` a mano, o entrar con `?admin=true` y aprobarse sus
  propios retos.
- Como el estado vive en cada dispositivo, **un líder solo ve las solicitudes enviadas desde
  su propio teléfono**. No puede revisar lo que envían los jóvenes desde los suyos.

Ambas cosas se arreglan igual: cuentas de usuario y un servidor que guarde las solicitudes y
sea el único que pueda aprobarlas. Hasta entonces, esto es el prototipo correcto del flujo,
no un sistema antitrampas real.

---

## Publicar en Vercel

El sitio es estático puro: no hay que compilar nada en el servidor porque el CSS ya va
compilado en el repositorio. Lo que se publica son **244 KB** en total (`index.html` +
`assets/`); el resto de carpetas quedan fuera vía `.vercelignore`.

La configuración ya está hecha en `vercel.json`. No hay que tocar nada en el panel.

### Conectarlo (una sola vez)

1. Entra en [vercel.com](https://vercel.com) e inicia sesión **con la cuenta de GitHub**
   que es dueña del repositorio.
2. **Add New → Project** e importa `infopadillamaintenance-sudo/Juventud-on`.
3. Vercel leerá `vercel.json` solo. Pulsa **Deploy**.
4. En un minuto tendrás una URL tipo `juventud-on.vercel.app`.

### Rama de producción

Ahora mismo todo el código vive en la rama `claude/revisar-tareas-pendientes-cg0s5x`, que
es la única del repositorio. Dos caminos:

- **Recomendado:** fusionar esa rama a `main` y dejar `main` como rama de producción. Es lo
  normal y evita tener una rama de producción con nombre de trabajo.
- **Rápido:** en *Settings → Git → Production Branch* poner
  `claude/revisar-tareas-pendientes-cg0s5x`. Funciona igual, pero queda feo a la larga.

### A partir de ahí, actualizar es solo esto

```bash
git add .
git commit -m "lo que cambiaste"
git push
```

Cada `push` a la rama de producción vuelve a publicar el sitio automáticamente, en unos
segundos. Los `push` a otras ramas generan una URL de vista previa, útil para revisar un
cambio antes de que lo vea todo el mundo.

### Caché

Está configurada pensando en que vas a actualizar seguido:

| Qué | Caché |
|---|---|
| Tipografías (`assets/fonts/`) | 1 año — nunca cambian |
| Fotos (`assets/img/`) | 1 semana |
| HTML, CSS y JS | Sin caché: los cambios se ven al instante |

Así, cuando cambies un devocional o un anuncio, quien abra la web lo ve enseguida sin tener
que vaciar la caché del navegador.

### Dominio propio

Si algún día quieren `juventudon.com` o similar: *Settings → Domains* en el proyecto de
Vercel, y se apunta el dominio siguiendo las instrucciones que da ahí. El plan gratuito
admite dominio propio.

---

## Créditos

- Tipografías **Anton** e **Inter**, licencia SIL Open Font License 1.1, autohospedadas en
  `assets/fonts/`.
- **Tailwind CSS 4** (licencia MIT) para el sistema de estilos.
- Contexto, datos y referencias visuales del ministerio: carpeta `contexto/`.
