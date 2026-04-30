import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService } from '../../../Services/pedidosService';
import { ClienteService } from '../../../Services/ClienteService';
import { EmpleadosService } from '../../../Services/EmpleadosService';
import { MaterialesService } from '../../../Services/MaterialesService';
import { pedidosTabla } from '../../../Models/PedidosTabla';
import { empleado } from '../../../Models/Empleado';
import { cliente } from '../../../Models/Cliente';
import { material } from '../../../Models/Materiales';

@Component({
  selector: 'app-tabla-pedidos',
  templateUrl: './tabla-pedidos.html',
  styleUrls: ['./tabla-pedidos.css']
})
export class TablaPedidos implements OnInit {

  fechaInicio!: string;
  fechaFin!: string;

  dniEmpleado!: number;
  dniCliente!: number;

  idMaterial!: number;

  diasProximos!: number;

  pedidos: pedidosTabla[] = [];
  empleados: empleado[] = [];
  clientes: cliente[] = [];
  materiales: material[] = [];

  constructor(
    private pedidosService: PedidosService,
    private clientesService: ClienteService,
    private empleadosService: EmpleadosService,
    private materialesService: MaterialesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPedidos();
    this.cargarEmpleados(); 
    this.cargarClientes();
    this.cargarMateriales();
  }

  mostrarEstado(estado?: string): string {
  if (!estado) return '';
  return estado.replace(/_/g, ' ');
  }

  cargarEmpleados() {
  this.empleadosService.getAll().subscribe({
    next: res => this.empleados = res,
    error: err => console.error('Error cargando empleados', err)
  });
}

cargarClientes() {
    this.clientesService.getAll().subscribe({
      next: res => this.clientes = res,
      error: err => console.error(err)
    });
  }

  cargarMateriales() {
    this.materialesService.getAll().subscribe({
      next: res => this.materiales = res,
      error: err => console.error(err)
    });
  }

  private completarDatosPedidos(lista: pedidosTabla[]) {
    lista.forEach(p => {

      if (p.cliente?.dni) {
        this.clientesService.getByDni(p.cliente.dni).subscribe(c => {
          p.clienteNombre = `${c.nombre} ${c.apellido}`;
        });
      }

      if (p.empleado?.dni) {
        this.empleadosService.getByDni(p.empleado.dni).subscribe(e => {
          p.empleadoNombre = e.nombre;
        });
      }

      if (p.material?.id) {
        this.materialesService.getById(p.material.id).subscribe(m => {
          p.materialNombre = m.nombreMaterial;
        });
      }

    });
  }

  cargarPedidos() {
    this.pedidosService.getPendientesATerminar().subscribe({
      next: pedidosRecibidos => {
        this.pedidos = pedidosRecibidos as pedidosTabla[];
        this.completarDatosPedidos(this.pedidos);
      },
      error: err => console.error('Error cargando pedidos', err)
    });
  }

  finalizarPedido(id: number) {
    this.pedidosService.finalizarPedido(id).subscribe({
      next: () => console.log("Pedido finalizado"),
      error: err => console.error("Error finalizando:", err)
    });
  }

  verDetalle(id: number) {
    this.router.navigateByUrl(`DetallesPedidos/${id}`);
  }

  filtrarPorEstado(estadoString: string) {
    if (!estadoString) {
      this.cargarPedidos();
      return;
    }

    this.pedidosService.getByEstado(estadoString).subscribe({
      next: res => {
        this.pedidos = res as pedidosTabla[];
        this.completarDatosPedidos(this.pedidos);
      },
      error: err => console.error(err)
    });
  }

  filtrarPorFechas(inicio: string, fin: string) {
    if (!inicio || !fin) return;

    this.pedidosService.obtenerPorRangoDeFecha(
      new Date(inicio),
      new Date(fin)
    ).subscribe({
      next: res => {
        this.pedidos = res as pedidosTabla[];
        this.completarDatosPedidos(this.pedidos);
      },
      error: err => console.error(err)
    });
  }

  filtrarPorEmpleado(dni: string) {
  const dniNum = Number(dni);
  if (!dniNum) return;

  this.pedidosService.getByEmpleado(dniNum).subscribe({
    next: res => {
      this.pedidos = res as pedidosTabla[];
      this.completarDatosPedidos(this.pedidos);
    },
    error: err => console.error(err)
  });
}

  filtrarPorCliente(dni: string) {
    const dniNum = Number(dni);
    if (!dniNum) return;
    this.pedidosService.getByCliente(dniNum).subscribe({
      next: res => { this.pedidos = res as pedidosTabla[]; this.completarDatosPedidos(this.pedidos); },
      error: err => console.error(err)
    });
  }

  filtrarPorMaterial(id: string) {
    const idNum = Number(id);
    if (!idNum) return;
    this.pedidosService.getByMaterial(idNum).subscribe({
      next: res => { this.pedidos = res as pedidosTabla[]; this.completarDatosPedidos(this.pedidos); },
      error: err => console.error(err)
    });
  }

}