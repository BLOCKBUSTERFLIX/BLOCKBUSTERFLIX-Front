import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';
import { log } from 'node:console';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent implements OnInit {

  countryForm: FormGroup;
  countryId: string | null = null;
  errors: any = {}; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.countryForm = this.fb.group({
      country: ['', [Validators.required, Validators.maxLength(50)]]
    });

    this.route.params.subscribe(params => {
      this.countryId = params['id'];
      this.getCountry();
    });
  }

  ngOnInit(): void {
    if (this.countryId) {
      this.getCountry();
    }
  }

  getCountry(){
    this.countryId = this.route.snapshot.paramMap.get('id');
    if (this.countryId) {
      this.crudService.get("countries", this.countryId).subscribe(
        (response)=> {
          if(response.data){
            this.countryForm.patchValue(response.data);
          }
        }, (error) => {
          if (error.name === 'TimeoutError') {
            this.getCountry();
          }
        }
      );
    }
  }
  
  onSubmit(): void {
    if (this.countryForm.invalid) return;

    this.errors = {};

    const request = this.countryId
      ? this.crudService.put("countries", this.countryId, this.countryForm.value)
      : this.crudService.post("countries", this.countryForm.value);

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.countryId ? 'País actualizado' : 'País creado',
          icon: 'success',
          timer: 3000,
          showConfirmButton: true,
          allowOutsideClick: true,
          willClose: () => {
            this.router.navigate(['crud/countries']);
          }
        });
      },
      error: (err) => {
        if (err.status === 400 && err.error.errors) {
          this.errors = err.error.errors;
        } else {
          Swal.fire({
            title: 'Ocurrió un error',
            icon: 'error',
          });
        }
      }
    });
  }
}
