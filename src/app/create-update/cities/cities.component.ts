import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent implements OnInit {

  cityForm: FormGroup;
  cityId: string | null = null;
  errors: any = {}; 
  countries: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.cityForm = this.fb.group({
      city: ['', [Validators.required, Validators.maxLength(50)]],
      country_id: ['', [Validators.required]]
    });

    this.route.params.subscribe(params => {
      this.cityId = params['id'];
      this.getCity();
    });

    this.loadCountries();
  }

  ngOnInit(): void {
    if (this.cityId) {
      this.getCity();
    }
  }

  getCity(){
    this.cityId = this.route.snapshot.paramMap.get('id');
    if (this.cityId) {
      this.crudService.get("cities", this.cityId).subscribe(
        (response)=> {
          if(response.data){
            this.cityForm.patchValue(response.data);
          }
        }, (error) => {
          if (error.name === 'TimeoutError') {
            this.getCity();
          }
        }
      );
    }
  }

  loadCountries() {
    this.crudService.all("countries").subscribe(
      (response) => {
        this.countries = response.data;
      },
      (error) => {
        console.error("Error al cargar países", error);
      }
    );
  }
  
  onSubmit(): void {
    if (this.cityForm.invalid) return;

    this.errors = {};

    const request = this.cityId
      ? this.crudService.put("cities", this.cityId, this.cityForm.value)
      : this.crudService.post("cities", this.cityForm.value);

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.cityId ? 'Ciudad actualizada' : 'Ciudad creada',
          icon: 'success',
          timer: 3000,
          showConfirmButton: true,
          allowOutsideClick: true,
          willClose: () => {
            this.router.navigate(['crud/cities']);
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
