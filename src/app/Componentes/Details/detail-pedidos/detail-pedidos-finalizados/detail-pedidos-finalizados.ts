import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService } from '../../../../Services/pedidosService';
import { MaterialesService } from '../../../../Services/MaterialesService';
import { ClienteService } from '../../../../Services/ClienteService';
import { EmpleadosService } from '../../../../Services/EmpleadosService';
import { PiletasService } from '../../../../Services/PiletasService';
import { AuthService } from '../../../../Services/auth-service';

@Component({
  selector: 'app-detail-pedidos-finalizados',
  imports: [],
  templateUrl: './detail-pedidos-finalizados.html',
  styleUrl: './detail-pedidos-finalizados.css',
})

export class DetailPedidosFinalizados {

  pedido!: any;
  private route = inject(ActivatedRoute);
  private servicePedidos = inject(PedidosService);
  private materialesService = inject(MaterialesService);
  private clienteService = inject(ClienteService);
  private empleadoService = inject(EmpleadosService);
  private piletasService = inject(PiletasService);
  private router = inject(Router);
  protected auth=inject(AuthService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.servicePedidos.getById(id).subscribe(p => {
      this.pedido = p;
      this.cargarNombres();
    });
  
  }

  cargarNombres() {
    if (this.pedido.material?.id) {
      this.materialesService.getById(this.pedido.material.id)
        .subscribe(m => this.pedido.materialNombre = m.nombreMaterial);
    }

    if (this.pedido.pileta?.id) {
      this.piletasService.getById(this.pedido.pileta.id)
        .subscribe(pl => this.pedido.piletaNombre = pl.modelo);
    }

    if (this.pedido.cliente?.dni) {
      this.clienteService.getByDni(this.pedido.cliente.dni)
        .subscribe(c => this.pedido.clienteNombre = `${c.nombre} ${c.apellido}`);
    }

    if (this.pedido.empleado?.dni) {
      this.empleadoService.getByDni(this.pedido.empleado.dni)
        .subscribe(e => this.pedido.empleadoNombre = `${e.nombre}`);
    }
  }

  volver() {
    this.router.navigate(["/TablaPedidosEntregados"]);
  }
}
