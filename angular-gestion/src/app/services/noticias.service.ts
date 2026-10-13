import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Noticia, NuevaNoticia } from '../models/noticia';

/** Claves de localStorage compartidas con assets/js/news-store.js */
export const STORAGE_CREATED = 'technews-created';
export const STORAGE_DELETED = 'technews-deleted';

/** Imagen por defecto según categoría cuando el usuario no indica una URL */
const IMAGEN_POR_CATEGORIA: Record<string, string> = {
  'Inteligencia Artificial': 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80',
  'Hardware': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  'Software': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
  'Móviles': 'https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=800&q=80',
  'Ciberseguridad': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
  'Ciencia y Espacio': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
  'Tecnología Verde': 'https://images.unsplash.com/photo-1531053326607-9d349096d887?auto=format&fit=crop&w=800&q=80',
  'Realidad Virtual': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80'
};

/**
 * Servicio que centraliza el Mini CRUD de noticias.
 * - Lee el catálogo base desde el JSON local del sitio.
 * - Guarda en localStorage las noticias creadas y los id eliminados,
 *   para que el Home y el detalle (JavaScript) reflejen los cambios.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);

  private readonly base = signal<Noticia[]>([]);
  private readonly creadas = signal<Noticia[]>(this.leer<Noticia[]>(STORAGE_CREATED, []));
  private readonly eliminadas = signal<string[]>(this.leer<string[]>(STORAGE_DELETED, []));

  readonly cargando = signal(true);
  readonly error = signal('');

  /** Lista visible: primero las creadas (más recientes) y luego las del JSON no eliminadas */
  readonly noticias = computed(() => {
    const ocultas = new Set(this.eliminadas());
    return [...this.creadas(), ...this.base().filter(n => !ocultas.has(n.id))];
  });

  readonly totalCreadas = computed(() => this.creadas().length);
  readonly totalEliminadas = computed(() => this.eliminadas().length);

  async cargar(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Noticia[]>('../assets/data/noticias.json'));
      this.base.set(data);
    } catch (e) {
      console.error(e);
      this.error.set('No pudimos cargar el catálogo base de noticias (assets/data/noticias.json).');
    } finally {
      this.cargando.set(false);
    }
  }

  /** CREATE: agrega una noticia nueva al inicio del listado */
  crear(datos: NuevaNoticia): Noticia {
    const noticia: Noticia = {
      id: `${this.slug(datos.title)}-${Date.now().toString(36)}`,
      category: datos.category,
      title: datos.title.trim(),
      summary: datos.summary.trim(),
      date: this.fechaHoy(),
      comments: 0,
      image: datos.image.trim() || IMAGEN_POR_CATEGORIA[datos.category] || IMAGEN_POR_CATEGORIA['Software'],
      paragraphs: datos.content.split(/\n+/).map(p => p.trim()).filter(Boolean),
      custom: true
    };
    this.creadas.update(lista => [noticia, ...lista]);
    this.guardar(STORAGE_CREATED, this.creadas());
    return noticia;
  }

  /** DELETE: si la creó el usuario se borra; si viene del JSON se marca como eliminada */
  eliminar(noticia: Noticia): void {
    if (noticia.custom) {
      this.creadas.update(lista => lista.filter(n => n.id !== noticia.id));
      this.guardar(STORAGE_CREATED, this.creadas());
    } else {
      this.eliminadas.update(ids => [...new Set([...ids, noticia.id])]);
      this.guardar(STORAGE_DELETED, this.eliminadas());
    }
  }

  /** Restablece el catálogo original del JSON */
  restablecer(): void {
    this.creadas.set([]);
    this.eliminadas.set([]);
    this.guardar(STORAGE_CREATED, []);
    this.guardar(STORAGE_DELETED, []);
  }

  private fechaHoy(): string {
    return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
      .format(new Date()).replace(/\./g, '').replace(/ de /g, ' ');
  }

  private slug(texto: string): string {
    return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'noticia';
  }

  private leer<T>(clave: string, defecto: T): T {
    try {
      return JSON.parse(localStorage.getItem(clave) || 'null') ?? defecto;
    } catch {
      return defecto;
    }
  }

  private guardar(clave: string, valor: unknown): void {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      console.error('No se pudo guardar en localStorage', e);
    }
  }
}
