// Puente entre el sitio (JavaScript) y el módulo de Gestión (Angular).
// Angular guarda en localStorage las noticias creadas y los id eliminados;
// aquí se aplican esos cambios sobre el catálogo base de noticias.json.
window.TechNewsStore = {
  CREATED: 'technews-created',
  DELETED: 'technews-deleted',
  read(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  },
  apply(baseNews) {
    const created = this.read(this.CREATED);
    const deleted = new Set(this.read(this.DELETED));
    return [...created, ...baseNews.filter(item => !deleted.has(item.id))];
  }
};
