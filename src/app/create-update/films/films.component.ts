import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css'
})
export class FilmsComponent implements OnInit{
  filmForm: FormGroup;
  filmId: string | null = null;
  idiomaId: string | null = null;
  errors: any = {};
  languages: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.filmForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      release_year: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      language_id: ['', [Validators.required]],
      original_language_id: [''],
      rental_duration: ['', [Validators.required]],
      rental_rate: ['', [Validators.required]],
      length: ['', [Validators.required]],
      replacement_cost: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      special_features: ['']
    });

    this.route.params.subscribe(params => {
      this.filmId = params['id'];
      if (this.filmId) {
        this.getFilm();
      }
    });
  }

  ngOnInit(): void {
    this.getLanguages();
    if (this.filmId) {
      this.getFilm();
    }
  }

  getFilm(): void {
    this.crudService.get('films', this.filmId).subscribe(
      (response) => {
        if (response.data) {
          this.filmForm.patchValue(response.data);
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la película',
          icon: 'error'
        });
      }
    ); 
  }
  // Función para obtener los idiomas de la API
  getLanguages() {
    this.crudService.all('languages').subscribe(
      (response) => {
        if (response.data) {
          this.languages = response.data; // Almacena los idiomas obtenidos
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error al obtener idiomas',
          icon: 'error',
          text: 'No se pudieron cargar los idiomas. Inténtalo más tarde.',
        });
      }
    );
  }

  onSubmit(): void {
    if (this.filmForm.invalid) return;
    console.log(this.filmForm.value);
    console.log('URL completa:', window.location.href);
    this.errors = {};

    const request = this.filmId
      ? this.crudService.put('films', this.filmId, this.filmForm.value)
      : this.crudService.post('films', this.filmForm.value);

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.filmId ? 'Película actualizada' : 'Película creada',
          icon: 'success',
          timer: 3000,
          showConfirmButton: true,
          willClose: () => {
            this.router.navigate(['crud/films']);
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
