import { Direccion } from "./Direccion";

export interface cliente{
    dni:number,
    correo:string,
    nombre:string,
    apellido:string,
    telefono:string,
    direcciones:Direccion[]
    

}