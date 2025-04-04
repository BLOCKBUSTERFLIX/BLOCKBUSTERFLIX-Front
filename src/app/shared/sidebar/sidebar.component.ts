import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements AfterViewInit {
  username = signal<string | null>(null);
  constructor(private el: ElementRef){}

  ngAfterViewInit(): void {
    if(localStorage.getItem('username') != ""){
      this.username.set(localStorage.getItem('username'));
    }else{
      this.username.set('Equipo 7')
    }
    this.initializeSidebar();
  }

  private initializeSidebar(): void {
    const menuItems = this.el.nativeElement.querySelectorAll('.nav-item > a');

    menuItems.forEach((item: HTMLElement) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();

        const parent = item.parentElement;
        if (!parent) return;

        const subMenu = parent.querySelector('.nav-treeview');

        if (subMenu) {
          const isVisible = subMenu.classList.contains('show');

          this.closeAllMenus();

          if (!isVisible) {
            subMenu.classList.add('show');
            parent.classList.add('menu-open');
          }
        }
      });
    });
  }

  private closeAllMenus(): void {
    const openMenus = this.el.nativeElement.querySelectorAll('.nav-treeview.show');
    openMenus.forEach((menu: HTMLElement) => {
      menu.classList.remove('show');
      menu.parentElement?.classList.remove('menu-open');
    });
  }
}
