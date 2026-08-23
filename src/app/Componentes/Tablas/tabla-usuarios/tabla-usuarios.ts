import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../Services/usuarioService';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tabla-usuarios.html',
  styleUrl: './tabla-usuarios.css',
})
export class TablaUsuarios {

  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  usuarios: any[] = [];
  cargando = true;

  ngOnInit() {
    this.usuarioService.todos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.cargando = false;
      }
    });
  }

  editar(id: number) {
    this.router.navigate(['/FormularioUsuarios', id]);
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que querés eliminar este usuario?')) return;

    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}

