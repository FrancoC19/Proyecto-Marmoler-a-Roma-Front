import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialesService } from '../../../Services/MaterialesService';
import { ActivatedRoute, Router } from '@angular/router';
import { material } from '../../../Models/Materiales';

@Component({
  selector: 'app-formulario-materiales',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-materiales.html',
  styleUrl: './formulario-materiales.css',
})
export class FormularioMateriales { 
  private readonly formbuilder = inject(FormBuilder);
  private readonly client = inject(MaterialesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isEditing = signal(false);
  readonly currentId = signal<number | null>(null);

  protected readonly tiposMateriales = [
    'GRANITO','MARMOL','CUARZO','SINTERIZADO','CUARSITA'
  ];

  protected readonly form = this.formbuilder.nonNullable.group({
    nombreMaterial: ['', [Validators.minLength(2), Validators.required]],
    valorMetroCuadrado: [0, [Validators.min(0), Validators.required]],
    tipoMaterial: ['', Validators.required]
  });

  constructor() {
    // Revisar si hay un id en la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.currentId.set(id);
      this.isEditing.set(true);

      // Cargar material desde el servicio
      this.client.getById(id).subscribe({
        next: (m: material) => this.form.patchValue(m),
        error: err => alert('No se pudo cargar el material: ' + err)
      });
    }
  }

  // --- Getters ---
  getnombre() { return this.form.controls.nombreMaterial; }
  getvalorMetroCuadrado() { return this.form.controls.valorMetroCuadrado; }
  gettipo() { return this.form.controls.tipoMaterial; }
  getdirty() { return this.form.dirty; }
  gettouched() { return this.form.touched; }
  getTipoMaterial(){ return this.form.controls.tipoMaterial; }

  handleSubmit() {
    if (this.form.invalid) {
      alert('Formulario inválido');
      return;
    }

    if (!confirm('Desea Confirmar los datos?')) return;

    const material: material = this.form.getRawValue();

    if (this.isEditing()) {
      // Editar material existente
      this.client.modificarMaterial(material, this.currentId()!).subscribe({
        next: () => {
          alert('Material modificado correctamente');
          this.router.navigateByUrl('/TablaMateriales');
        },
        error: err => alert('Error al modificar: ' + err)
      });
    } else {
      // Agregar nuevo material
      this.client.agregarMaterial(material).subscribe({
        next: () => {
          alert('Material creado correctamente');
          this.form.reset();
          this.router.navigateByUrl('/TablaMateriales');
        },
        error: err => alert('Error al guardar: ' + err)
      });
    }
  }
}
