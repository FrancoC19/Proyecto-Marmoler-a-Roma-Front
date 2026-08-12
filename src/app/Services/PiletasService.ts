import { HttpClient } from '@angular/common/http';
import { inject, Injectable, model } from '@angular/core';
import { piletas } from '../Models/Piletas';

@Injectable({
  providedIn: 'root',
})
export class PiletasService {
  private readonly http=inject(HttpClient);
  private readonly apiURL='http://localhost:8080/Piletas';

  agregarPiletas(pileta:piletas){
    return this.http.post<piletas>(`${this.apiURL}/Guardar`,pileta);
  }

  getByModelo(modelo:string){
    return this.http.get<piletas[]>(`${this.apiURL}/BuscarModelo/${modelo}`);
  }

  getByMarca(marca:string){
    return this.http.get<piletas[]>(`${this.apiURL}/BuscarMarca/${marca}`);
  }

  getByModeloMarca(marca:string, modelo:string){
    return this.http.get<piletas[]>(`${this.apiURL}/BuscarModeloyMarca/${marca}/${modelo}`)
  }

  getAll(){
    return this.http.get<piletas[]>(`${this.apiURL}/Todas`);
  }

  eliminarPileta(id:number){
    return this.http.delete(`${this.apiURL}/Eliminar/${id}`,{responseType:'text'});
  }

  modificarPileta(id:number, pileta:piletas){ 
    return this.http.put<piletas>(`${this.apiURL}/Modificar/${id}`,pileta);
  }

  actualizarStock(id:number, cantidad:number){
    return this.http.put(`${this.apiURL}/ModificarStock/${id}/${cantidad}`,{},{responseType:'text'});
  }

  getById(id:number){
    return this.http.get<piletas>(`${this.apiURL}/BuscarId/${id}`);
  }
  
}
