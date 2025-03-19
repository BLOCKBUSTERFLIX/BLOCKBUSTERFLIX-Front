import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {

  customerForm: FormGroup;
  customerId: string | null = null;
  errors: any = {}; 
  addresses: any[] = [];
  stores: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.customerForm = this.fb.group({
      store_id: ['', [Validators.required]],
      first_name: ['', [Validators.required, Validators.maxLength(255)]],
      last_name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.email,Validators.maxLength(255)]],
      address_id: ['', [Validators.required]],
    });
    this.route.params.subscribe(params => {
      this.customerId = params['id'];
      this.getCustomer();
    });

    this.loadAddresses();
    this.loadStores();
  }

  ngOnInit(): void {
    if (this.customerId) {
      this.getCustomer();
    }
  }

  getCustomer(){
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.crudService.get("customers", this.customerId).subscribe(
      (response)=> {
        if(response.data){
          this.customerForm = this.fb.group({
            first_name: [response.data.first_name, [Validators.required, Validators.maxLength(255)]],
            last_name: [response.data.last_name, [Validators.required, Validators.maxLength(255)]],
            store_id: [response.data.store_id, [Validators.required]],
            email: [response.data.email, [Validators.email,Validators.maxLength(255)]],
            address_id: [response.data.address_id, [Validators.required]],
          });
        }
      }, (error) => {
        if (error.name === 'TimeoutError') {
          this.getCustomer();
        }
      }
    );
  }
  
  onSubmit(): void {
    if (this.customerForm.invalid) return;

    this.errors = {};

    const request = this.customerId
      ? this.crudService.put("customers", this.customerId, this.customerForm.value)
      : this.crudService.post("customers", this.customerForm.value)

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.customerId ? 'Cliente actualizado' : 'Cliente creado',
          icon: 'success',
          timer: 3000,  
          showConfirmButton: true,
          allowOutsideClick: true, 
          willClose: () => {
            this.router.navigate(['crud/customers']);
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
  loadAddresses() {
    this.crudService.all("addresses").subscribe(
      (response) => {
        this.addresses = response.data;
        console.log(this.addresses)
      },
      (error) => {
        console.error("Error al cargar las direcciones", error);
      }
    );
  }
  loadStores() {
    this.crudService.all("stores").subscribe(
      (response) => {
        this.stores = response.data;
        console.log(this.stores)
      },
      (error) => {
        console.error("Error al cargar las tiendas", error);
      }
    );
  }

}