import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from "./Componentes/header/header";
import { Footer } from "./Componentes/footer/footer";
import { filter } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer,CommonModule,NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MarmoleriaRomaFront');
  isLoginRoute = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginRoute = event.url.includes('/login');
      });
  }
}
