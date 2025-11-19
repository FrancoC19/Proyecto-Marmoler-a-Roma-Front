import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../Services/usuarioService';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulario-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-usuario.html',
  styleUrl: './formulario-usuario.css',
})
export class FormularioUsuario {

  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  id!: number | null;
  modoEdicion: boolean = false;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contra: ['', Validators.required],
      tipoUsuario: ['USUARIO', Validators.required]
    });
  }

  ngOnInit() {
    // ⬅️ si existe un id → estamos editando
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.modoEdicion = true;

      this.usuarioService.buscarPorID(this.id).subscribe({
        next: (usuario: any) => {
          this.form.patchValue({
            email: usuario.email,
            contra: usuario.contra,
            tipoUsuario: usuario.tipoUsuario
          });
        },
        error: (err) => {
          console.error(err);
          alert("No se pudo cargar el usuario");
        }
      });
    }
  }

  guardar() {
    if (this.form.invalid) return;

    const usuario = this.form.value;

    // ============ EDITAR ============
    if (this.modoEdicion && this.id) {
      this.usuarioService.modificar(this.id, usuario).subscribe({
        next: () => {
          alert("Usuario modificado correctamente");
          this.router.navigateByUrl('/TablaUsuarios');
        },
        error: (err) => {
          console.error(err);
          alert("Error al modificar el usuario");
        }
      });
      return;
    }

    // ============ CREAR ============
    this.usuarioService.guardar(usuario).subscribe({
      next: () => {
        alert("Usuario guardado correctamente");
        this.router.navigateByUrl('/TablaUsuarios');
      },
      error: (err) => {
        console.error(err);
        alert("Error al guardar el usuario");
      }
    });
  }
}
