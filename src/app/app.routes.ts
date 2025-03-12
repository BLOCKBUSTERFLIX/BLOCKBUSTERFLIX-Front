import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', title: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), children: [
            { path: '', loadComponent: () => import('./principal/principal.component').then(m => m.PrincipalComponent) },
            { path: 'crud/:table', loadComponent: () => import('./entity-read-delete/entity-read-delete.component').then(m => m.EntityReadDeleteComponent) },
        ]
    },
    { path: '**', title: 'Not-found', loadComponent: ()=> import('./error-404/error-404.component').then(c => c.Error404Component)}
];
