import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.css'
})
export class LanguagesComponent implements OnInit{
  languageForm: FormGroup;
  languageId: string | null = null;
  errors: any = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.languageForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
    });

    this.route.params.subscribe(params => {
      this.languageId = params['id'];
      if (this.languageId) {
        this.getLanguage();
      }
    });
  }

  ngOnInit(): void {
    if (this.languageId) {
      this.getLanguage();
    }
  }

  getLanguage(): void {
    this.crudService.get('languages', this.languageId).subscribe(
      (response) => {
        if (response.data) {
          this.languageForm.patchValue(response.data);
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el idioma',
          icon: 'error'
        });
      }
    );
  }

  onSubmit(): void {
    if (this.languageForm.invalid) return;
    console.log(this.languageForm.value);
    this.errors = {};

    const request = this.languageId
      ? this.crudService.put('languages', this.languageId, this.languageForm.value)
      : this.crudService.post('languages', this.languageForm.value);

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.languageId ? 'Idioma actualizado' : 'Idioma creado',
          icon: 'success',
          timer: 3000,
          showConfirmButton: true,
          willClose: () => {
            this.router.navigate(['crud/languages']);
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
