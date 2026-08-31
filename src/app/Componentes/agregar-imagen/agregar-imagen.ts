import { Component, inject, Inject, numberAttribute, OnInit } from '@angular/core';
import { ImagenService } from '../../Services/ImagenService';
import { Imagen } from '../../Models/Imagen';
import { ActivatedRoute, Router } from '@angular/router';
import { resolve } from 'chart.js/helpers';

@Component({
  selector: 'app-agregar-imagen',
  imports: [],
  templateUrl: './agregar-imagen.html',
  styleUrl: './agregar-imagen.css',
})
export class AgregarImagen implements OnInit {

  private imagen: Imagen = {
  idImagen: 0,
  version: 0,
  numeroDeImagenDelPedido: 0,
  idPedido: 0,
  imagen: ''
  };  
  
  //Se guardaran todas las imagenes del pedido
  todasImagenes:Imagen[]=[];
  //Elemento para extraer el id de la ruta activa
  private route=inject(ActivatedRoute);
  //Elemento para poder "viajar" entre las "pestañas"
  private ruta=inject(Router);
  //Elemento al cual se le ingresara la nueva imagen que se le agregara al pedido
  imagenSeleccionada?:File;

  //constuctor para setear el service
  constructor(
    private serviceImagen:ImagenService
  ){}

  //funcion OnInit, que se ejecutara al iniciarce la "pestaña"
  ngOnInit(){
    //Se extrae el id de la ruta activa y se lo coloca en una constante de la funcion
    const id=Number(this.route.snapshot.paramMap.get("id"));

    this.imagen.idPedido=id;

    //Se ejecuta la funcion que trae todas las imagenes, al cual se le pasa el id del pedido
    this.serviceImagen.todasDePedido(id).subscribe({
      next:(dato)=>{
        //se ingresa la respuesta de la funcion del service a "todasImagenes" si la respuesta es positiva
        this.todasImagenes=dato;
      },
      error:(err)=>{
        //ante un error, se lanzara el error por consola
        console.error("Error al cargar imagenes: ",err);
      }
    })
  }

  recargarImagenes(){
    this.serviceImagen.todasDePedido(this.imagen.idPedido).subscribe({
      next:(dato)=>{
        //se ingresa la respuesta de la funcion del service a "todasImagenes" si la respuesta es positiva
        this.todasImagenes=dato;
      },
      error:(err)=>{
        //ante un error, se lanzara el error por consola
        console.error("Error al cargar imagenes: ",err);
      }
    })
  }

  //Funcion para traer la imagen desde el html
  seleccionaImagen(event:Event){
    //trae, a partir del evento input, un elemento
    const input= event.target as HTMLInputElement;

    //revisa que el elemento sea un file y que sea un elemento completo y no vacio
    if(input.files && input.files.length>0){
      this.imagenSeleccionada=input.files[0];
    }
  }

  soltarImagen(event: DragEvent) {
    // Evita que el navegador intente abrir la imagen
    // que acabamos de arrastrar.
    event.preventDefault();

    // Comprobamos que existan archivos.
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {

      // Tomamos el primer archivo arrastrado.
      this.imagenSeleccionada = event.dataTransfer.files[0];
    }
  }

  convertirABase64(file:File):Promise<string>{
    // Creamos una Promise porque leer el archivo
    // puede tardar un poco.
    return new Promise((resolve, reject) => {

      // Creamos un lector de archivos.
      const reader = new FileReader();

      // Si el archivo se pudo leer correctamente...
      reader.onload = () => {

        // Devolvemos el resultado de la lectura como texto.
        resolve(reader.result as string);
      };

      // Si ocurrió un error al leer el archivo...
      reader.onerror = () => {

        // Devolvemos el error.
        reject(reader.error);
      };

      // Empezamos a leer el archivo y convertirlo
      // a un texto en formato Base64.
      reader.readAsDataURL(file);
    });
  }

  async guardarImagen(){
    if (!this.imagenSeleccionada) {
      console.error("No se seleccionó ninguna imagen");
      return;
    }

    const base64= await this.convertirABase64(this.imagenSeleccionada);

    this.imagen.imagen=base64;
    
    this.serviceImagen.agregarImagen(this.imagen).subscribe({
      next:()=>{
        console.log("Imagen guardada exitosamente");
        this.recargarImagenes();
        this.imagenSeleccionada=undefined;
      },
      error:(err)=>{
        console.log("Error al guardar la imagen: ",err)
      }
    });
  }

  eliminarImagen(numeroImagen:number){
    this.imagen.numeroDeImagenDelPedido=numeroImagen;
    this.serviceImagen.eliminarImagen(this.imagen).subscribe({
      next:()=>{
        console.log("Imagen eliminada exitosamente");
        this.recargarImagenes();
      },
      error:(err)=>{
        console.log("Error al eliminar la imagen: ",err)
      }
    });
  }

}
