import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService } from '../../../Services/pedidosService';
import { ClienteService } from '../../../Services/ClienteService';
import { EmpleadosService } from '../../../Services/EmpleadosService';
import { MaterialesService } from '../../../Services/MaterialesService';
import { pedidos } from '../../../Models/Pedidos';
import { pedidosTabla } from '../../../Models/PedidosTabla';

@Component({
  selector: 'app-tabla-pedidos-entregados',
  imports: [],
  templateUrl: './tabla-pedidos-entregados.html',
  styleUrl: './tabla-pedidos-entregados.css',
})

export class TablaPedidosEntregados {
pedidos: pedidosTabla[] = [];

  constructor(
    private pedidosService: PedidosService,
    private clientesService: ClienteService,
    private empleadosService: EmpleadosService,
    private materialesService: MaterialesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  mostrarEstado(estado?: string): string {
  if (!estado) return '';
  return estado.replace(/_/g, ' ');
  }

  cargarPedidos() {
  this.pedidosService.getPedidosTerminados().subscribe({
    next: pedidosRecibidos => {
      // Convertimos cada pedido a pedidosTabla
      this.pedidos = pedidosRecibidos.map(p => ({ ...p })) as pedidosTabla[];

      this.pedidos.forEach(p => {
        // Traer nombre completo del cliente
        if (p.cliente.dni) {
          this.clientesService.getByDni(p.cliente.dni).subscribe(c => {
            p.clienteNombre = `${c.nombre} ${c.apellido}`;
          });
        }
        // Traer nombre del empleado
        if (p.empleado.dni) {
          this.empleadosService.getByDni(p.empleado.dni).subscribe(e => {
            p.empleadoNombre = e.nombre;
          });
        }
        // Traer nombre del material
        if (p.material.id) {
          this.materialesService.getById(p.material.id).subscribe(m => {
            p.materialNombre = m.nombreMaterial;
          });
        }
      });
    },
    error: err => console.error('Error cargando pedidos', err)
  });
}

  verDetalle(id: number) {
    this.router.navigateByUrl(`DetallesEntregados/${id}`);
  }
  
}

