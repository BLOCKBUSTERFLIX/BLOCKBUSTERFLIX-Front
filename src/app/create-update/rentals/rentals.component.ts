import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './rentals.component.html',
  styleUrl: './rentals.component.css'
})
export class RentalsComponent implements OnInit {

  rentalForm: FormGroup;
  rentalId: string | null = null;
  errors: any = {}; 
  inventories: any[] = [];
  customers: any[] = [];
  staff: any[] = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.rentalForm = this.fb.group({
      rental_date: ['', [Validators.required, Validators.maxLength(255)]],
      inventory_id: ['', [Validators.required]],
      customer_id: ['', [Validators.required]],
      return_date: ['', [ Validators.maxLength(255)]],
      staff_id: ['', [Validators.required]],


    });
    this.route.params.subscribe(params => {
      this.rentalId = params['id'];
      this.getRental();
    });

    this.loadInventories();
    this.loadCustomers();
    this.loadStaff();
  }

  ngOnInit(): void {
    if (this.rentalId) {
      this.getRental();
    }
  }

  getRental(){
    this.rentalId = this.route.snapshot.paramMap.get('id');
    this.crudService.get("rentals", this.rentalId).subscribe(
      (response)=> {
        if(response.data){
          console.log(response.data)
          this.rentalForm = this.fb.group({
            rental_date: [this.formatDate(response.data.rental_date), [Validators.required, Validators.maxLength(255)]],
            inventory_id: [response.data.inventory_id, [Validators.required]],
            customer_id: [response.data.customer_id, [Validators.required]],
            staff_id: [response.data.staff_id, [Validators.required]],
            return_date: [undefined]
          });
          if (this.rentalForm.value.return_date)
          this.rentalForm.patchValue({
            return_date: this.formatDate(response.data.return_date)
          }); 
          console.log(this.rentalForm.value.return_date)
        }
      }, (error) => {
        if (error.name === 'TimeoutError') {
          this.getRental();
        }
      }
    );
  }
  
  onSubmit(): void {
    if (this.rentalForm.invalid) return;

    this.errors = {};
    if (this.rentalForm.value.return_date){
      this.rentalForm.patchValue({
        return_date: this.formatDateBD(this.rentalForm.value.return_date),
      });
    }
    console.log(this.rentalForm.value.rental_date)
    this.rentalForm.patchValue({
      rental_date: this.formatDateBD(this.rentalForm.value.rental_date),
    });
    console.log(this.rentalForm.value)
    const request = this.rentalId
      ?  this.crudService.put("rentals", this.rentalId, this.rentalForm.value)
      : this.crudService.post("rentals", this.rentalForm.value)

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.rentalId ? 'Renta actualizado' : 'Renta creado',
          icon: 'success',
          timer: 3000,  
          showConfirmButton: true,
          allowOutsideClick: true, 
          willClose: () => {
            this.router.navigate(['crud/rentals']);
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
  loadInventories() {
    this.crudService.all("inventories").subscribe(
      (response) => {
        this.inventories = response.data;
        console.log(this.inventories)
      },
      (error) => {
        console.error("Error al cargar el inventario", error);
      }
    );
  }
  loadCustomers() {
    this.crudService.all("customers").subscribe(
      (response) => {
        this.customers = response.data;
        console.log(this.customers)
      },
      (error) => {
        console.error("Error al cargar los clientes", error);
      }
    );
  }
  loadStaff() {
    this.crudService.all("staff").subscribe(
      (response) => {
        this.staff = response.data;
        console.log(this.staff)
      },
      (error) => {
        console.error("Error al cargar las direcciones", error);
      }
    );
  }
  formatDate(dateString: string): string {
    return dateString.replace(' ', 'T').slice(0, 16); 
  }
  formatDateBD(dateString: string): string {
    return dateString.replace('T', ' ') + ':00'; // Agrega segundos si es necesario
  }
  
}