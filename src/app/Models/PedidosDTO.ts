export interface pediDTO {
  observaciones: string;

  clienteDni: number;
  empleadoDni: number;
  materialId: number;
  piletaId: number;

  senia: number;

  griferia: string;
  moldura: string;

  fechaEntrega: string;
  fechaEmision: string;

  metrosCuadrados: number;
  descuento: number;

  direccion: {
    calle: string;
    numero: string;
    localidad: string;
  };
}
