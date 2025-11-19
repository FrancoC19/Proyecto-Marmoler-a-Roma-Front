import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { PedidosService } from '../../../Services/pedidosService';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { pedidos } from '../../../Models/Pedidos';
import { cliente } from '../../../Models/Cliente';
import { ClienteService } from '../../../Services/ClienteService';
import { EmpleadosService } from '../../../Services/EmpleadosService';
import { MaterialesService } from '../../../Services/MaterialesService';
import { PiletasService } from '../../../Services/PiletasService';
import { empleado } from '../../../Models/Empleado';
import { material } from '../../../Models/Materiales';
import { piletas } from '../../../Models/Piletas';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-formulario-pedidos',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-pedidos.html',
  styleUrl: './formulario-pedidos.css',
})
export class FormularioPedidos implements OnInit {
  private readonly client = inject(PedidosService);
  private readonly clienteService = inject(ClienteService);
  private readonly empleadosService = inject(EmpleadosService);
  private readonly materialesService = inject(MaterialesService);
  private readonly piletasService = inject(PiletasService);
  private readonly fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);


  readonly pedidos = input<pedidos>();
  readonly edited = output<pedidos>();

  pedidoActual?: pedidos;
  isEditingFlag = false;
  empleados: empleado[] = [];
  materiales: material[] = [];
  piletas: piletas[] = [];

  // 🔎 Listado que aparece al buscar
  clienteBusqueda: string = "";
  clientesFiltrados: cliente[] = [];
  clienteSeleccionado: cliente | null = null;

 ngOnInit() {
  
const id = Number(this.route.snapshot.paramMap.get('id'));

  if (id) {
    this.isEditingFlag = true; // variable interna
    this.client.getById(id).subscribe({
      next: (pedido) => {
        this.pedidoActual = pedido; // guardás pedido
        this.cargarDatosEnFormulario(pedido);
      },
      error: () => alert("No se encontró el pedido")
    });
  }
  // Cargar empleados
  this.empleadosService.getAll().subscribe({
    next: data => this.empleados = data,
    error: () => console.error("Error cargando empleados")
  });

  // Cargar materiales
  this.materialesService.getAll().subscribe({
    next: data => this.materiales = data,
    error: () => console.error("Error cargando materiales")
  });

  // Cargar piletas
  this.piletasService.getAll().subscribe({
    next: data => this.piletas = data,
    error: () => console.error("Error cargando piletas")
  });


  // 🔥 SI ESTÁ EDITANDO → precarga los datos en el formulario
  if (this.isEditing() && this.pedidos()) {
    const p = this.pedidos()!;

    this.form.patchValue({
      observaciones: p.observaciones,
      cliente: p.cliente?.dni ?? null,
      empleado: p.empleado?.dni ?? null,
      material: this.materiales.find(m => m.id === p.material?.id) ?? null,
      pileta: this.piletas.find(pl => pl.id === p.pileta?.id) ?? null,
      griferia: p.griferia,
      moldura: p.moldura,
      senia: p.senia,
      fechaEntrega: p.fechaEntrega,
      fechaEmision: p.fechaEmision,
      metrosCuadrados: p.metrosCuadrados,
      direccion: {
        calle: p.direccion?.calle,
        numero: String(p.direccion.numero),
        localidad: p.direccion?.localidad,
      },
      estado: p.estado,
      valorTotal: p.valorTotal,
      descuento: p.descuento,
    });

    // Guardar el cliente elegido
    if (p.cliente) this.form.patchValue({ cliente: p.cliente.dni });
   }
}

cargarDatosEnFormulario(p: pedidos) {
  this.form.patchValue({
    observaciones: p.observaciones,
    cliente: p.cliente?.dni ?? null,
    empleado: p.empleado?.dni ?? null,
    material: this.materiales.find(m => m.id === p.material?.id) ?? null,
    pileta: this.piletas.find(pl => pl.id === p.pileta?.id) ?? null,
    griferia: p.griferia,
    moldura: p.moldura,
    senia: p.senia,
    fechaEntrega: p.fechaEntrega,
    fechaEmision: p.fechaEmision,
    metrosCuadrados: p.metrosCuadrados,
    direccion: {
      calle: p.direccion?.calle,
      numero: String(p.direccion.numero),
      localidad: p.direccion?.localidad,
    },
    estado: p.estado,
    valorTotal: p.valorTotal,
    descuento: p.descuento,
  });

  if (p.cliente) this.clienteSeleccionado = p.cliente as cliente;
}



  // ---------------------- Formulario ----------------------
  protected readonly form = this.fb.group({
    observaciones: [''],

    // Cliente sigue siendo solo el ID
    cliente: [null as number | null, Validators.required],

    // Ahora control completo para seleccionar objeto
    empleado: [null as number | null, Validators.required],
    material: [null as material | null, Validators.required],
    pileta: [null as piletas|null, Validators.required],

    griferia: ['', Validators.required],
    moldura: [''],
    senia: [0, [Validators.required, Validators.min(0)]],
    fechaEntrega: ['', Validators.required],
    fechaEmision: [new Date().toISOString().substring(0, 10), Validators.required],
    metrosCuadrados: [0, [Validators.required, Validators.min(0)]],

    direccion: this.fb.group({
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      localidad: ['', Validators.required],
    }),

    estado: ['EN_PROCESO', Validators.required],
    valorTotal: [0],
    descuento: [0],
  });

  get direccion() {
    return this.form.get('direccion') as FormGroup;
  }

  // ---------------------- Buscar cliente ----------------------
  onClienteSearch(valor: string) {
    this.clienteBusqueda = valor;
    this.buscarClienteBackend(valor);
  }

  buscarClienteBackend(texto: string) {
    if (!texto || texto.length < 2) {
      this.clientesFiltrados = [];
      return;
    }

    const esDni = /^[0-9]+$/.test(texto);
    const filtros = esDni ? { dni: Number(texto) } : { nombre: texto };

    this.clienteService.buscar(filtros).subscribe({
      next: clientes => this.clientesFiltrados = clientes,
      error: () => this.clientesFiltrados = []
    });
  }

  seleccionarCliente(c: cliente) {
    this.form.patchValue({ cliente: c.dni });
    this.clienteSeleccionado = c;
    this.clientesFiltrados = [];
  }

  // ---------------------- Construir pedido para backend ----------------------
  private construirPedidoParaBackend() {
  const raw = this.form.getRawValue();

  return {
    observaciones: raw.observaciones ?? '',

    // Cliente
    cliente: {dni: raw.cliente! },

    // Empleado
    empleado: { dni: raw.empleado! },

    // Material
    material: { id: raw.material!.id! },

    // Pileta
    pileta: { id: raw.pileta!.id! },

    griferia: raw.griferia!,
    moldura: raw.moldura || '',

    fechaEntrega: raw.fechaEntrega!,
    fechaEmision: raw.fechaEmision!,
    metrosCuadrados: raw.metrosCuadrados!,

    direccion: {
      calle: raw.direccion!.calle!,
      numero: Number(raw.direccion!.numero),
      localidad: raw.direccion!.localidad!
    },

    estado: raw.estado!,
    valorTotal: raw.valorTotal ?? 0,
    descuento: raw.descuento ?? 0,
    senia: raw.senia ?? 0
  };
}

