import { Component, OnInit, inject, signal } from '@angular/core';
import { NoticiaForm } from './components/noticia-form/noticia-form';
import { NoticiaList } from './components/noticia-list/noticia-list';
import { Noticia, NuevaNoticia } from './models/noticia';
import { NoticiasService } from './services/noticias.service';

/**
 * Componente raíz del módulo de Gestión de noticias (Mini CRUD).
 * Orquesta el formulario (crear) y el listado (eliminar) usando el NoticiasService.
 */
@Component({
  selector: 'app-root',
  imports: [NoticiaForm, NoticiaList],
  templateUrl: './app.html'
})
export class App implements OnInit {
  protected readonly service = inject(NoticiasService);
  protected readonly mensaje = signal('');
  protected readonly menuAbierto = signal(false);

  ngOnInit(): void {
    this.service.cargar();
  }

  onCrear(datos: NuevaNoticia): void {
    const noticia = this.service.crear(datos);
    this.notificar(`Noticia "${noticia.title}" publicada. Ya aparece en el Home.`);
  }

  onEliminar(noticia: Noticia): void {
    this.service.eliminar(noticia);
    this.notificar(`Noticia "${noticia.title}" eliminada.`);
  }

  onRestablecer(): void {
    this.service.restablecer();
    this.notificar('Se restableció el catálogo original de noticias.');
  }

  private notificar(texto: string): void {
    this.mensaje.set(texto);
    setTimeout(() => this.mensaje() === texto && this.mensaje.set(''), 4000);
  }
}
