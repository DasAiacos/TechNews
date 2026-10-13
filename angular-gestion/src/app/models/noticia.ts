/**
 * Modelo de una noticia. Coincide con la estructura de assets/data/noticias.json
 * para que el sitio en JavaScript y el módulo Angular compartan los mismos datos.
 */
export interface Noticia {
  id: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  comments: number;
  image: string;
  paragraphs: string[];
  /** true cuando la noticia fue creada desde el módulo de gestión */
  custom?: boolean;
}

/** Datos que el formulario entrega para crear una noticia */
export interface NuevaNoticia {
  category: string;
  title: string;
  summary: string;
  image: string;
  content: string;
}

export const CATEGORIAS = [
  'Inteligencia Artificial',
  'Hardware',
  'Software',
  'Móviles',
  'Ciberseguridad',
  'Ciencia y Espacio',
  'Tecnología Verde',
  'Realidad Virtual'
];
