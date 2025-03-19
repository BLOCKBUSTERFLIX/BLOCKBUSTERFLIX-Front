import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {
  staffForm: FormGroup;
  staffId: string | null = null;
  errors: any = {};
  stores: any[] = [];
  addresses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.staffForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(255)]],
      last_name: ['', [Validators.required, Validators.maxLength(255)]],
      store_id: ['', [Validators.required]],
      address_id: ['', [Validators.required]],
      picture: [''],
      email: ['', [Validators.required, Validators.email]],
      active: [true, [Validators.required]],
      username: ['', [Validators.required, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.route.params.subscribe(params => {
      this.staffId = params['id'];
      if (this.staffId) {
        this.getStaff();
      }
    });
  }

  ngOnInit(): void {
    this.getStores();
    this.getAddresses();
    if (this.staffId) {
      this.getStaff();
    }
  }

  getStaff(): void {
    this.crudService.get('staff', this.staffId).subscribe(
      (response) => {
        if (response.data) {
          this.staffForm.patchValue(response.data);
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el staff',
          icon: 'error'
        });
      }
    );
  }

  getStores(): void {
    this.crudService.all('stores').subscribe(
      (response) => {
        if (response.data) {
          this.stores = response.data;
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error al obtener tiendas',
          icon: 'error',
          text: 'No se pudieron cargar las tiendas. Inténtalo más tarde.',
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
    if (this.staffForm.invalid) return;
    console.log(this.staffForm.value);
    console.log('URL completa:', window.location.href);
    this.errors = {};
    
    const request = this.staffId
      ? this.crudService.put('staff', this.staffId, this.staffForm.value)

      : this.crudService.post('staff', this.staffForm.value);

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.staffId ? 'Staff actualizado' : 'Staff creado',
          icon: 'success',
          timer: 3000,
          showConfirmButton: true,
          willClose: () => {
            this.router.navigate(['crud/staff']);
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
