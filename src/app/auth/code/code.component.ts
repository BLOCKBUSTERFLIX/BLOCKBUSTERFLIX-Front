import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './code.component.html',
  styleUrl: './code.component.css'
})
export class CodeComponent {
  codeForm: FormGroup;
  errors: any = {}
  mensaje = signal<string>("");

  constructor(
    private service: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ){
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void{
    if(localStorage.getItem('verification') == "twoFactor"){
      this.mensaje.set("Please enter the verification code sent to your email.");
    }else if(localStorage.getItem('verification') == "recovery"){
      this.mensaje.set("Please enter the recovery code sent to your email. This code is required to reset your password and regain access to your account.");
    }
  }

  onSubmit(): void{
    if(this.codeForm.invalid) return;

    this.errors = {};

    const formValue = this.codeForm.value.code;
    const storedValue = localStorage.getItem('email'); 

    const data = {
      code: formValue,
      email: storedValue
    };

    if(localStorage.getItem('verification') == "twoFactor"){
      this.service.verificationCode(data).subscribe(
        (response) =>{
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', response.data.username);
          Swal.fire({
            icon: "success",
            title: "Login exitoso!!!",
            text: "Se te redireccionara a la pagina de inicio.",
            showConfirmButton: false,
            timer: 1500,
            didClose: () => {
              localStorage.removeItem('email');
              localStorage.removeItem('verification');
              this.router.navigate(['']);
            }
          });
        },
        (error) => {
          console.log(error);
          if(error.name == "TimeOutError"){
            this.onSubmit();
          }
          Swal.fire({
            title: 'Error',
            text: 'Ocurrio un error :(',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }else if(localStorage.getItem('verification') == "recovery"){
      this.service.verifyRecoveryCode(data).subscribe(
        (response) =>{
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('validate_code', response.data.validate_code);
          Swal.fire({
            icon: "success",
            title: "Código de recuperación valido!!!",
            showConfirmButton: false,
            timer: 1500,
            didClose: () => {
              this.router.navigate(['/recovery-password']);
            }
          });
        },
        (error) => {
          console.log(error);
          if(error.name == "TimeOutError"){
            this.onSubmit();
          }
          Swal.fire({
            title: 'Error',
            text: 'Ocurrio un error :(',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }else{
      this.router.navigate(['**']);
    }
  }
}
