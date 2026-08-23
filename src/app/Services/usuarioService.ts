
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../Models/Usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/Usuario';

  todos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.api}/Todos`);
  }

  guardar(usuario: Usuario): Observable<string> {
    return this.http.post(`${this.api}/Guardar`, usuario, {
      responseType: 'text' as 'text'
    });
  }

  buscarPorTipo(tipo: 'ADMINISTRADOR' | 'USUARIO'): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.api}/Tipo/${tipo}`);
  }

  buscarPorID(id:number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/buscarPorID/${id}`);
  }

  buscarPorEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/Email/${email}`);
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.api}/Eliminar/${id}`, {
      responseType: 'text' as 'text'
    });
  }

  modificar(id: number, usuario: Usuario): Observable<string> {
    return this.http.put(`${this.api}/Modificar/${id}`, usuario, {
      responseType: 'text' as 'text'
    });
  }
}


