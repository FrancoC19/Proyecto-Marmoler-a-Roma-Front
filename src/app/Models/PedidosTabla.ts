import { pedidos } from "./Pedidos";


export interface pedidosTabla extends pedidos {
  clienteNombre?: string;
  empleadoNombre?: string;
  materialNombre?: string;
}
