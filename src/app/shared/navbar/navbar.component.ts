import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  hidden:boolean = false;
  token = localStorage.getItem('token');
  private openSubMenus: { [key: string]: boolean } = {};

  toggleSubMenu(menu: string): void {
    this.openSubMenus[menu] = !this.openSubMenus[menu];
  }

  isSubMenuOpen(menu: string): boolean {
    return this.openSubMenus[menu] || false;
  }

  constructor(
    private service: AuthService,
    private router: Router,
  ){}

  ngOnInit(){
    if (this.token !== null && this.token !== "") {
      this.hidden = true;
    }
  }

  logOut() {
    Swal.fire({
      title: "¿Estás seguro de que quieres salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.logout().subscribe(
          (response) => {
            this.hidden = false;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            Swal.fire({
              icon: "success",
              title: "Cuenta cerrada",
              text: "Te redirigiré a la página de inicio de sesión",
              showConfirmButton: false,
              timer: 1500,
              didClose: () => {
                this.router.navigate(['/login']);
              }
            });
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    });
  }  
}
