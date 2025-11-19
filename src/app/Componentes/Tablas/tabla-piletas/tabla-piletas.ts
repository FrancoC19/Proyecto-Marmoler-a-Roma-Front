import { Component, inject } from '@angular/core';
import { PiletasService } from '../../../Services/PiletasService';
import { piletas } from '../../../Models/Piletas';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth-service';

@Component({
  selector: 'app-tabla-piletas',
  imports: [],
  templateUrl: './tabla-piletas.html',
  styleUrl: './tabla-piletas.css',
})
export class TablaPiletas {
  private readonly client = inject(PiletasService);
  private readonly router = inject(Router);
  public auth = inject(AuthService);

  protected piletasList: piletas[] = [];

  // filtros
  filtroMarca = '';
  filtroModelo = '';

  ngOnInit() {
    this.cargarPiletas();
  }

  cargarPiletas() {
    this.client.getAll().subscribe({
      next: data => this.piletasList = data,
      error: err => console.error("Error cargando piletas:", err)
    });
  }

  buscarPorMarca(marca: string) {
    this.client.getByMarca(marca).subscribe({
      next: data => this.piletasList = data,
      error: () => alert("No se encontraron piletas con esa marca")
    });
  }

  buscarPorModelo(modelo: string) {
    this.client.getByModelo(modelo).subscribe({
      next: data => this.piletasList = data,
      error: () => alert("No se encontró la pileta con ese modelo")
    });
  }

  editarPileta(id: number) {
    // Navega al formulario con el id
    this.router.navigateByUrl(`/FormularioPiletas/${id}`);
  }

  eliminarPileta(id: number) {
    if(confirm("¿Desea eliminar esta pileta?")){
      this.client.eliminarPileta(id).subscribe({
        next: () => this.cargarPiletas(),
        error: err => console.error(err)
      });
    }
  }
}

