# TechNews
Repositorio entrega TechNews

## Noticias y favoritos

Las noticias se cargan dinámicamente desde `assets/data/noticias.json`. Cada tarjeta abre su detalle en `pages/noticia.html` y se puede guardar en favoritos con el botón del corazón. Los favoritos se conservan en el navegador con `localStorage`.

Para que el navegador pueda leer el JSON, inicia el proyecto con un servidor local. En VS Code puedes instalar o usar la extensión **Live Server**, hacer clic derecho sobre `index.html` y elegir **Open with Live Server**. Si abres el HTML directamente como archivo (`file://`), el navegador bloquea el JSON por CORS y la página usa el respaldo `assets/js/news-data.js`.
