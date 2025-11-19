import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService } from '../../../Services/pedidosService';
import { ClienteService } from '../../../Services/ClienteService';
import { EmpleadosService } from '../../../Services/EmpleadosService';
import { MaterialesService } from '../../../Services/MaterialesService';
import { pedidos } from '../../../Models/Pedidos';
import { pedidosTabla } from '../../../Models/PedidosTabla';

@Component({
  selector: 'app-tabla-pedidos',
  templateUrl: './tabla-pedidos.html',
  styleUrls: ['./tabla-pedidos.css']
})
export class TablaPedidos implements OnInit {

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

  cargarPedidos() {
  this.pedidosService.getAll().subscribe({
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


  finalizarPedido(id: number) {

    this.pedidosService.finalizarPedido(id).subscribe({
      next: () => {
        console.log("Pedido finalizado");
      },
      error: err => {
        console.error("Error finalizando:", err);
      }
    });

  
}

  verDetalle(id: number) {
    this.router.navigateByUrl(`DetallesPedidos/${id}`);
  }
}
