import { cliente } from "./Cliente";
import { Direccion } from "./Direccion";
import { empleado } from "./Empleado";
import { estadoPedido } from "./estado";
import { material } from "./Materiales";
import { piletas } from "./Piletas";

export interface pedidos {
  idPedido?: number;

  observaciones?: string;

  cliente: { dni: number | null };
  empleado: { dni: number | null };
  material: { id: number | null };
  pileta: { id: number | null };

  griferia?: string;
  moldura?: string;

  fechaEntrega: string;
  fechaEmision: string;

  metrosCuadrados: number;
  direccion: {
  calle: string;
  numero: Number;   
  localidad: string;
};
  estado: string;
  valorTotal: number;

  descuento?: number;
  senia?: number;
}