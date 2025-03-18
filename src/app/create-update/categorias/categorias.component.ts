import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit{
  categoryForm: FormGroup;
  categoryId: string | null = null;
  errors: any = {}; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ){
    this.categoryForm = this.fb.group({
      name: ['',[Validators.required, Validators.maxLength(50)]]
    });
    this.route.params.subscribe(params =>{
      this.categoryId = params['id'];
      this.getCategory();
    })

  }

  ngOnInit(): void {
    if(this.categoryId){
      this.getCategory();
    }
  }

  getCategory(){
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.crudService.get("categories", this.categoryId).subscribe(
        (response)=> {
          if(response.data){
            this.categoryForm.patchValue(response.data);
          }
        }, (error) => {
          if (error.name === 'TimeoutError') {
            this.getCategory();
          }
        }
      );
    }
  }

  onSubmit(): void {
      if (this.categoryForm.invalid) return;
  
      this.errors = {};
  
      const request = this.categoryId
        ? this.crudService.put("categories", this.categoryId, this.categoryForm.value)
        : this.crudService.post("categories", this.categoryForm.value);
  
      request.subscribe({
        next: () => {
          Swal.fire({
            title: this.categoryId ? 'Categoria actualizado' : 'Categoria creado',
            icon: 'success',
            timer: 3000,
            showConfirmButton: true,
            allowOutsideClick: true,
            willClose: () => {
              this.router.navigate(['crud/categories']);
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
