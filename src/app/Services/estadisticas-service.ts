import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MetrosPorMaterial } from '../Models/MetrosPorMaterial';
import { PedidosPorEstado } from '../Models/PedidosPorEstado';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  private apiUrl ='http://localhost:8080/Estadisticas';
  private http=inject(HttpClient);


  getMetrosPorMaterial(desde:string,hasta:string){
    const params=new HttpParams().set('desde',desde).set('hasta',hasta);
    return this.http.get<MetrosPorMaterial[]>(`${this.apiUrl}/MetrosPorMaterial`,{params})
  }

  getPedidosPorEstado(desde:string,hasta:string){
    const params= new HttpParams().set('desde',desde).set('hasta',hasta);
    return this.http.get<PedidosPorEstado[]>(`${this.apiUrl}/PedidosPorEstado`,{params});
  }

  getRangoUltimaSemana(){
    return this.getRango(7);
  }

  getRangoUltimoMes(){
    return this.getRango(30);
  }

  getRangoUltimoAnio(){
    return this.getRango(365);
  }

  private getRango(dias:number){
    const hasta= new Date();
    const desde= new Date();

    desde.setDate(desde.getDate()-dias);
    return {desde: this.fmt(desde),hasta:this.fmt(hasta)};

  }

  private fmt(d:Date): string{
    return d.toISOString().split('T')[0];
  }
}
