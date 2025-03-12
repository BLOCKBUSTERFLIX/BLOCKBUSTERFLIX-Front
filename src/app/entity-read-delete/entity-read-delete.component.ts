import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CRUDService } from '../crud.service';
import { timeout } from 'rxjs';

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
  data: any
  columns: any

  constructor(private router: Router, private route: ActivatedRoute, private crudService: CRUDService, private fb: FormBuilder) {
    this.route.params.subscribe(params => {
      this.table = params['table'];
      console.log(this.table);
      this.tableInfo();
      this.all();
      this.msg = "Cargando..."
    });
  }

  all() {
    this.crudService.all(this.table).pipe(
      timeout(10000)
    ).subscribe(
      (response) => {
        if (response.data) {
          this.data = response.data;
        }
        this.msg = response.msg;
      },
      (error) => {
        if (error.name === 'TimeoutError') {
          this.all()
        } else if (error.status === 404) {
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
        console.log(response)
        if (response) {
          this.columns = response;
        }
      },
      (error) => {
        if (error.name === 'TimeoutError') {
          this.tableInfo()
        } else if (error.status === 404) {
          this.router.navigate(['not-found']);
        }
      }
    );

  }

  delete(id: number) {
    this.crudService.delete(this.table, id).pipe(
      timeout(10000)
    ).subscribe(
      (response) => {
        this.all()
      },
      (error) => {
        if (error.name === 'TimeoutError') {
          this.all()
        } else if (error.status === 404) {
          this.router.navigate(['not-found']);
        }
      }
    );
  }


}
