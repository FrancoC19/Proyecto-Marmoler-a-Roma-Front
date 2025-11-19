import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { material } from '../Models/Materiales';


@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  private readonly http=inject(HttpClient);  
  private readonly apiUrl='http://localhost:8080/Materiales'

  agregarMaterial(material : material){
    return this.http.post<material>(`${this.apiUrl}/Guardar`,material);
  }
  getMaterialByNombre(nombre:string){
    return this.http.get<material>(`${this.apiUrl}/BuscarNombre/${nombre}`);
  }

  getAll(){
    return this.http.get<material[]>(`${this.apiUrl}/Todos`);
  }

  modificarMaterial(material: material, id:number){
    return this.http.put<material>(`${this.apiUrl}/Modificar/${id}`,material);
  }

  getTipoMaterial(Tipo:string){
    return this.http.get<material[]>(`${this.apiUrl}/Tipo/${Tipo}`);
  }

  getPrecioMaterial(precio: number){
    return this.http.get<material[]>(`${this.apiUrl}/Precio/${precio}`);
  }

  deleteByNombre(nombre:string){
    return this.http.delete(`${this.apiUrl}/Eliminar/${nombre}`,{responseType:'text'});
  }
  getById(id: number) {
  return this.http.get<material>(`${this.apiUrl}/Buscar/${id}`);
}
}
