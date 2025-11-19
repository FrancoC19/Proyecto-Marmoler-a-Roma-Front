import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { cliente } from '../Models/Cliente';
import { Direccion } from '../Models/Direccion';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly http=inject(HttpClient);
  private readonly apiUrl='http://localhost:8080/Cliente';

  agregarCliente(cliente:cliente){
    return this.http.post<cliente>(`${this.apiUrl}/Guardar`,cliente);
  }

  getByDni(dni:number){
    return this.http.get<cliente>(`${this.apiUrl}/Buscar/${dni}`);
  }

  getAll(){
    return this.http.get<cliente[]>(`${this.apiUrl}/Todos`);
  }

  modificarCliente(dni:number, cliente:cliente){
    return this.http.put<cliente>(`${this.apiUrl}/${dni}`,cliente);
  }

  getDireccionesByDni(dni:number){
    return this.http.get<Direccion[]>(`${this.apiUrl}/direcciones/${dni}`);
  }

  agregarDireccion(dni:number, direccion:Direccion){
    return this.http.post(`${this.apiUrl}/agregarDireccion/${dni}`,direccion);
  }

  eliminarDireccion(dni:number, direccion:Direccion){
    return this.http.request('DELETE',`${this.apiUrl}/eliminarDireccion/${dni}`,{
      body:direccion,
      responseType:'text'
    })
  }

  getByNombreyApellido(nombre:string, apellido:string){
    return this.http.get<cliente>(`${this.apiUrl}/buscarNombreyApellido`,{params:{nombre , apellido}})
  }

  getByTelefono(telefono:number){
    return this.http.get<cliente>(`${this.apiUrl}/telefono/${telefono}`);
  }

  getByCorreo(correo:string){
    return this.http.get<cliente>(`${this.apiUrl}/correo/${correo}`);
  }

  buscar(Filtros:{nombre?:string,apellido?:string,telefono?:number,correo?:string,dni?:number}){
    const params:any={};
    if(Filtros.nombre) params.nombre=Filtros.nombre;
    if(Filtros.apellido) params.apellido=Filtros.apellido;
    if(Filtros.telefono) params.telefono=Filtros.telefono;
    if(Filtros.correo) params.correo=Filtros.correo;
    if(Filtros.dni) params.dni=Filtros.dni;
    return this.http.get<cliente[]>(`${this.apiUrl}/clientes/buscar`,{params});
  }

  eliminarCliente(id:number){
    return this.http.delete(`${this.apiUrl}/Eliminar/${id}`);
  }
  
}
