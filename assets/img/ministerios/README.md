# Fotos de los ministerios

Aquí van las fotos reales de los jóvenes sirviendo. Mientras esta carpeta esté vacía,
la web dibuja un degradado de marca en su lugar: la sección funciona igual, solo que
sin fotos.

## Cómo añadir una foto

1. Guarda el archivo aquí, con un nombre sin espacios ni acentos:
   `banda.jpg`, `multimedia-luces.jpg`, `vip.jpg`…
2. Abre `assets/js/data.js` y escribe la ruta en el ministerio o el área:

```js
{
  id: "banda",
  imagen: "assets/img/ministerios/banda.jpg",   // ← foto principal del ministerio
  areas: [
    { nombre: "Batería", icono: "🥁", imagen: "assets/img/ministerios/bateria.jpg" }
  ]
}
```

3. Recarga la página. No hay que compilar nada.

## Recomendaciones

- **Formato:** `.jpg` para fotos, `.webp` si quieres que pesen menos.
- **Tamaño:** la foto del ministerio se ve apaisada (16:7) — con 1200 px de ancho sobra.
  Las de área se ven cuadradas — 400 px basta.
- **Peso:** por debajo de 300 KB cada una. Si no, la web tarda en cargar en el móvil.
- **Encuadre:** que se vea la gente sirviendo, no el escenario vacío.

## Antes de publicar

Varios de los jóvenes que salgan serán menores de edad. Necesitas el permiso firmado
de su padre, madre o tutor: el formulario está en `docs/autorizacion-uso-de-imagen.html`.
