import { Component, effect, inject, input, output } from '@angular/core';
import { ClienteService } from '../../../Services/ClienteService';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { cliente } from '../../../Models/Cliente';
import { Direccion } from '../../../Models/Direccion';

@Component({
  selector: 'app-formulario-clientes',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-clientes.html',
  styleUrl: './formulario-clientes.css',
})
export class FormularioClientes {

  private readonly client = inject(ClienteService);
  private readonly fb = inject(FormBuilder);

  // Inputs y output como empleados
  readonly clientes = input<cliente>();
  readonly isEditing = input(false);
  readonly edited = output<cliente>();

  constructor() {
    effect(() => {
      if (this.isEditing() && this.clientes()) {
        this.form.patchValue({
          dni: this.clientes()!.dni,
          correo: this.clientes()!.correo,
          nombre: this.clientes()!.nombre,
          apellido: this.clientes()!.apellido,
          telefono: this.clientes()!.telefono,
        });

        // Limpio direcciones
        this.direcciones.clear();
        
        // Cargo direcciones reales
        this.clientes()!.direcciones.forEach(dir => {
          this.direcciones.push(this.fb.group({
            calle: [dir.calle, Validators.required],
            numero: [dir.numero, Validators.required],
            localidad: [dir.localidad, Validators.required]
          }));
        });
      }
    });
  }

  // ====== Form principal ======
  protected readonly form = this.fb.group({
    dni: [0, Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: ['', Validators.required],
    direcciones: this.fb.array<FormGroup>([])
  });

  // ======= Getters =======
  getdni() { return this.form.controls.dni; }
  getcorreo() { return this.form.controls.correo; }
  getnombre() { return this.form.controls.nombre; }
  getapellido() { return this.form.controls.apellido; }
  gettelefono() { return this.form.controls.telefono; }

  get direcciones(): FormArray<FormGroup> {
    return this.form.get('direcciones') as FormArray<FormGroup>;
  }

  getdirty() { return this.form.dirty; }
  gettouched() { return this.form.touched; }

  // ======= Dirección =======
  crearDireccion(): FormGroup {
    return this.fb.group({
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      localidad: ['', Validators.required],
    });
  }

  agregarDireccion() {
    this.direcciones.push(this.crearDireccion());
  }

  eliminarDireccion(index: number) {
    this.direcciones.removeAt(index);
  }

  // ====== Submit ======
  handleSubmit() {
    if (this.form.invalid) {
      alert("El formulario es inválido");
      return;
    }

    if (!confirm("¿Desea confirmar los datos?")) {
      return;
    }

    // Cast EXACTO al modelo cliente
    const clienteData: cliente = this.form.getRawValue() as cliente;
    

    if (this.isEditing()) {
       this.client.modificarCliente(clienteData.dni, clienteData)
    .subscribe({
      next: (c) => {
        alert("Cliente modificado correctamente");
        this.edited.emit(c);
      },
      error: (err) => {
        console.error("ERROR AL MODIFICAR CLIENTE:", err);
        alert("Error al modificar cliente. Mirá la consola.");
      }
    });
    } else {
      this.client.agregarCliente(clienteData)
        .subscribe((c) => {
          alert("Cliente agregado correctamente");
          this.edited.emit(c);
        });
    }
  }
}
