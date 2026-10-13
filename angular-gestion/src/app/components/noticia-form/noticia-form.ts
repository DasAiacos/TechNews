import { Component, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CATEGORIAS, NuevaNoticia } from '../../models/noticia';

/**
 * Formulario para CREAR noticias.
 * Usa two-way binding ([(ngModel)]) y validaciones de formulario basado en plantilla.
 * Muestra una vista previa en vivo de la tarjeta mediante interpolación.
 */
@Component({
  selector: 'app-noticia-form',
  imports: [FormsModule],
  templateUrl: './noticia-form.html'
})
export class NoticiaForm {
  /** Evento hacia el componente padre con los datos validados */
  readonly crear = output<NuevaNoticia>();

  readonly categorias = CATEGORIAS;
  readonly urlPattern = 'https?://.+';
  readonly maxResumen = 160;

  modelo: NuevaNoticia = this.vacio();

  guardar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.crear.emit({ ...this.modelo });
    form.resetForm(this.vacio());
  }

  private vacio(): NuevaNoticia {
    return { category: '', title: '', summary: '', image: '', content: '' };
  }
}
