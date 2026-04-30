import { Component, effect, inject, input, output } from '@angular/core';
import { EmpleadosService } from '../../../Services/EmpleadosService';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { empleado } from '../../../Models/Empleado';

@Component({
  selector: 'app-formulario-empleados',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-empleados.html',
  styleUrl: './formulario-empleados.css',
})
export class FormularioEmpleados {
  private readonly client=inject(EmpleadosService);
  private readonly fb=inject(FormBuilder);

  readonly empleados= input<empleado>();
  readonly isEditing= input(false);
  readonly edited= output<empleado>();

  constructor(){
    effect(()=>{
      if(this.isEditing()&&this.empleados()){
        this.form.patchValue(this.empleados()!);
      }
    }
    )
  }
  
    protected readonly RolesEmpleados=[
    'PULIDOR','CORTADOR'
  ]

    protected readonly form= this.fb.nonNullable.group({  
      dni:[0,[Validators.required,Validators.minLength(7), Validators.maxLength(7)]],
      correo:['',[Validators.required,Validators.email]],
      nombre:['',Validators.required],
      rolesEmpleado:['',Validators.required]
    })

    getdni(){
      return this.form.controls.dni;
    }

    getcorreo(){
      return this.form.controls.correo;
    }

    getnombre(){
      return this.form.controls.nombre;
    }

    getrolesEmpleado(){
      return this.form.controls.rolesEmpleado;
    }

    getdirty(){
      return this.form.dirty;
    }

    gettouched(){
      return this.form.touched;
    }

    handleSubmit(){
      if(this.form.invalid){
        alert("El formulario es invalido");
        return;
      }
        if(confirm("desea confirmar los datos?")){
      const empleado=this.form.getRawValue();
      if(this.isEditing()){
        this.client.modificarEmpleado(this.empleados()?.dni!,empleado).subscribe((e)=>{
          alert("Empleado Modificado correctamente");
          this.edited.emit(e);
        });
      }else{
        this.client.agregarEmpleado(empleado).subscribe((e)=>{
          alert("Empleado Cargado Correctamente");
          this.edited.emit(e);
        })
      }
      }
    }



}
