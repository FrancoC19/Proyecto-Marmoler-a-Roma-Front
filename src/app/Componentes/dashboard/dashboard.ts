import { Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { EstadisticasService } from '../../Services/estadisticas-service';
import { forkJoin } from 'rxjs';
import { MetrosPorMaterial } from '../../Models/MetrosPorMaterial';
import { PedidosPorEstado } from '../../Models/PedidosPorEstado';
import { CommonModule } from '@angular/common';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  @ViewChild('chartMetros')chartMetrosRef!:ElementRef<HTMLCanvasElement>;
  @ViewChild('chartEstados')chartEstadosRef!:ElementRef<HTMLCanvasElement>
  private chartMetros?:Chart;
  private chartEstados?:Chart;

  desde='';
  hasta='';
  periodoActivo='mes';
  totalMetros = 0;
  totalPedidos = 0;
  cargando = false;
  error = '';

  private estadisticasService=inject(EstadisticasService);

  ngOnInit(): void{
    this.aplicarPeriodo('mes');
  }

  aplicarPeriodo(periodo:string):void{
    this.periodoActivo=periodo;
    let rango:{desde:string;hasta:string};

    if(periodo==='semana') rango=this.estadisticasService.getRangoUltimaSemana();
    else if (periodo==='mes') rango=this.estadisticasService.getRangoUltimoMes();
    else rango=this.estadisticasService.getRangoUltimoAnio();

    this.desde=rango.desde;
    this.hasta=rango.hasta;
    this.cargarDatos();
  }

  aplicarPersonalizado():void{
    if(!this.desde||!this.hasta) return
    if(this.desde>this.hasta){
      this.error='La fecha de inicio no puede ser mayor a la final';
      return;
    }
    this.periodoActivo='custom';
    this.cargarDatos();
  }

  private cargarDatos():void{
    this.cargando= true;
    this.error='';
    forkJoin({
      metros: this.estadisticasService.getMetrosPorMaterial(this.desde,this.hasta),
      estados: this.estadisticasService.getPedidosPorEstado(this.desde,this.hasta)
    }).subscribe({
      next:({metros,estados})=>{
        this.cargando=false;
        this.totalMetros=Math.round(metros.reduce((acc,m)=>acc+m.metrosCuadrados,0)*100)/100;
        this.totalPedidos=estados.reduce((acc,e)=>acc+e.cantidad,0);
        console.log('METROS:', metros);      // ← agregás esto
    console.log('ESTADOS:', estados);    // ← y esto
        setTimeout(()=>{
          this.renderChartMetros(metros);
          this.renderChartEstados(estados);
        });
      },
      error:()=>{
        this.cargando=false;
        this.error='Error a cargar los datos. verifica que el backend corra';
      }
    });

  }

  private renderChartMetros(datos:MetrosPorMaterial[]):void{
    this.chartMetros?.destroy();
    this.chartMetros= new Chart(this.chartMetrosRef.nativeElement,{
      type:'bar',
      data: {
        labels: datos.map(d=>d.material),
        datasets: [{
          label:'Metros²',
          data:datos.map(d=>d.metrosCuadrados),
          backgroundColor: ['#700000', '#a00000', '#c0392b', '#922b21', '#641e16'],
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
          legend:{display:false},
          tooltip:{callbacks:{label:ctx=>`${ctx.parsed.y}m²`}}
        },
        scales:{
          y:{beginAtZero:true, grid:{color:'#f5e8e8'}},
          x:{grid:{display:false}}
        }
      }
    });
  }

  private renderChartEstados(datos:PedidosPorEstado[]):void{
    const colores: Record<string,string>={
    'EN_PROCESO':'#2563eb',
    'PENDIENTE_DE_ENTREGA':'#d97706',
    'ENTREGADO':'#16a34a'
    };
    this.chartEstados?.destroy();
    this.chartEstados = new Chart(this.chartEstadosRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: datos.map(d => d.estado),
        datasets: [{
          data: datos.map(d => d.cantidad),
          backgroundColor: datos.map(d => colores[d.estado] ?? '#8C7B6B'),
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, boxWidth: 14 } }
        }
      }
    });
  }
}
