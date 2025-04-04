import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  errors: any = {}

  constructor(
    private service: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ){
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}')]],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.emailForm.invalid) return;

    this.errors = {};

    const data = this.emailForm.value;

    this.service.sendRecoveryCode(data).subscribe(
      (response) =>{
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('verification', "recovery");
        Swal.fire({
          icon: "success",
          title: "Código de recuperación enviado al correo",
          text: "Se ha enviado un correo de recuperación a tu correo.",
          showConfirmButton: false,
          timer: 1500,
          didClose: () => {
            this.router.navigate(['/code']);
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
