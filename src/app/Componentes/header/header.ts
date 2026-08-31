import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../Services/auth-service';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Notificacion } from '../../Models/Notificacion';
import { OnInit } from '@angular/core';

@Component({
  selector: 'header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public auth = inject(AuthService);   
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  public notificaciones: Notificacion[] = [];
  public notificacionesAdmin: Notificacion[] = [];
  public mostrarDropdown = false;

  toggleDropdown() {
    this.cargarNotificaciones();
    this.cargarNotificacionesAdmin();
    this.mostrarDropdown = !this.mostrarDropdown;
  }

  cargarNotificaciones() {
    this.http.get<Notificacion[]>('http://localhost:8080/notificaciones/todas').subscribe({
      next: (data) => { 
        console.log('Notificaciones recibidas:', data); 
        if (data && data.length > 0) {
          this.notificaciones = data;
        } else {
          this.notificaciones = [];
        }
      },
      error: (err) => console.error('Error al cargar notificaciones', err)
    });
  }

  cargarNotificacionesAdmin() {
    this.http.get<Notificacion[]>('http://localhost:8080/notificaciones/pedidosAdmin').subscribe({
      next: (data) => { 
        console.log('Notificaciones recibidas:', data); 
        if (data && data.length > 0) {
          this.notificacionesAdmin = data;
        } else {
          this.notificacionesAdmin = [];
        }
      },
      error: (err) => console.error('Error al cargar notificaciones', err)
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.cargarNotificaciones(); 
    this.cargarNotificacionesAdmin();
  }
}