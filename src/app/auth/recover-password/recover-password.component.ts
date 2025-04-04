import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  recoveryPasswordForm: FormGroup;
  errors: any = {};

  constructor(
    private service: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ){
    this.recoveryPasswordForm = this.fb.group({
      new_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      new_password_confirmation: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]]
    });
  }

  ngOnInit(){}

  onSubmit(){
    if(this.recoveryPasswordForm.invalid) return;

    this.errors = {};

    const formValue = this.recoveryPasswordForm.value;
    const emailValue = localStorage.getItem('email'); 
    const verifyValue = localStorage.getItem('validate_code');

    const data = {
      email: emailValue,
      new_password: formValue.new_password,
      new_password_confirmation: formValue.new_password_confirmation,
      validate_code: verifyValue
    };
    
    this.service.resetPassword(data).subscribe(
      (response) => {
        Swal.fire({
          icon: "success",
          title: "Contraseña reestablecida.",
          text: "La contraseña ha sido reestablecida, se te redireccionara al inicio de sesión.",
          showConfirmButton: false,
          timer: 1500,
          didClose: () => {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        });
      },
      (error) => {
        console.log(error)
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
  }
}
