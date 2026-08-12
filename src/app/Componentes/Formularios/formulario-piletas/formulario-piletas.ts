import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PiletasService } from '../../../Services/PiletasService';
import { piletas } from '../../../Models/Piletas';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formulario-piletas',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-piletas.html',
  styleUrl: './formulario-piletas.css',
})
export class FormularioPiletas {
  private readonly client = inject(PiletasService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly piletas = signal<piletas | null>(null);
  readonly isEditing = signal(false);
  readonly edited = output<piletas>();

  protected readonly form = this.fb.nonNullable.group({
    marca: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    largo: [0, [Validators.required, Validators.min(10), Validators.max(100)]],
    ancho: [0, [Validators.required, Validators.min(5), Validators.max(100)]],
    profundidad: [0, [Validators.required, Validators.min(3), Validators.max(90)]],
    valor: [0, [Validators.required, Validators.min(1)]],
    cantidad: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    // Si estamos en modo edición, cargar la pileta desde el id de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.client.getById(+id).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.piletas.set(p);
          this.isEditing.set(true);
        },
        error: () => alert("No se pudo cargar la pileta")
      });
    }

    // Mantener el formulario actualizado si cambian los datos desde inputs externos
    effect(() => {
      if (this.isEditing() && this.piletas()) {
        this.form.patchValue(this.piletas()!);
      }
    });
  }

  // Métodos de validación
  getmarca() { return this.form.controls.marca; }
  getmodelo() { return this.form.controls.modelo; }
  getlargo() { return this.form.controls.largo; }
  getancho() { return this.form.controls.ancho; }
  getprofundidad() { return this.form.controls.profundidad; }
  getvalor() { return this.form.controls.valor; }
  getcantidad() { return this.form.controls.cantidad; }
  getdirty() { return this.form.dirty; }
  gettouched() { return this.form.touched; }

  handleSubmit() {
    if (this.form.invalid) {
      alert("El formulario es inválido");
      return;
    }

    if (confirm("Desea confirmar los datos?")) {
      const pileta = this.form.getRawValue();

      if (this.isEditing()) {
        this.client.modificarPileta(this.piletas()?.id!, pileta).subscribe({
          next: (p) => {
            alert("Pileta modificada correctamente");
            this.edited.emit(p);
            this.router.navigate(['/TablaPiletas']); // Volver a la tabla
          },
          error: (err) => alert("Error al modificar la pileta")
        });
      } else {
        this.client.agregarPiletas(pileta).subscribe({
          next: (p) => {
            alert("Pileta agregada correctamente");
            this.form.reset();
            this.edited.emit(p);
          },
          error: () => alert("Error al agregar la pileta")
        });
      }
    }
  }
}
