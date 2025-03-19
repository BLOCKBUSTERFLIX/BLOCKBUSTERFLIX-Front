import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {

  paymentForm: FormGroup;
  paymentId: string | null = null;
  errors: any = {}; 
  rentals: any[] = [];
  customers: any[] = [];
  staff: any[] = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.paymentForm = this.fb.group({
      customer_id: ['', [Validators.required]],
      staff_id: ['', [Validators.required]],
      rental_id: [''],
      amount: ['', [Validators.required]],
      payment_date: ['', [ Validators.maxLength(255)]],
    });
    this.route.params.subscribe(params => {
      this.paymentId = params['id'];
      this.getPayment();
    });

    this.loadRentals();
    this.loadCustomers();
    this.loadStaff();
  }

  ngOnInit(): void {
    if (this.paymentId) {
      this.getPayment();
    }
  }

  getPayment(){
    this.paymentId = this.route.snapshot.paramMap.get('id');
    this.crudService.get("payments", this.paymentId).subscribe(
      (response)=> {
        if(response.data){
          console.log(response.data)
          this.paymentForm = this.fb.group({
            customer_id: [response.data.customer_id, [Validators.required]],
            staff_id: [response.data.staff_id, [Validators.required]],
            rental_id: [response.data.rental_id],
            amount: [response.data.amount, [Validators.required]],
            payment_date: [undefined, [ Validators.maxLength(255)]],
          });
          if (response.data.payment_date)
          this.paymentForm.patchValue({
            payment_date: this.formatDate(response.data.payment_date)
          }); 
          console.log(this.paymentForm.value.payment_date)
        }
      }, (error) => {
        if (error.name === 'TimeoutError') {
          this.getPayment();
        }
      }
    );
  }
  
  onSubmit(): void {
    if (this.paymentForm.invalid) return;

    this.errors = {};
    if (this.paymentForm.value.payment_date){
      this.paymentForm.patchValue({
        payment_date: this.formatDateBD(this.paymentForm.value.payment_date),
      });
    }
    console.log(this.paymentForm.value)
    const request = this.paymentId
      ?  this.crudService.put("payments", this.paymentId, this.paymentForm.value)
      : this.crudService.post("payments", this.paymentForm.value)

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.paymentId ? 'Pago actualizado' : 'Pago creado',
          icon: 'success',
          timer: 3000,  
          showConfirmButton: true,
          allowOutsideClick: true, 
          willClose: () => {
            this.router.navigate(['crud/payments']);
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
  loadRentals() {
    this.crudService.all("rentals").subscribe(
      (response) => {
        this.rentals = response.data;
        console.log(this.rentals)
      },
      (error) => {
        console.error("Error al cargar las rentas", error);
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
    this.crudService.all("staffs").subscribe(
      (response) => {
        this.staff = response.data;
        console.log(this.staff)
      },
      (error) => {
        console.error("Error al cargar el staff", error);
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
