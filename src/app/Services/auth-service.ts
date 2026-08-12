import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Usuario } from '../Models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
private readonly http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/auth';

  login(correo: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { correo, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);

          const payload = JSON.parse(atob(res.token.split('.')[1]));
          localStorage.setItem('rol', payload.tipoUsuario); // ← AGREGADO
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol'); // ← IMPORTANTE
  }

  getRol(): string {
    return localStorage.getItem('rol') ?? '';
  }

  esAdmin(): boolean {
  const rol = this.getRol().toUpperCase();
  return rol === 'ADMIN' || rol === 'ADMINISTRADOR';
}


  getUsuario(): Usuario | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const ahora = Math.floor(Date.now() / 1000);
      if (payload.exp && ahora > payload.exp) {
        this.logout();
        return null;
      }

      return {
        id: payload.id,
        email: payload.email,
        tipoUsuario: payload.tipoUsuario,
      } as Usuario;
    } catch {
      this.logout();
      return null;
    }
  }

  estaLogueado(): boolean {
    return !!this.getToken();
  }
}