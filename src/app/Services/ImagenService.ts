import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Imagen } from '../Models/Imagen';

@Injectable({
    providedIn:'root',
})
export class ImagenService{
    private readonly http=inject(HttpClient)
    private readonly apiUrl='http://localhost:8080/Imagenes';

    agregarImagen(img:Imagen){
        return this.http.post<void>(`${this.apiUrl}/Agregar/${img.idPedido}`,img.imagen);
    }

    todasDePedido(idPedido:number){
        return this.http.get<Imagen[]>(`${this.apiUrl}/TodasDePedido/${idPedido}`);
    }

    especificaDePedido(img:Imagen){
        return this.http.get<Imagen>(`${this.apiUrl}/DePedido/${img.idPedido}/${img.numeroDeImagenDelPedido}`);
    }

    actualizarImagen(img:Imagen){
        return this.http.put<void>(`${this.apiUrl}/Actualizar/${img.idPedido}/${img.numeroDeImagenDelPedido}`,img.imagen);
    }

    eliminarImagen(img:Imagen){
        return this.http.delete<void>(`${this.apiUrl}/Eliminar/${img.idPedido}/${img.numeroDeImagenDelPedido}`);
    }
}