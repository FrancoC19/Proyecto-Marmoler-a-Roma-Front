import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { empleado } from '../Models/Empleado';
import { registerInjectable } from '@angular/core/primitives/di';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private readonly http=inject(HttpClient);
  private readonly apiUrl='http://localhost:8080/Empleado';

  agregarEmpleado(empleado:empleado){
    return this.http.post<empleado>(`${this.apiUrl}/Guardar`,empleado);
  }

  eliminarEmpleado(dni:number){
    return this.http.delete(`${this.apiUrl}/Eliminar/${dni}`,{responseType:'text'});
  }

  getAll(){
    return this.http.get<empleado[]>(`${this.apiUrl}/Todos`);
  }

  getByDni(dni:number){
    return this.http.get<empleado>(`${this.apiUrl}/ObtenerPorDNI/${dni}`);
  }

  getByNombre(nombre:string){
    return this.http.get<empleado>(`${this.apiUrl}/BuscarPorNombre/${nombre}`)
  }

  getByCorreo(correo:string){
    return this.http.get<empleado>(`${this.apiUrl}/BuscarPorCorreo/${correo}`);
  }

  modificarEmpleado(dni:number,empleado:empleado){
    return this.http.put<empleado>(`${this.apiUrl}/Modificar/${dni}`,empleado)
  }
  
}