isEditing(){
  return this.isEditingFlag;
}

  // ---------------------- Guardar o editar ----------------------
guardar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const raw = this.form.getRawValue();

  // 🔹 Función para registrar un nuevo pedido
  const registrarPedido = () => {
    const pedidoNuevo = this.construirPedidoParaBackend();
    this.client.agregarPedido(pedidoNuevo).subscribe({
      next: () => {
        alert("Pedido guardado correctamente");
        this.edited.emit(pedidoNuevo);
        this.form.reset();

        // 🔹 Actualizar stock de la pileta
        const piletaId = pedidoNuevo.pileta.id;
        if (piletaId) {
          const nuevaCantidad = (this.piletas.find(p => p.id === piletaId)?.cantidad ?? 1) - 1;
          if (nuevaCantidad >= 0) {
            this.piletasService.actualizarStock(piletaId, nuevaCantidad).subscribe({
              next: () => this.cargarPiletas(),
              error: err => console.error("Error actualizando stock de pileta", err)
            });
          } else {
            alert("No hay stock suficiente para esta pileta");
          }
        }
      },
      error: err => {
        console.error(err);
        alert("Error al guardar el pedido");
      }
    });
  };

  if (!this.isEditing()) {
    registrarPedido();
    return;
  }

  // 🔹 EDITAR PEDIDO EXISTENTE
  if (!this.pedidoActual) {
    alert("No se ha cargado el pedido para editar.");
    return;
  }

  // Copiar el pedidoActual completo y aplicar cambios del form
 const pedidoParaEditar: pedidos = {
  ...this.pedidoActual,
  observaciones: raw.observaciones ?? this.pedidoActual.observaciones,
  senia: raw.senia ?? this.pedidoActual.senia,
  griferia: raw.griferia ?? this.pedidoActual.griferia,
  moldura: raw.moldura ?? this.pedidoActual.moldura,
  fechaEntrega: raw.fechaEntrega ?? this.pedidoActual.fechaEntrega,
  fechaEmision: raw.fechaEmision ?? this.pedidoActual.fechaEmision,
  metrosCuadrados: raw.metrosCuadrados ?? this.pedidoActual.metrosCuadrados,
  descuento: raw.descuento ?? this.pedidoActual.descuento,
  estado: raw.estado ?? this.pedidoActual.estado,
  valorTotal: raw.valorTotal ?? this.pedidoActual.valorTotal,
  direccion: {
    ...this.pedidoActual.direccion,
    calle: raw.direccion.calle ?? this.pedidoActual.direccion?.calle,
    numero: Number(raw.direccion.numero) ?? this.pedidoActual.direccion?.numero,
    localidad: raw.direccion.localidad ?? this.pedidoActual.direccion?.localidad
  },
  // 🔹 Relaciones actualizadas desde el formulario
  cliente: raw.cliente ? { dni: raw.cliente } : this.pedidoActual.cliente,
  empleado: raw.empleado ? { dni: raw.empleado } : this.pedidoActual.empleado,
  material: raw.material ? { id: raw.material.id ?? null } : this.pedidoActual.material,
  pileta: raw.pileta ? { id: raw.pileta.id ?? null } : this.pedidoActual.pileta
};

  this.client.modificarPedido(this.pedidoActual.idPedido!, pedidoParaEditar).subscribe({
    next: () => {
      alert("Pedido modificado correctamente");
      this.edited.emit(pedidoParaEditar);

      // 🔹 Actualizar stock si cambió la pileta
      const piletaId = pedidoParaEditar.pileta?.id;
      if (piletaId) this.cargarPiletas();
    },
    error: err => {
      console.error(err);
      alert("Error al modificar el pedido");
    }
  });
}


// 🔹 Método para refrescar la lista de piletas
cargarPiletas() {
  this.piletasService.getAll().subscribe
}}