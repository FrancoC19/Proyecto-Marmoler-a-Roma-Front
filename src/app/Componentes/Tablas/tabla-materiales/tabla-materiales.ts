import { Component, inject } from '@angular/core';
import { MaterialesService } from '../../../Services/MaterialesService';
import { material } from '../../../Models/Materiales';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth-service';

@Component({
  selector: 'app-tabla-materiales',
  imports: [],
  templateUrl: './tabla-materiales.html',
  styleUrl: './tabla-materiales.css',
})
export class TablaMateriales {
  private readonly client = inject(MaterialesService);
  private readonly router = inject(Router);
  protected auth=inject(AuthService);

  protected materiales: material[] = [];

  // filtros
  filtroNombre = '';
  filtroTipo = '';
  filtroPrecio: number | null = null;

  ngOnInit() {
    this.cargarMateriales();
  }

  cargarMateriales() {
    this.client.getAll().subscribe({
      next: data => this.materiales = data,
      error: err => console.error('Error cargando materiales:', err)
    });
  }

  buscarPorNombre(nombre: string) {
    if (!nombre) return this.cargarMateriales();

    this.client.getMaterialByNombre(nombre).subscribe({
      next: data => this.materiales = [data],
      error: () => {
        alert("Material no encontrado");
        this.materiales = [];
      }
    });
  }

  buscarPorTipo(tipo: string) {
    if (!tipo) return this.cargarMateriales();

    this.client.getTipoMaterial(tipo).subscribe({
      next: data => this.materiales = data,
      error: () => {
        alert("No hay materiales de ese tipo");
        this.materiales = [];
      }
    });
  }

  buscarPorPrecio(precio: number) {
    if (precio == null) return this.cargarMateriales();

    this.client.getPrecioMaterial(precio).subscribe({
      next: data => this.materiales = data,
      error: () => {
        alert("No hay materiales con ese precio");
        this.materiales = [];
      }
    });
  }

  // Navegar al formulario para editar
  editarMaterial(id: number) {
    this.router.navigateByUrl(`/FormularioMateriales/${id}`);
  }

  // Eliminar por nombre (podés cambiar a id si querés más seguro)
  eliminarMaterial(nombre: string) {
    if (!confirm("¿Desea eliminar este material?")) return;

    this.client.deleteByNombre(nombre).subscribe({
      next: () => this.cargarMateriales(),
      error: err => console.error('Error eliminando material:', err)
    });
  }
}
