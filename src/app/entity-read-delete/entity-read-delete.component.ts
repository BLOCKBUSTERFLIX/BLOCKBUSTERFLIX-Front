import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CRUDService } from '../crud.service';
import { timeout } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entity-read-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './entity-read-delete.component.html',
  styleUrl: './entity-read-delete.component.css'
})
export class EntityReadDeleteComponent {
  table: string = '';
  msg: string = "Cargando..."
  cargando: boolean = false
  data: any = []
  columns: any = null

  constructor(private router: Router, private route: ActivatedRoute, private crudService: CRUDService, private fb: FormBuilder) {
    this.route.params.subscribe(params => {
      this.cargando = false
      this.data = []
      this.columns = null

      this.table = params['table'];
      this.tableInfo();
      this.all();
      this.msg = "Cargando..."
    });
  }

  onInit(){

  }
  all() {
    this.crudService.all(this.table).pipe(
      timeout(10000)
    ).subscribe(
      (response) => {
        this.cargando = true
        if (response.data) {
          this.data = response.data;
        }
        this.msg = response.msg;
      },
      (error) => {
        console.log(error)
        if (error.name === 'TimeoutError') {
          this.all()
        } else {
          this.router.navigate(['not-found']);
        }
      }
    );
  }

  tableInfo() {
    this.crudService.info(this.table).pipe(
      timeout(10000)
    ).subscribe(
      (response) => {
        if (response) {
          this.columns = Object.values(response);
        }
      },
      (error) => {
        if (error.name === 'TimeoutError') {
          this.tableInfo()
        } else {
          this.router.navigate(['not-found']);
        }
      }
    );

  }

  delete(id: number) {
    Swal.fire({
      title: "Seguro que quieres eliminarlo?",
      text: "No hay vuelta atras!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Estoy seguro!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.crudService.delete(this.table, id).pipe(
          timeout(10000)
        ).subscribe(
          () => {
            Swal.fire({
              title: "Se ha eliminado!",
              text: "Ya no existe el dato.",
              icon: "success"
            });
            this.all()
          },
          (error) => {
            if (error.name === 'TimeoutError') {
              this.all()
            } else if (error.status === 404) {
              this.router.navigate(['not-found']);
            } else {
              Swal.fire({
                title: "Hubo un error!",
                text: "No se encontro el dato.",
                icon: "error"
              });

            }
          }
        );
      }
    });

  }
  post(){
    this.router.navigate([`new/${this.table}`]);
  }
  put(id: number){
    this.router.navigate([`update/${this.table}/${id}`]);
  }
}
