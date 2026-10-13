const grid = document.querySelector('#newsGrid');
const empty = document.querySelector('#emptyState');
const search = document.querySelector('#searchInput');
const favoritesButton = document.querySelector('#showFavorites');
const favoriteMessage = document.querySelector('#favoriteEmptyState');
let news = window.location.protocol === 'file:' ? (window.techNewsFallback || []) : [];
let showAll = false;
let category = '';
let favoritesOnly = false;
let favoriteIds = new Set();

try {
  favoriteIds = new Set(JSON.parse(localStorage.getItem('technews-favorites') || '[]'));
} catch {
  localStorage.removeItem('technews-favorites');
}

function saveFavorites() {
  localStorage.setItem('technews-favorites', JSON.stringify([...favoriteIds]));
}

// Escapa texto antes de insertarlo con innerHTML
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function render() {
  const rawTerm = search.value.trim();
  const term = rawTerm.toLocaleLowerCase('es');
  let filtered = news.filter(item => {
    const matchesCategory = !category || item.category === category;
    const matchesSearch = !term || `${item.category} ${item.title} ${item.summary}`.toLocaleLowerCase('es').includes(term);
    const matchesFavorites = !favoritesOnly || favoriteIds.has(item.id);
    return matchesCategory && matchesSearch && matchesFavorites;
  });

  if (!showAll && !term && !category && !favoritesOnly) filtered = filtered.slice(0, 6);

  grid.innerHTML = filtered.map(item => `
    <article class="news-card">
      <a class="news-card-link" href="pages/noticia.html?noticia=${encodeURIComponent(item.id)}" aria-label="Leer noticia: ${escapeHtml(item.title)}">
        <img class="card-image" src="${escapeHtml(item.image)}" alt="" loading="lazy">
        <div class="card-body">
          <span class="tag">${escapeHtml(item.category)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="summary">${escapeHtml(item.summary)}</p>
          <div class="meta"><span>▣ ${escapeHtml(item.date)}</span><span>▢ ${item.comments}</span></div>
        </div>
      </a>
      <button class="favorite-button${favoriteIds.has(item.id) ? ' is-favorite' : ''}" type="button" data-favorite="${item.id}" aria-label="${favoriteIds.has(item.id) ? 'Quitar de' : 'Añadir a'} favoritos" aria-pressed="${favoriteIds.has(item.id)}" title="${favoriteIds.has(item.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}">${favoriteIds.has(item.id) ? '♥' : '♡'}</button>
    </article>`).join('');

  const noSearchResults = Boolean(term) && filtered.length === 0;
  const noFavoriteResults = favoritesOnly && !term && filtered.length === 0;
  empty.hidden = !noSearchResults;
  favoriteMessage.hidden = !noFavoriteResults;
  grid.hidden = noSearchResults || noFavoriteResults;
  document.querySelector('.section-heading').hidden = noSearchResults;
  document.body.classList.toggle('search-empty', noSearchResults);
  document.body.classList.toggle('favorites-empty', noFavoriteResults);
  favoritesButton.setAttribute('aria-pressed', favoritesOnly);
  favoritesButton.textContent = favoritesOnly ? 'Ver todas las noticias' : `Favoritos (${favoriteIds.size})`;
  if (noSearchResults) document.querySelector('#emptyTerm').textContent = `“${rawTerm}”`;
}

grid.addEventListener('click', event => {
  const button = event.target.closest('[data-favorite]');
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  const id = button.dataset.favorite;
  if (favoriteIds.has(id)) favoriteIds.delete(id);
  else favoriteIds.add(id);
  saveFavorites();
  render();
});

search.addEventListener('input', render);
document.querySelector('#showAll').addEventListener('click', event => {
  showAll = !showAll;
  event.currentTarget.innerHTML = showAll ? 'Ver menos&nbsp; ←' : 'Ver todas&nbsp; →';
  render();
});
favoritesButton.addEventListener('click', () => {
  favoritesOnly = !favoritesOnly;
  showAll = true;
  render();
});
document.querySelector('#clearSearch').addEventListener('click', () => {
  search.value = '';
  category = '';
  favoritesOnly = false;
  document.querySelectorAll('[data-category]').forEach(button => button.classList.remove('active'));
  showAll = false;
  render();
  search.focus();
});
favoriteMessage.querySelector('button').addEventListener('click', () => {
  favoritesOnly = false;
  render();
});
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  category = category === button.dataset.category ? '' : button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(option => option.classList.toggle('active', option.dataset.category === category));
  favoritesOnly = false;
  showAll = true;
  render();
  document.querySelector('#noticias').scrollIntoView();
}));
document.querySelector('.menu-toggle').addEventListener('click', event => {
  const nav = document.querySelector('#main-nav');
  nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', nav.classList.contains('open'));
});
document.querySelector('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#formMessage').textContent = '¡Gracias por suscribirte!';
  event.currentTarget.reset();
});

function useNews(data) {
  // Aplica las noticias creadas/eliminadas desde el módulo de Gestión (Angular)
  news = window.TechNewsStore ? window.TechNewsStore.apply(data) : data;
  favoriteIds = new Set([...favoriteIds].filter(id => news.some(item => item.id === id)));
  saveFavorites();
  render();
}

if (window.location.protocol === 'file:') {
  useNews(news);
} else {
  fetch('assets/data/noticias.json')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el archivo de noticias.');
      return response.json();
    })
    .then(useNews)
    .catch(error => {
      console.error(error);
      grid.innerHTML = '<p class="data-error">No pudimos cargar las noticias. Verifica tu conexión o revisa el archivo JSON.</p>';
    });
}
