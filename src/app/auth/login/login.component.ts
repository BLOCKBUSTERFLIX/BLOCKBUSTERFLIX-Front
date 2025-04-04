import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  errors: any = {};

  constructor(
    private service: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}')]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void{
    if(this.loginForm.invalid) return;

    this.errors = {};

    const userData = this.loginForm.value;

    this.service.login(userData).subscribe(
      (response) => {
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('verification', response.data.verification);
        Swal.fire({
          icon: "success",
          title: "Código de verificación enviado al correo",
          text: "Se ha enviado un correo de verificación a tu correo.",
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
    )
  }
}
