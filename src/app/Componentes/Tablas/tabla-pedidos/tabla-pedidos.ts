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
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = (pdfFonts as any).vfs;
import { PedidoFull } from '../../../Models/PedidoFull';

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
      next: () => console.log("Estado finalizado"),
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

  crearPDF(id:number){
    // Llama al servicio para obtener un pedido por su ID (petición asíncrona)
    this.pedidosService.getById(id).subscribe({
  
      // Se ejecuta cuando la respuesta llega correctamente
      next:(pedido:PedidoFull) => {
  
        // Objeto que define la estructura completa del PDF
        const docDefinition: any = {
  
          // Contenido visible del PDF
          content:[
  
            // Título principal con el número de pedido
            {text: "Pedido N° " + pedido.id, style:"header"},
  
            // Fechas del pedido (se usan backticks para insertar variables)
            { text: `Fecha Emisión: ${pedido.fechaEmision}`, margin: [0, 5, 0, 0] },
  
            // Sección cliente
            { text: 'Cliente', style: 'subheader' },
  
            // Uso de columnas para mostrar nombre y DNI en la misma fila
            { 
              columns: [
                // Columna izquierda (tamaño automático)
                { width: 'auto', text: `Nombre: ${pedido.cliente?.nombre || ''} ${pedido.cliente?.apellido || ''}` },
  
                // Columna derecha (ocupa el resto del espacio y alineada a la derecha)
                { width: '*', text: `DNI: ${pedido.cliente?.dni || ''}`, alignment: 'right' }
              ],
              margin: [0,5,0,5]
            },
  
            // Sección empleado
            { text: 'Empleado', style: 'subheader' },
  
            // Datos del empleado (con operador ? para evitar errores si es null)
            { text: `${pedido.empleado?.nombre || ''} - DNI: ${pedido.empleado?.dni || ''}`, margin: [0,5,0,10] },
  
            // Sección detalles del pedido
            { text: 'Detalles del Pedido', style: 'subheader' },
  
            // Tabla con información del pedido
            {
              table: {
  
                // Dos columnas con mismo ancho
                widths: ['*','*'],
  
                // Filas de la tabla (cada array es una fila)
                body: [
                  ['Material', pedido.material?.nombreMaterial || ''],
                  ['Marca Pileta', pedido.pileta?.marca || pedido.pileta || ''],
                  ['Modelo Pileta', pedido.pileta?.modelo || pedido.pileta || ''],
                  ['Ancho Pileta', pedido.pileta?.ancho || pedido.pileta || ''],
                  ['Largo Pileta', pedido.pileta?.largo || pedido.pileta || ''],
                  ['Profundidad Pileta', pedido.pileta?.profundidad || pedido.pileta || ''],
                  ['Grifería', pedido.griferia || ''],
                  ['Moldura', pedido.moldura || ''],
                  ['Metros cuadrados', pedido.metrosCuadrados?.toString() || ''],
                  ['Descuento', pedido.descuento?.toString() || ''],
                  ['Seña', pedido.senia?.toString() || ''],
                  ['Valor total', pedido.valorTotal?.toString() || ''],
  
                  // Dirección armada dinámicamente si existe
                  ['Dirección', pedido.direccion 
                    ? `${pedido.direccion.calle} ${pedido.direccion.numero || ''}, ${pedido.direccion.localidad || ''}` 
                    : ''
                  ]
                ]
              },
  
              // Margen inferior y superior
              margin: [0,5,0,10]
            },
            
            // Sección observaciones
            { text: 'Observaciones', style: 'subheader' },
  
            // Muestra observaciones o '-' si no hay
            { text: pedido.observaciones || '-', margin: [0,5,0,20] },
  
            // Texto de firma
            { text: 'Firma', margin: [0,40,0,0] },
  
            // Línea horizontal simulando espacio para firma
            { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 1 } ] }
          ],
  
          // Estilos reutilizables
          styles: {
  
            // Estilo para títulos principales
            header: { fontSize: 18, bold: true, margin: [0,0,0,10] },
  
            // Estilo para subtítulos
            subheader: { fontSize: 12, bold: true, margin: [0,10,0,5] }
          },
  
          // Estilo por defecto para todo el documento
          defaultStyle: { fontSize: 10 }
        };
  
        // Genera el PDF y lo descarga con nombre dinámico
        pdfMake.createPdf(docDefinition).download("Pedido: "+pedido.id)
      }  
    });
    

  }
}