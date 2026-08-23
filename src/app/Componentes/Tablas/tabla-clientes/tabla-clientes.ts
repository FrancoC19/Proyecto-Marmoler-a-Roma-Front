import { Component, inject } from '@angular/core';
import { ClienteService } from '../../../Services/ClienteService';
import { cliente } from '../../../Models/Cliente';
import { FormsModule } from '@angular/forms';
import { FormularioClientes } from '../../Formularios/formulario-clientes/formulario-clientes';
import { AuthService } from '../../../Services/auth-service';
@Component({
  selector: 'app-tabla-clientes',
  imports: [FormsModule, FormularioClientes],  // ⬅ IMPORTAR FORMULARIO
  templateUrl: './tabla-clientes.html',
  styleUrl: './tabla-clientes.css',
})
export class TablaClientes {
  private readonly client = inject(ClienteService);
  protected auth=inject(AuthService);

  protected clientes: cliente[] = [];

  // filtros
  filtroNombre = '';
  filtroApellido = '';
  filtroDni: number | null = null;
  filtroCorreo = '';
  filtroTelefono: number | null = null;

  // ======= NUEVO =======
  clienteSeleccionado: cliente | null = null;
  editando = false;

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.client.getAll().subscribe({
      next: data => this.clientes = data,
      error: err => console.error('Error cargando clientes:', err)
    });
  }

  // ==========================
  //     FILTROS
  // ==========================
  private debounceTimer: any;

  aplicarFiltros() {
    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.ejecutarFiltros();
    }, 400);
  }

  ejecutarFiltros() {
    const filtros: any = {};

    if (this.filtroNombre.trim()) filtros.nombre = this.filtroNombre;
    if (this.filtroApellido.trim()) filtros.apellido = this.filtroApellido;
    if (this.filtroCorreo.trim()) filtros.correo = this.filtroCorreo;

    if (this.filtroDni) filtros.dni = this.filtroDni;
    if (this.filtroTelefono) filtros.telefono = this.filtroTelefono;

    if (Object.keys(filtros).length === 0) {
      return this.cargarClientes();
    }

    this.client.buscar(filtros).subscribe({
      next: data => this.clientes = data,
      error: () => this.clientes = []
    });
  }

  // ==========================
  //     EDITAR CLIENTE
  // ==========================
  editarCliente(dni: number) {
    this.client.getByDni(dni).subscribe(c => {
      this.clienteSeleccionado = c;  // ⬅ PASA AL FORMULARIO
      this.editando = true;
    });
  }

  // Cuando el form confirma edición
  refrescarLista(clienteEditado: cliente) {
    this.editando = false;
    this.clienteSeleccionado = null;
    this.cargarClientes();
  }

  // ==========================
  //     ELIMINAR CLIENTE
  // ==========================
  eliminarCliente(id: number) {
    if (!confirm("¿Desea eliminar este cliente?")) return;

    this.client.eliminarCliente(id).subscribe({
      next: () => this.cargarClientes(),
      error: err => {
        console.error("Error eliminando cliente:", err);
        alert("Error eliminando cliente");
      }
    });
  }
}
