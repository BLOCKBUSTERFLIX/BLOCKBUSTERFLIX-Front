import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.css'
})
export class StoresComponent implements OnInit {
  storeForm: FormGroup;
  storeId: string | null = null;
  errors: any = {};
  staffList: any[] = [];
  addresses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.storeForm = this.fb.group({
      manager_staff_id: ['', [Validators.required]],
      address_id: ['', [Validators.required]]
    });

    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        this.getStore();
      }
    });
  }

  ngOnInit(): void {
    this.getStaffList();
    this.getAddresses();
    if (this.storeId) {
      this.getStore();
    }
  }

  getStore(): void {
    this.crudService.get('stores', this.storeId).subscribe(
      (response) => {
        if (response.data) {
          this.storeForm.patchValue(response.data);
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la tienda',
          icon: 'error'
        });
      }
    );
  }

  getStaffList(): void {
    this.crudService.all('staff').subscribe(
      (response) => {
        if (response.data) {
          this.staffList = response.data;
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error al obtener el personal',
          icon: 'error',
          text: 'No se pudo cargar la lista de empleados. Inténtalo más tarde.',
        });
      }
    );
  }

  getAddresses(): void {
    this.crudService.all('addresses').subscribe(
      (response) => {
        if (response.data) {
          this.addresses = response.data;
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error al obtener direcciones',
          icon: 'error',
          text: 'No se pudieron cargar las direcciones. Inténtalo más tarde.',
        });
      }
    );
  }

  onSubmit(): void {
    if (this.storeForm.invalid) return;
    this.errors = {};

    const request = this.storeId
      ? this.crudService.put('stores', this.storeId, this.storeForm.value)
      : this.crudService.post('stores', this.storeForm.value);

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.storeId ? 'Tienda actualizada' : 'Tienda creada',
          icon: 'success',
          timer: 3000,
          showConfirmButton: true,
          willClose: () => {
            this.router.navigate(['crud/stores']);
          }
        });
      },
      error: (err) => {
        if (err.status === 400 && err.error.errors) {
          this.errors = err.error.errors;
        } else {
          Swal.fire({
            title: 'Ocurrió un error',
            icon: 'error'
          });
        }
      }
    });
  }
}
