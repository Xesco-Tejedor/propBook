# propBook: cuadernos ilustrados con IA

A partir de una frase o tema, propBook genera tres páginas de texto creativo y una ilustración nueva para cada página. Las imágenes ya no son ejemplos: se generan con FLUX.1 Schnell a partir del tema y del texto de esa página.

## Usar la app

1. Abre https://xesco-tejedor.github.io/propBook/ .
2. Escribe un tema y pulsa "Generar Libro".
3. Espera al texto y a las tres ilustraciones. El estado indica qué se está generando.

La versión publicada ya tiene los servicios conectados. No necesitas configurar un backend ni introducir claves para usarla.

## Cómo funciona

- Texto: Gemini, con OpenRouter y un modelo gratuito como respaldo.
- Ilustraciones: FLUX.1 Schnell mediante Cloudflare Workers AI, una imagen por página.
- Interfaz: HTML, JavaScript y Tailwind CSS.
- Las claves del servicio de texto permanecen en el servidor, no en el código público. Workers AI utiliza una vinculación del servidor, sin clave en el navegador.

## Límites y privacidad

Se utilizan cuotas gratuitas. La generación puede tardar varios minutos o fallar si se agota una cuota o el proveedor está ocupado. No se activa ningún plan de pago. El texto comparte cuotas con las otras apps; las imágenes usan la cuota gratuita de Workers AI de la cuenta.

El tema y el texto se envían a los proveedores de IA. No introduzcas datos privados. Las imágenes pueden interpretar libremente las escenas y no garantizan personajes idénticos entre páginas.

No hay guardado de libros ni exportación: al recargar se pierde el resultado. Si falla una ilustración, se muestra el error y se conservan las páginas que ya se habían generado, sin anunciar éxito completo ni sustituirlas por imágenes de ejemplo.

## Desarrollo

La app publicada está en `index.html`. Las carpetas `backend/` y `src/` y los documentos de instalación anteriores conservan la versión histórica con backend local; no son pasos necesarios para utilizar la app publicada actual. Una copia o despliegue propio necesita sus propios servicios y configuración.
