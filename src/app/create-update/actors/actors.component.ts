import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDService } from '../../crud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './actors.component.html',
  styleUrl: './actors.component.css'
})
export class ActorsComponent implements OnInit {

  actorForm: FormGroup;
  actorId: string | null = null;
  errors: any = {}; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CRUDService
  ) {
    this.actorForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(255)]],
      last_name: ['', [Validators.required, Validators.maxLength(255)]]
    });
    this.route.params.subscribe(params => {
      this.actorId = params['id'];
      this.getActor();
    });
  }

  ngOnInit(): void {
    if (this.actorId) {
      this.getActor();
    }
  }

  getActor(){
    this.actorId = this.route.snapshot.paramMap.get('id');
    this.crudService.get("actors", this.actorId).subscribe(
      (response)=> {
        if(response.data){
          this.actorForm = this.fb.group({
            first_name: [response.data.first_name, [Validators.required, Validators.maxLength(255)]],
            last_name: [response.data.last_name, [Validators.required, Validators.maxLength(255)]]
          });
        }
      }, (error) => {
        if (error.name === 'TimeoutError') {
          this.getActor();
        }
      }
    );
  }
  
  onSubmit(): void {
    if (this.actorForm.invalid) return;

    this.errors = {};

    const request = this.actorId
      ? this.crudService.put("actors", this.actorId, this.actorForm.value)
      : this.crudService.post("actors", this.actorForm.value)

    request.subscribe({
      next: () => {
        Swal.fire({
          title: this.actorId ? 'Actor actualizado' : 'Actor creado',
          icon: 'success',
          timer: 3000,  
          showConfirmButton: true,
          allowOutsideClick: true, 
          willClose: () => {
            this.router.navigate(['crud/actors']);
          }
        });      },
      error: (err) => {
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
}