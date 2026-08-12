import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
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
import { pediDTO } from '../../../Models/PedidosDTO';
import { Direccion } from '../../../Models/Direccion';
import { PedidoFull } from '../../../Models/PedidoFull';


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
  readonly editedDTO = output<pediDTO>();
  
  isEditing = signal(false);

  empleados: empleado[] = [];
  materiales: material[] = [];
  piletas: piletas[] = [];
  direccionesCliente = signal<Direccion[]>([]);

  clienteBusqueda: string = "";
  clientesFiltrados: cliente[] = [];
  clienteSeleccionado: cliente | null = null;

 ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  //cargar el pedido
  if (id) {
    this.isEditing.set(true);

    this.client.getById(Number(id)).subscribe({
      next: pedido => {
        this.rellenarFormulario(pedido);
      },
      error: () => console.error("Error obteniendo pedido")
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
}


  // ---------------------- Formulario ----------------------
  protected readonly form = this.fb.group({
    observaciones: [''],

    cliente: [null as number | null, Validators.required],

    empleado: [null as number | null, Validators.required],
    material: [null as number | null, Validators.required],
    pileta: [null as number|null, Validators.required],

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
  this.clienteSeleccionado = c;
  this.clienteBusqueda = `${c.nombre} ${c.apellido}`;
  this.form.patchValue({ cliente: c.dni });

  // cargar direcciones
  this.clienteService.getDireccionesByDni(c.dni).subscribe({
    next: (dirs) => {
      this.direccionesCliente.set(dirs);

      // limpiar campos de dirección si cambio de cliente
      this.direccion.reset();
    }
  });

  this.clientesFiltrados = [];
}

onDireccionSeleccionada(event: any) {
  const index = event.target.value;

  if (index === "" || index === null) {
    this.direccion.reset();
    return;
  }

  const seleccionada = this.direccionesCliente()[index];

  this.direccion.patchValue({
    calle: seleccionada.calle,
    numero: seleccionada.numero,
    localidad: seleccionada.localidad
  });
}

  //--------------------- Buscar el pedido ------------------------

  cargarPedidoParaEditar(id: number) {
  this.client.getById(id).subscribe({
    next: (pedido) => {
      this.rellenarFormulario(pedido);
    },
    error: (err) => {
      console.error("Error cargando pedido:", err);
      alert("No se pudo cargar el pedido");
    }
  });
}

rellenarFormulario(pedido: PedidoFull) {
  this.form.patchValue({
    observaciones: pedido.observaciones,
    cliente: pedido.cliente.dni,
    empleado: pedido.empleado.dni,
    material: pedido.material.id,
    pileta: pedido.pileta.id,
    griferia: pedido.griferia,
    moldura: pedido.moldura,
    senia: pedido.senia,
    fechaEntrega: pedido.fechaEntrega,
    fechaEmision: pedido.fechaEmision,
    metrosCuadrados: pedido.metrosCuadrados,
    descuento: pedido.descuento,
    direccion: {
      calle: pedido.direccion.calle,
      numero: pedido.direccion.numero.toString(),
      localidad: pedido.direccion.localidad
    }
  });

  // opcional: seleccionar cliente automáticamente
  this.clienteBusqueda = `${pedido.cliente.nombre} ${pedido.cliente.apellido}`;
  this.clienteSeleccionado = pedido.cliente;
  this.direccionesCliente.set(pedido.cliente.direcciones);
}




  // ---------------------- Construir pedido ----------------------
  private construirPedidoParaBackend() {
    const raw = this.form.getRawValue();

    return {
      observaciones: raw.observaciones ?? '',

      clienteDni: raw.cliente!,
      empleadoDni: raw.empleado!,
      materialId: raw.material!,
      piletaId: raw.pileta!,

      senia: raw.senia ?? 0,

      griferia: raw.griferia!,
      moldura: raw.moldura || '',

      fechaEntrega: raw.fechaEntrega!,
      fechaEmision: raw.fechaEmision!,

      metrosCuadrados: raw.metrosCuadrados!,
      descuento: raw.descuento ?? 0,

      direccion: {
        calle: raw.direccion!.calle!,
        numero: raw.direccion!.numero!,
        localidad: raw.direccion!.localidad!
      }
    };
  }

  // ---------------------- Guardar ----------------------
  guardar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const dto = this.construirPedidoParaBackend();
  const id = this.route.snapshot.paramMap.get('id');

  // MODO EDICIÓN
  if (id) {
    this.client.modificarPedido(Number(id), dto).subscribe({
      next: () => {
        alert("Pedido modificado correctamente");
      },
      error: (err) => {
        console.error(err);
        alert("Error al modificar el pedido");
      }
    });

    return;
  }

  // MODO ALTA
  this.client.agregarPedido(dto).subscribe({
    next: () => {
      alert("Pedido guardado correctamente");
      this.form.reset();
      this.editedDTO.emit(dto);
    },
    error: (err) => {
      console.error(err);
      alert("Error al guardar el pedido");
    }
  });
}


  // Recargar piletas
  cargarPiletas() {
    this.piletasService.getAll().subscribe();
  }
}
