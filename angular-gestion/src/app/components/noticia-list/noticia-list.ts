import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Noticia } from '../../models/noticia';

/**
 * Listado de noticias con opción de ELIMINAR.
 * Recibe los datos por @Input (input()) y notifica la eliminación por @Output (output()).
 * La eliminación pide confirmación en la misma tarjeta (sin ventanas emergentes del navegador).
 */
@Component({
  selector: 'app-noticia-list',
  imports: [FormsModule],
  templateUrl: './noticia-list.html'
})
export class NoticiaList {
  readonly noticias = input.required<Noticia[]>();
  readonly eliminar = output<Noticia>();

  readonly filtro = signal('');
  readonly confirmando = signal<string | null>(null);

  readonly visibles = computed(() => {
    const term = this.filtro().trim().toLocaleLowerCase('es');
    return this.noticias().filter(n => !term || `${n.title} ${n.category}`.toLocaleLowerCase('es').includes(term));
  });

  confirmar(noticia: Noticia): void {
    this.eliminar.emit(noticia);
    this.confirmando.set(null);
  }
}
