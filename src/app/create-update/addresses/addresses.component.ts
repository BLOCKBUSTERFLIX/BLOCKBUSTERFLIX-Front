import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent implements OnInit {

  addressForm: FormGroup;
  addressId: string | null = null;
  errors: any = {}; 
  cities: any[] = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.addressForm = this.fb.group({
      address: ['', [Validators.required, Validators.maxLength(255)]],
      address2: ['', [Validators.maxLength(255)]],
      district: ['', [Validators.required, Validators.maxLength(255)]],
      city_id: ['', [Validators.required]],
      postal_code: ['', [ Validators.maxLength(10)]],
      phone: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
    });
    this.route.params.subscribe(params => {
      this.addressId = params['id'];
      this.getAddress();
    });

    this.loadCities();
  }

  ngOnInit(): void {
    if (this.addressId) {
      this.getAddress();
    }
  }

  getAddress(){
    this.addressId = this.route.snapshot.paramMap.get('id');
    this.crudService.get("addresses", this.addressId).subscribe(
      (response)=> {
        if(response.data){
          console.log(response.data)
          this.addressForm = this.fb.group({
            address: [response.data.address, [Validators.required, Validators.maxLength(255)]],
            address2: [response.data.address2, [Validators.maxLength(255)]],
            district: [response.data.district, [Validators.required, Validators.maxLength(255)]],
            city_id: [response.data.city_id, [Validators.required]],
            postal_code: [response.data.postal_code, [ Validators.maxLength(10)]],
            phone: [response.data.phone, [Validators.required, Validators.maxLength(255)]],
            location: [response.data.location, [Validators.required, Validators.maxLength(255)]],
          });
        }
      }, (error) => {
        if (error.name === 'TimeoutError') {
          this.getAddress();
        }
      }
    );
  }
  
  onSubmit(): void {
    if (this.addressForm.invalid) return;

    this.errors = {};
    const request = this.addressId
      ?  this.crudService.put("addresses", this.addressId, this.addressForm.value)
      : this.crudService.post("addresses", this.addressForm.value)

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.addressId ? 'Dirección actualizado' : 'Dirección creado',
          icon: 'success',
          timer: 3000,  
          showConfirmButton: true,
          allowOutsideClick: true, 
          willClose: () => {
            this.router.navigate(['crud/addresses']);
          }
        });      },
      error: (err) => {
        console.log(err)
        if (err.status === 400 && err.error.errors) {
          this.errors = err.error.errors; 
        } else {
          Swal.fire({
            title: 'Ocurrio un error',
            icon: 'error',            
          });         
        }
      }
    });
  }
  loadCities() {
    this.crudService.all("cities").subscribe(
      (response) => {
        this.cities = response.data;
        console.log(this.cities)
      },
      (error) => {
        console.error("Error al cargar el inventario", error);
      }
    );
  }
}