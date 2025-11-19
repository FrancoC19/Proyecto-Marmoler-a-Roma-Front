import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
const token = localStorage.getItem('token');
  const router = inject(Router);

  // Clonamos la request si hay token
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token vencido o no autorizado
        localStorage.removeItem('token'); // opcional: limpiar token
        router.navigate(['/login']);      // redirige al login
      }
      return throwError(() => error);
    })
  );
};