export interface Usuario {
    id?: number;
    email: string;
    tipoUsuario: 'ADMINISTRADOR' | 'USUARIO'; 
    contra?: string;
}
