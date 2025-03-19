import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.css'
})
export class InventoriesComponent implements OnInit {

  inventorieForm: FormGroup;
  inventorieId: string | null = null;
  errors: any = {}; 
  films: any[] = [];
  stores: any[] = [];
  addresses: any[] = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.inventorieForm = this.fb.group({
      film_id: ['', [Validators.required]],
      store_id: ['', [Validators.required]],
    });
    this.route.params.subscribe(params => {
      this.inventorieId = params['id'];
      this.getInventorie();
    });

    this.loadFilms();
    this.loadStores();
    this.loadAddresses();
  }

  ngOnInit(): void {
    if (this.inventorieId) {
      this.getInventorie();
    }
  }

  getInventorie(){
    this.inventorieId = this.route.snapshot.paramMap.get('id');
    this.crudService.get("inventories", this.inventorieId).subscribe(
      (response)=> {
        if(response.data){
          this.inventorieForm = this.fb.group({
            store_id: [response.data.store_id, [Validators.required]],
            film_id: [response.data.film_id, [Validators.required]],
          });
        }
      }, (error) => {
        if (error.name === 'TimeoutError') {
          this.getInventorie();
        }
      }
    );
  }
  
  onSubmit(): void {
    if (this.inventorieForm.invalid) return;

    this.errors = {};

    const request = this.inventorieId
      ? this.crudService.put("inventories", this.inventorieId, this.inventorieForm.value)
      : this.crudService.post("inventories", this.inventorieForm.value)

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.inventorieId ? 'Cliente actualizado' : 'Cliente creado',
          icon: 'success',
          timer: 3000,  
          showConfirmButton: true,
          allowOutsideClick: true, 
          willClose: () => {
            this.router.navigate(['crud/inventories']);
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
  loadFilms() {
    this.crudService.all("films").subscribe(
      (response) => {
        this.films = response.data;
        console.log(this.films)
      },
      (error) => {
        console.error("Error al cargar las peliculas", error);
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
}