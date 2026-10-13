# TechNews
Repositorio entrega TechNews

## Noticias y favoritos

Las noticias se cargan dinámicamente desde `assets/data/noticias.json`. Cada tarjeta abre su detalle en `pages/noticia.html` y se puede guardar en favoritos con el botón del corazón. Los favoritos se conservan en el navegador con `localStorage`.

Para que el navegador pueda leer el JSON, inicia el proyecto con un servidor local. En VS Code puedes instalar o usar la extensión **Live Server**, hacer clic derecho sobre `index.html` y elegir **Open with Live Server**. Si abres el HTML directamente como archivo (`file://`), el navegador bloquea el JSON por CORS y la página usa el respaldo `assets/js/news-data.js`.

## Gestión de noticias (Mini CRUD en Angular)

La página **Gestión** (`gestion/`) es un módulo construido con **Angular 20** (componentes standalone, data binding, signals y formularios con `ngModel`). Permite **crear** y **eliminar** noticias; los cambios se guardan en `localStorage` (`technews-created` y `technews-deleted`) y el Home y el detalle los aplican mediante `assets/js/news-store.js`.

- Código fuente Angular: `angular-gestion/src/app/`
  - `models/noticia.ts` – modelo de datos.
  - `services/noticias.service.ts` – lectura del JSON y operaciones crear/eliminar.
  - `components/noticia-form/` – formulario con validaciones y vista previa en vivo.
  - `components/noticia-list/` – listado con filtro y confirmación de eliminación.
- Compilado listo para publicar: `gestion/`

Para recompilar:

```bash
cd angular-gestion
npm install
npx ng build   # genera la versión de producción en ../gestion
```

## Despliegue

El sitio es estático, por lo que se publica con **GitHub Pages** desde la rama `main` (carpeta raíz):
Settings → Pages → Build and deployment → *Deploy from a branch* → `main` / `(root)`.

URL: https://eboadam.github.io/TechNews/
