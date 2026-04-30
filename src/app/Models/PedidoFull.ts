import { cliente } from "./Cliente";
import { empleado } from "./Empleado";
import { material } from "./Materiales";
import { piletas } from "./Piletas";
import { Direccion } from "./Direccion";

export interface PedidoFull {
  id: number;

  observaciones: string;
  cliente: cliente;
  empleado: empleado;

  material: material;
  pileta: piletas;

  griferia: string;
  moldura: string;
  senia: number;

  fechaEntrega: string;
  fechaEmision: string;

  metrosCuadrados: number;
  descuento: number;

  direccion: Direccion;
  valorTotal: number;
}
