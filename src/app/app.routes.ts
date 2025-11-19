import { Routes } from '@angular/router';
import { TablaPedidos } from './Componentes/Tablas/tabla-pedidos/tabla-pedidos';
import { FormularioPedidos } from './Componentes/Formularios/formulario-pedidos/formulario-pedidos';
import { TablaPiletas } from './Componentes/Tablas/tabla-piletas/tabla-piletas';
import { TablaMateriales } from './Componentes/Tablas/tabla-materiales/tabla-materiales';
import { FormularioPiletas } from './Componentes/Formularios/formulario-piletas/formulario-piletas';
import { FormularioEmpleados } from './Componentes/Formularios/formulario-empleados/formulario-empleados';
import { FormularioMateriales } from './Componentes/Formularios/formulario-materiales/formulario-materiales';
import { FormularioClientes } from './Componentes/Formularios/formulario-clientes/formulario-clientes';
import { Login } from './Componentes/login/login';
import { TablaClientes } from './Componentes/Tablas/tabla-clientes/tabla-clientes';
import { FormularioUsuario } from './Componentes/Formularios/formulario-usuario/formulario-usuario';
import { TablaUsuarios } from './Componentes/Tablas/tabla-usuarios/tabla-usuarios';
import { DetailPedidos } from './Componentes/Details/detail-pedidos/detail-pedidos';

export const routes: Routes = [
    { path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', component:Login, title:"login"},
    {path:'TablaPedidos',component:TablaPedidos},
    {path:'FormularioPedidos',component:FormularioPedidos},
    {path:'TablaPiletas',component:TablaPiletas},
    {path:'TablaMateriales', component:TablaMateriales},
    {path:'FormularioPiletas',component:FormularioPiletas},
    {path:'FormularioEmpleados',component:FormularioEmpleados},
    {path:'FormularioMateriales',component:FormularioMateriales},
    {path:'FormularioClientes',component:FormularioClientes},
    {path:'FormularioMateriales/:id', component:FormularioMateriales},
    {path:'FormularioPiletas/:id', component:FormularioPiletas},
    {path:'FormularioClientes/:dni',component:FormularioClientes},
    {path:'TablaClientes',component:TablaClientes},
    { path: 'FormularioUsuarios', component: FormularioUsuario },
    { path: 'FormularioUsuarios/:id', component: FormularioUsuario }, 
    { path: 'TablaUsuarios', component: TablaUsuarios} ,
    {path:'DetallesPedidos/:id', component:DetailPedidos},
    {path:'FormularioPedidos/:id',component:FormularioPedidos},
    { path: '**', redirectTo: 'login' }

];
