import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private  router= inject(Router);

  form= this.fb.nonNullable.group({
    correo:['',[Validators.required]],
    password:['',[Validators.required]]
  });

  handleLogin(){
  if(this.form.invalid){
    alert("Completa todos los campos");
    return;
  }
  const {correo, password} = this.form.getRawValue();
  this.auth.login(correo,password).subscribe({
    next:(response)=>{
      localStorage.setItem('token',response.token);
      this.router.navigateByUrl(`/TablaPedidos`);
    },
    error:(err)=>{
      if(err.status === 403){   // token expirado o inválido
        localStorage.removeItem('token');
        alert("Tu sesión expiró. Inicia sesión nuevamente.");
        this.router.navigate(['/login']);
      } else {
        alert("Error en inicio de sesión");
      }
      console.error(err);
    }
  })
}
getcorreo(){return this.form.controls.correo}
getpassword(){return this.form.controls.password}

}
