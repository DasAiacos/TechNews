const params = new URLSearchParams(window.location.search);
const article = document.querySelector('#articleContent');
const missing = document.querySelector('#articleMissing');
const favoriteButton = document.querySelector('#articleFavorite');
let story;
let favorites = new Set();

try {
  favorites = new Set(JSON.parse(localStorage.getItem('technews-favorites') || '[]'));
} catch {
  localStorage.removeItem('technews-favorites');
}

function renderStory(news) {
    story = news.find(item => item.id === params.get('noticia'));
    if (!story) {
      missing.hidden = false;
      return;
    }
    document.title = `${story.title} | TechNews`;
    document.querySelector('#articleBreadcrumb').textContent = story.title;
    document.querySelector('#articleCategory').textContent = story.category;
    document.querySelector('#articleTitle').textContent = story.title;
    document.querySelector('#articleSummary').textContent = story.summary;
    document.querySelector('#articleDate').textContent = `Publicado el ${story.date}`;
    document.querySelector('#articleComments').textContent = `${story.comments} comentarios`;
    document.querySelector('#articleImage').src = story.image;
    document.querySelector('#articleImage').alt = story.title;
    document.querySelector('#articleBody').replaceChildren(...story.paragraphs.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
    document.querySelector('#commentsText').textContent = `Esta noticia tiene ${story.comments} comentarios.`;
    updateFavoriteButton();
    article.hidden = false;
}

if (window.location.protocol === 'file:') {
  renderStory(window.techNewsFallback || []);
} else {
  fetch('../assets/data/noticias.json')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar la noticia.');
      return response.json();
    })
    .then(renderStory)
    .catch(error => {
      console.error(error);
      missing.hidden = false;
    });
}

function updateFavoriteButton() {
  const saved = favorites.has(story.id);
  favoriteButton.setAttribute('aria-pressed', saved);
  favoriteButton.textContent = saved ? '♥ Quitar de favoritos' : '♡ Guardar en favoritos';
  favoriteButton.classList.toggle('is-favorite', saved);
}

favoriteButton.addEventListener('click', () => {
  if (!story) return;
  if (favorites.has(story.id)) favorites.delete(story.id);
  else favorites.add(story.id);
  localStorage.setItem('technews-favorites', JSON.stringify([...favorites]));
  updateFavoriteButton();
});

const menuButton = document.querySelector('.menu-toggle');
menuButton.addEventListener('click', () => {
  const nav = document.querySelector('#main-nav');
  nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', nav.classList.contains('open'));
});
