import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { pedidos } from '../Models/Pedidos';
import { retry } from 'rxjs';
import { estadoPedido } from '../Models/estado';
import { cliente } from '../Models/Cliente';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private readonly http=inject(HttpClient);
  private readonly apiUrl='http://localhost:8080/Pedidos';
  
  agregarPedido(pedido:pedidos){
    return this.http.post(`${this.apiUrl}/Guardar`,pedido,{responseType:'text'})
  }

  getAll(){
    return this.http.get<pedidos[]>(`${this.apiUrl}/Todos`);
  }

  getByEstado(estado:estadoPedido){
    return this.http.get<pedidos[]>(`${this.apiUrl}/Estado/${estado}`);
  }

  getById(id:number){
    return this.http.get<pedidos>(`${this.apiUrl}/ObtenerPedido/${id}`);
  }

  obtenerPorRangoDeFecha(fechaInicio:Date,fechaFin:Date){
    const inicio= fechaInicio.toISOString().split('T')[0];
    const fin= fechaFin.toISOString().split('T')[0];

    const params = new HttpParams().set('fechaInicio',inicio).set('fechaFin',fin);

    return this.http.get<pedidos[]>(`${this.apiUrl}/Fecha`,{params})
  }

  getPedidosProximos(dias: number){
    return this.http.get<pedidos[]>(`${this.apiUrl}/Proximos?dias=${dias}`);
  }

  modificarPedido(id:number , pedido:pedidos){
    return this.http.put(`${this.apiUrl}/ActualizarDatos/${id}`,pedido,{responseType:'text'});
  }

  eliminarPedido(id:number){
    return this.http.delete(`${this.apiUrl}/Eliminar/${id}`,{responseType:'text'});
  }

  getByMaterial(id:number){
    return this.http.get<pedidos[]>(`${this.apiUrl}/Material/${id}`);
  }

  getByEmpleado(dni:number){
    return this.http.get<pedidos[]>(`${this.apiUrl}/Empleado/${dni}`);
  }

  getByCliente(dni:number){
    return this.http.get<pedidos[]>(`${this.apiUrl}/Cliente/${dni}`);
  }

  getByClienteEmpleado(dniEmpleado:number,dniCliente:number){
    return this.http.get<pedidos[]>(`${this.apiUrl}/ClienteEmpleado`,{
      params:{
        dniCliente:dniCliente.toString(),
        dniEmpleado:dniEmpleado.toString()
      }
    })
  }

  finalizarPedido(id:number) {
  return this.http.put(`${this.apiUrl}/Finalizar/${id}`,{responseType: 'text'});
}
}
